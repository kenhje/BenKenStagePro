import SwiftUI
import WebKit
import AVFoundation
import CoreAudioKit
import UIKit

@main struct BenKenMIDIApp: App {
    var body: some Scene { WindowGroup { BenKenScreen().ignoresSafeArea(.container, edges: .bottom) } }
}
struct BenKenScreen: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> BenKenController { BenKenController() }
    func updateUIViewController(_ controller: BenKenController, context: Context) {}
}
private final class MIDIMessageHandler: NSObject, WKScriptMessageHandler {
    weak var owner: BenKenController?
    init(_ owner: BenKenController) { self.owner = owner }
    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) { owner?.userContentController(controller, didReceive: message) }
}
final class BenKenController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate, WKDownloadDelegate {
    private let host = "kenhje.github.io"
    private var web: WKWebView!
    private var midi: MIDIService!
    private var observers: [NSObjectProtocol] = []
    private var downloads: [ObjectIdentifier: URL] = [:]
    override func viewDidLoad() {
        super.viewDidLoad()
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .default()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.limitsNavigationsToAppBoundDomains = true
        config.userContentController.add(MIDIMessageHandler(self), name: "benkenMIDI")
        let bridge = """
        window.BenKenNativeMIDI={connect:()=>window.webkit.messageHandlers.benkenMIDI.postMessage({command:'connect'}),bluetooth:()=>window.webkit.messageHandlers.benkenMIDI.postMessage({command:'bluetooth'})};
        """
        config.userContentController.addUserScript(WKUserScript(source: bridge, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = self; web.uiDelegate = self
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(web)
        NSLayoutConstraint.activate([web.leadingAnchor.constraint(equalTo: view.leadingAnchor), web.trailingAnchor.constraint(equalTo: view.trailingAnchor), web.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor), web.bottomAnchor.constraint(equalTo: view.bottomAnchor)])
        midi = MIDIService()
        midi.receive = { [weak self] source, bytes in
            guard let self = self, UIApplication.shared.applicationState == .active else { return }
            self.send("window.BenKenReceiveMIDI?.(\(bytes),\(self.json(source)))")
        }
        midi.portsChanged = { [weak self] ports in self?.event("benken-native-midi-sources", ports) }
        observers.append(NotificationCenter.default.addObserver(forName: AVAudioSession.routeChangeNotification, object: nil, queue: .main) { [weak self] notification in
            let value = notification.userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt
            if value == AVAudioSession.RouteChangeReason.newDeviceAvailable.rawValue || value == AVAudioSession.RouteChangeReason.oldDeviceUnavailable.rawValue { self?.configureAudio() }
        })
        configureAudio()
        web.load(URLRequest(url: URL(string: "https://kenhje.github.io/BenKenStagePro/")!))
        UIApplication.shared.isIdleTimerDisabled = true
    }
    deinit { observers.forEach { NotificationCenter.default.removeObserver($0) } }
    private func configureAudio() {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
            try session.setPreferredOutputNumberOfChannels(max(1, min(32, session.maximumOutputNumberOfChannels)))
        } catch { event("benken-native-midi-error", "Audio session: \(error.localizedDescription)") }
    }
    private func json(_ value: Any) -> String {
        guard let data = try? JSONSerialization.data(withJSONObject: value, options: [.fragmentsAllowed]), let text = String(data: data, encoding: .utf8) else { return "null" }; return text
    }
    private func send(_ script: String) { web?.evaluateJavaScript(script, completionHandler: nil) }
    private func event(_ name: String, _ detail: Any) { send("window.dispatchEvent(new CustomEvent(\(json(name)),{detail:\(json(detail))}))") }
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.frameInfo.isMainFrame, message.frameInfo.securityOrigin.host == host, let payload = message.body as? [String: Any], let command = payload["command"] as? String else { return }
        if command == "connect" { midi.refresh(); if let error = midi.error { event("benken-native-midi-error", error) } }
        if command == "bluetooth" { present(CABTMIDICentralViewController(), animated: true) }
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) { midi.refresh() }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        let alert = UIAlertController(title: "Could not open BenKen", message: "Upload V26.20 to GitHub and open the app online once. \(error.localizedDescription)", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Retry", style: .default) { [weak self] _ in self?.web.reload() }); present(alert, animated: true)
    }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if action.shouldPerformDownload { decisionHandler(.download); return }
        guard let url = action.request.url else { decisionHandler(.cancel); return }
        let allowed = url.scheme == "blob" || url.scheme == "about" || (url.scheme == "https" && url.host == host && url.path.hasPrefix("/BenKenStagePro/"))
        decisionHandler(allowed ? .allow : .cancel)
    }
    func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) { download.delegate = self }
    func webView(_ webView: WKWebView, navigationResponse: WKNavigationResponse, didBecome download: WKDownload) { download.delegate = self }
    func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String, completionHandler: @escaping (URL?) -> Void) {
        let folder = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        do { try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true); let url = folder.appendingPathComponent(URL(fileURLWithPath: suggestedFilename).lastPathComponent); downloads[ObjectIdentifier(download)] = url; completionHandler(url) }
        catch { completionHandler(nil) }
    }
    func downloadDidFinish(_ download: WKDownload) {
        guard let url = downloads.removeValue(forKey: ObjectIdentifier(download)) else { return }
        let share = UIActivityViewController(activityItems: [url], applicationActivities: nil)
        share.popoverPresentationController?.sourceView = web; share.popoverPresentationController?.sourceRect = CGRect(x: view.bounds.midX, y: view.bounds.midY, width: 1, height: 1)
        share.completionWithItemsHandler = { _, _, _, _ in try? FileManager.default.removeItem(at: url.deletingLastPathComponent()) }
        present(share, animated: true)
    }
    func download(_ download: WKDownload, didFailWithError error: Error, resumeData: Data?) {
        if let url = downloads.removeValue(forKey: ObjectIdentifier(download)) { try? FileManager.default.removeItem(at: url.deletingLastPathComponent()) }
        event("benken-native-midi-error", "Download failed: \(error.localizedDescription)")
    }
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: "BenKen", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() }); present(alert, animated: true)
    }
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = UIAlertController(title: "BenKen", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(false) }); alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) }); present(alert, animated: true)
    }
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        let alert = UIAlertController(title: "BenKen", message: prompt, preferredStyle: .alert); alert.addTextField { $0.text = defaultText }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(nil) }); alert.addAction(UIAlertAction(title: "Save", style: .default) { _ in completionHandler(alert.textFields?.first?.text) }); present(alert, animated: true)
    }
}
