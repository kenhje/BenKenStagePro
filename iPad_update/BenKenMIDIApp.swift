import SwiftUI
import WebKit
import AVFoundation
import CoreAudioKit
import UIKit

// Native startup and local-network diagnostics 26.31.3.
private enum BenKenStartup {
    static let bridge = #"""
    (() => {
      window.BenKenNativeNetwork={version:'26.31.3',post:payload=>window.webkit.messageHandlers.benkenNetwork.postMessage(payload)};
      window.BenKenNativeMIDI={connect:()=>window.webkit.messageHandlers.benkenMIDI.postMessage({command:'connect'}),bluetooth:()=>window.webkit.messageHandlers.benkenMIDI.postMessage({command:'bluetooth'})};
      window.__benkenStartupErrors=[];
      const report=message=>{
        const text=String(message||'Unknown page error').slice(0,600);
        window.__benkenStartupErrors.push(text);
        window.__benkenStartupErrors=window.__benkenStartupErrors.slice(-5);
        try{window.webkit.messageHandlers.benkenStartup.postMessage({command:'pageError',message:text})}catch{}
      };
      window.addEventListener('error',event=>{
        const file=event.filename||event.target?.src||event.target?.href||'';
        report((event.message||'A page resource could not load')+(file?' · '+String(file).split('?')[0]:'')+(event.lineno?' · line '+event.lineno:''));
      },true);
      window.addEventListener('unhandledrejection',event=>report(event.reason?.message||event.reason||'Page initialization failed'));
      const installNetworkTest=()=>{
        const panel=document.getElementById('ui24rPanel');if(!panel||document.getElementById('ui24rNativeTest'))return;
        const button=document.createElement('button'),status=document.createElement('p');
        button.setAttribute('id','ui24rNativeTest');button.type='button';button.textContent='TEST LOCAL NETWORK';
        status.setAttribute('id','ui24rNativeTestStatus');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
        status.textContent='Native network check 26.31.3. Tests the mixer directly without downloading the connection library.';
        let serial=0,pending='',timer;
        button.onclick=()=>{
          pending='ui24r-probe-'+(++serial);button.disabled=true;status.textContent='Testing the local mixer. Allow Local Network access if iPad asks…';
          clearTimeout(timer);timer=setTimeout(()=>{button.disabled=false;status.textContent='The native network test did not answer. Reopen BenKen and try again.'},15000);
          window.BenKenNativeNetwork.post({command:'probe',id:pending,host:document.getElementById('ui24rHost')?.value||''});
        };
        window.addEventListener('benken-native-network-test',event=>{
          const value=event.detail;if(value?.id!==pending)return;clearTimeout(timer);button.disabled=false;
          status.textContent=value.ok?'Local mixer reached at '+value.host+' · HTTP '+value.status+'. You can now try CONNECT.':String(value.message||'Local network test failed.');
        });
        panel.appendChild(button);panel.appendChild(status);
      };
      if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installNetworkTest,{once:true});else installNetworkTest();
    })();
    """#
    static let readiness = #"""
    (() => {
      const button=document.getElementById('settingsBtn');
      const update=document.getElementById('appUpdateError');
      return {
        ready:!!(document.getElementById('shell')&&typeof button?.onclick==='function'&&window.StageCore&&window.StageMixer),
        incomplete:!!(update&&!update.hidden),
        version:String(window.StagePerformance?.VERSION||''),
        state:String(document.readyState||''),
        title:String(document.title||''),
        errors:(window.__benkenStartupErrors||[]).slice(-3)
      };
    })();
    """#
}

// The app owns the local WebSocket. The hosted page never opens an insecure
// browser socket, and only private IPv4 mixer addresses on port 80 are allowed.
private final class Ui24RNetwork: NSObject, URLSessionWebSocketDelegate {
    private var tasks: [String: URLSessionWebSocketTask] = [:]
    private var probes: [String: URLSessionDataTask] = [:]
    private var probeSerial = 0
    private let emit: ([String: Any]) -> Void
    private lazy var session = URLSession(configuration: .ephemeral, delegate: self, delegateQueue: .main)
    init(emit: @escaping ([String: Any]) -> Void) { self.emit = emit }
    private func privateAddress(_ host: String) -> Bool {
        let text = host.split(separator: ".", omittingEmptySubsequences: false)
        guard text.count == 4 else { return false }
        let parts = text.compactMap { Int($0) }
        guard parts.count == 4, parts.allSatisfy({ (0...255).contains($0) }), zip(text, parts).allSatisfy({ String($0.1) == String($0.0) }) else { return false }
        return parts[0] == 10 || parts[0] == 192 && parts[1] == 168 || parts[0] == 172 && (16...31).contains(parts[1]) || parts[0] == 169 && parts[1] == 254
    }
    private func fail(_ id: String, _ message: String) {
        emit(["id": id, "type": "error", "message": message])
        let task = tasks.removeValue(forKey: id); task?.cancel(with: .goingAway, reason: nil)
        emit(["id": id, "type": "close", "code": 1006, "reason": message])
    }
    func handle(_ message: [String: Any]) {
        guard let id = message["id"] as? String, id.hasPrefix("ui24r-"), id.count < 80, let command = message["command"] as? String else { return }
        if command == "probe" { testLocalNetwork(id, message["host"] as? String ?? ""); return }
        if command == "open" {
            guard tasks[id] == nil, tasks.count < 4, let value = message["url"] as? String,
                  let url = URL(string: value), url.scheme == "ws", let host = url.host,
                  privateAddress(host), url.port == nil || url.port == 80,
                  url.user == nil, url.password == nil, url.fragment == nil,
                  url.path.hasPrefix("/socket.io/") else { fail(id, "Use the local Ui24R IP address on port 80."); return }
            var request = URLRequest(url: url); request.timeoutInterval = 12
            let task = session.webSocketTask(with: request); task.maximumMessageSize = 8 * 1024 * 1024
            tasks[id] = task; task.resume(); receive(id, task)
        } else if command == "send" {
            guard let task = tasks[id], let text = message["text"] as? String, text.utf8.count <= 65536 else { return }
            task.send(.string(text)) { [weak self, weak task] error in
                DispatchQueue.main.async { guard let self, let task, self.tasks[id] === task else { return }; if let error { self.fail(id, error.localizedDescription) } }
            }
        } else if command == "close" {
            let task = tasks.removeValue(forKey: id); task?.cancel(with: .normalClosure, reason: nil)
            emit(["id": id, "type": "close", "code": 1000])
        }
    }
    private func testLocalNetwork(_ id: String, _ value: String) {
        let host = value.trimmingCharacters(in: .whitespacesAndNewlines)
        guard privateAddress(host), let url = URL(string: "http://\(host)/") else {
            emit(["id": id, "type": "probe", "ok": false, "message": "Enter the mixer’s local IP address without http:// or a port."]); return
        }
        guard let usage = Bundle.main.object(forInfoDictionaryKey: "NSLocalNetworkUsageDescription") as? String, !usage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            emit(["id": id, "type": "probe", "ok": false, "message": "This installed app is missing its Local Network permission description. Update Info.plist in the Xcode app target and run again."]); return
        }
        probeSerial += 1; let serial = probeSerial
        probes.values.forEach { $0.cancel() }; probes.removeAll()
        var request = URLRequest(url: url); request.httpMethod = "GET"; request.timeoutInterval = 10; request.cachePolicy = .reloadIgnoringLocalCacheData
        let task = session.dataTask(with: request) { [weak self] _, response, error in
            DispatchQueue.main.async {
                guard let self, self.probeSerial == serial else { return }; self.probes.removeValue(forKey: id)
                if let error {
                    let failure = error as NSError
                    self.emit(["id": id, "type": "probe", "ok": false, "message": "Local network test failed: \(failure.localizedDescription) [\(failure.domain) \(failure.code)]. Check mixer Wi-Fi, IP and Settings → Privacy & Security → Local Network."])
                } else if let response = response as? HTTPURLResponse {
                    self.emit(["id": id, "type": "probe", "ok": true, "host": host, "status": response.statusCode])
                } else { self.emit(["id": id, "type": "probe", "ok": false, "message": "The mixer did not return an HTTP response."]) }
            }
        }
        probes[id] = task; task.resume()
    }
    func urlSession(_ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse, newRequest request: URLRequest, completionHandler: @escaping (URLRequest?) -> Void) {
        guard let url = request.url, let host = url.host, host == task.originalRequest?.url?.host, privateAddress(host),
              ["http", "ws"].contains(url.scheme ?? ""), url.port == nil || url.port == 80, url.user == nil, url.password == nil else { completionHandler(nil); return }
        completionHandler(request)
    }
    private func receive(_ id: String, _ task: URLSessionWebSocketTask) {
        task.receive { [weak self, weak task] result in
            DispatchQueue.main.async {
                guard let self, let task, self.tasks[id] === task else { return }
                switch result {
                case .success(.string(let text)): self.emit(["id": id, "type": "message", "text": text]); self.receive(id, task)
                case .success(.data(let data)):
                    if let text = String(data: data, encoding: .utf8) { self.emit(["id": id, "type": "message", "text": text]) }; self.receive(id, task)
                case .success: self.fail(id, "Unsupported mixer message.")
                case .failure(let error): self.fail(id, error.localizedDescription)
                }
            }
        }
    }
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didOpenWithProtocol protocol: String?) {
        if let id = tasks.first(where: { $0.value === webSocketTask })?.key { emit(["id": id, "type": "open"]) }
    }
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didCloseWith closeCode: URLSessionWebSocketTask.CloseCode, reason: Data?) {
        if let id = tasks.first(where: { $0.value === webSocketTask })?.key { tasks.removeValue(forKey: id); emit(["id": id, "type": "close", "code": closeCode.rawValue]) }
    }
    func shutdown() { probeSerial += 1; probes.values.forEach { $0.cancel() }; probes.removeAll(); let open = tasks; tasks.removeAll(); open.values.forEach { $0.cancel(with: .goingAway, reason: nil) }; session.invalidateAndCancel() }
}

@main struct BenKenMIDIApp: App {
    var body: some Scene { WindowGroup { BenKenScreen().frame(maxWidth: .infinity, maxHeight: .infinity).ignoresSafeArea(.container, edges: .bottom) } }
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
    private var mixerNetwork: Ui24RNetwork!
    private var observers: [NSObjectProtocol] = []
    private var downloads: [ObjectIdentifier: URL] = [:]
    private let pageURL = URL(string: "https://kenhje.github.io/BenKenStagePro/")!
    private let startupCover = UIView()
    private let startupTitle = UILabel()
    private let startupDetail = UILabel()
    private let startupSpinner = UIActivityIndicatorView(style: .large)
    private let startupRetry = UIButton(type: .system)
    private var startupTimer: Timer?
    private var progressObservation: NSKeyValueObservation?
    private var navigation: WKNavigation?
    private var startupGeneration = 0
    private var didStartPage = false
    private var pageReady = false
    private var lastPageError = ""
    private var downloadingFromReadyPage = false
    override func viewDidLoad() {
        super.viewDidLoad()
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .default()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.limitsNavigationsToAppBoundDomains = true
        config.userContentController.add(MIDIMessageHandler(self), name: "benkenMIDI")
        config.userContentController.add(MIDIMessageHandler(self), name: "benkenNetwork")
        config.userContentController.add(MIDIMessageHandler(self), name: "benkenStartup")
        config.userContentController.addUserScript(WKUserScript(source: BenKenStartup.bridge, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = self; web.uiDelegate = self
        let background = UIColor(red: 25/255, green: 35/255, blue: 46/255, alpha: 1)
        view.backgroundColor = background
        web.isOpaque = false; web.backgroundColor = background; web.scrollView.backgroundColor = background
        #if DEBUG
        web.isInspectable = true
        #endif
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(web)
        NSLayoutConstraint.activate([web.leadingAnchor.constraint(equalTo: view.leadingAnchor), web.trailingAnchor.constraint(equalTo: view.trailingAnchor), web.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor), web.bottomAnchor.constraint(equalTo: view.bottomAnchor)])
        configureStartupCover(background: background)
        progressObservation = web.observe(\.estimatedProgress, options: [.new]) { [weak self] page, _ in
            DispatchQueue.main.async {
                guard let self, !self.pageReady, self.startupSpinner.isAnimating else { return }
                self.startupDetail.text = "Loading page: \(Int(page.estimatedProgress * 100))%\nNative startup 26.31.3"
            }
        }
        resetMixerNetwork()
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
        UIApplication.shared.isIdleTimerDisabled = true
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if !didStartPage { didStartPage = true; retryLoading() }
    }
    deinit { startupTimer?.invalidate(); progressObservation?.invalidate(); mixerNetwork?.shutdown(); observers.forEach { NotificationCenter.default.removeObserver($0) } }
    private func configureStartupCover(background: UIColor) {
        startupCover.backgroundColor = background; startupCover.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(startupCover)
        NSLayoutConstraint.activate([startupCover.leadingAnchor.constraint(equalTo: view.leadingAnchor), startupCover.trailingAnchor.constraint(equalTo: view.trailingAnchor), startupCover.topAnchor.constraint(equalTo: view.topAnchor), startupCover.bottomAnchor.constraint(equalTo: view.bottomAnchor)])
        startupTitle.text = "Opening BenKen"; startupTitle.textColor = .white; startupTitle.font = .boldSystemFont(ofSize: 23); startupTitle.textAlignment = .center; startupTitle.numberOfLines = 0
        startupDetail.text = "Native startup 26.31.3"; startupDetail.textColor = .white; startupDetail.font = .systemFont(ofSize: 15); startupDetail.textAlignment = .center; startupDetail.numberOfLines = 12
        startupSpinner.color = .white; startupSpinner.hidesWhenStopped = true; startupSpinner.startAnimating()
        startupRetry.setTitle("RETRY", for: .normal); startupRetry.titleLabel?.font = .boldSystemFont(ofSize: 17); startupRetry.tintColor = .white; startupRetry.layer.borderWidth = 1; startupRetry.layer.borderColor = UIColor.white.cgColor; startupRetry.layer.cornerRadius = 7; startupRetry.isHidden = true
        startupRetry.addTarget(self, action: #selector(retryLoading), for: .touchUpInside)
        startupRetry.heightAnchor.constraint(equalToConstant: 48).isActive = true
        let address = UILabel(); address.text = pageURL.absoluteString; address.textColor = .lightGray; address.font = .systemFont(ofSize: 12); address.textAlignment = .center; address.numberOfLines = 0
        let stack = UIStackView(arrangedSubviews: [startupSpinner, startupTitle, startupDetail, startupRetry, address]); stack.axis = .vertical; stack.spacing = 18; stack.translatesAutoresizingMaskIntoConstraints = false
        startupCover.addSubview(stack)
        NSLayoutConstraint.activate([stack.centerXAnchor.constraint(equalTo: startupCover.centerXAnchor), stack.centerYAnchor.constraint(equalTo: startupCover.safeAreaLayoutGuide.centerYAnchor), stack.widthAnchor.constraint(lessThanOrEqualToConstant: 520), stack.leadingAnchor.constraint(greaterThanOrEqualTo: startupCover.safeAreaLayoutGuide.leadingAnchor, constant: 24), stack.trailingAnchor.constraint(lessThanOrEqualTo: startupCover.safeAreaLayoutGuide.trailingAnchor, constant: -24)])
    }
    private func beginStartup(_ message: String) {
        startupGeneration += 1; pageReady = false; lastPageError = ""
        startupCover.isHidden = false; startupTitle.text = "Opening BenKen"; startupDetail.text = message + "\nNative startup 26.31.3"; startupRetry.isHidden = true; startupSpinner.startAnimating()
        startupTimer?.invalidate(); let generation = startupGeneration
        startupTimer = Timer.scheduledTimer(withTimeInterval: 25, repeats: false) { [weak self] _ in
            DispatchQueue.main.async {
                guard let self, self.startupGeneration == generation, !self.pageReady else { return }
                self.showStartupError("The page did not finish opening within 25 seconds. Check the connection and press RETRY." + (self.lastPageError.isEmpty ? "" : "\n" + self.lastPageError))
            }
        }
        NSLog("[BenKen startup] %@", message)
    }
    private func showStartupError(_ message: String) {
        startupTimer?.invalidate(); startupTimer = nil; startupSpinner.stopAnimating(); startupCover.isHidden = false; startupTitle.text = "BenKen could not open"; startupDetail.text = String(message.prefix(1100)) + "\nNative startup 26.31.3"; startupRetry.isHidden = false
        NSLog("[BenKen startup] %@", message)
    }
    @objc private func retryLoading() {
        downloadingFromReadyPage = false; navigation = nil; web.stopLoading(); beginStartup("Connecting to the BenKen website…")
        var request = URLRequest(url: pageURL); request.timeoutInterval = 25
        navigation = web.load(request)
    }
    private func currentNavigation(_ candidate: WKNavigation?) -> Bool {
        guard let candidate, let navigation else { return true }
        return candidate === navigation
    }
    private func navigationFailed(_ error: Error) {
        let failure = error as NSError
        if failure.domain == NSURLErrorDomain && failure.code == NSURLErrorCancelled { return }
        showStartupError("\(failure.localizedDescription)\n\(failure.domain) · \(failure.code)")
    }
    private func resetMixerNetwork() {
        mixerNetwork?.shutdown()
        mixerNetwork = Ui24RNetwork { [weak self] payload in
            guard let self else { return }
            if payload["type"] as? String == "probe" { self.event("benken-native-network-test", payload); return }
            self.send("window.BenKenNativeNetwork?.receive?.(\(self.json(payload)))")
        }
    }
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
        if message.name == "benkenStartup" {
            if command == "pageError", let text = payload["message"] as? String { lastPageError = String(text.prefix(600)); NSLog("[BenKen page] %@", lastPageError) }
            return
        }
        if message.name == "benkenNetwork" { mixerNetwork.handle(payload); return }
        if command == "connect" { midi.refresh(); if let error = midi.error { event("benken-native-midi-error", error) } }
        if command == "bluetooth" { present(CABTMIDICentralViewController(), animated: true) }
    }
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        if downloadingFromReadyPage { return }
        self.navigation = navigation; beginStartup("Loading the BenKen page…"); resetMixerNetwork()
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard currentNavigation(navigation) else { return }; let generation = startupGeneration
        webView.evaluateJavaScript(BenKenStartup.readiness) { [weak self] value, error in
            guard let self, self.startupGeneration == generation else { return }
            if let error { self.navigationFailed(error); return }
            guard let result = value as? [String: Any] else { self.showStartupError("The page opened but its startup status could not be read."); return }
            if result["incomplete"] as? Bool == true { self.showStartupError("The GitHub update is incomplete. Upload all V26.31 web files together, then RETRY."); return }
            if result["ready"] as? Bool == true {
                self.startupTimer?.invalidate(); self.startupTimer = nil; self.pageReady = true; self.startupSpinner.stopAnimating(); self.startupCover.isHidden = true; self.midi.refresh()
                NSLog("[BenKen startup] Ready, web version %@", result["version"] as? String ?? "unknown")
            } else {
                let errors = (result["errors"] as? [String] ?? []).joined(separator: "\n")
                self.showStartupError("The website opened, but BenKen did not finish starting.\nPage: \(result["title"] as? String ?? "unknown")\n\(errors.isEmpty ? self.lastPageError : errors)")
            }
        }
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        if currentNavigation(navigation) { navigationFailed(error) }
    }
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        if currentNavigation(navigation) { navigationFailed(error) }
    }
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        startupGeneration += 1; pageReady = false
        showStartupError("The web page process stopped. Press RETRY to reopen BenKen. If it repeats, send a picture of this message.")
    }
    func webView(_ webView: WKWebView, decidePolicyFor response: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        if response.isForMainFrame, let http = response.response as? HTTPURLResponse, http.statusCode >= 400 {
            showStartupError("The website returned HTTP \(http.statusCode). Check that the GitHub page is published, then RETRY."); decisionHandler(.cancel); return
        }
        decisionHandler(.allow)
    }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if action.shouldPerformDownload { downloadingFromReadyPage = pageReady; decisionHandler(.download); return }
        guard let url = action.request.url else { decisionHandler(.cancel); return }
        let allowed = url.scheme == "blob" || url.scheme == "about" || (url.scheme == "https" && url.host == host && (url.path == "/BenKenStagePro" || url.path.hasPrefix("/BenKenStagePro/")))
        if !allowed && action.targetFrame?.isMainFrame != false && !pageReady { showStartupError("The page redirected outside the allowed BenKen address. Check the published GitHub address.") }
        decisionHandler(allowed ? .allow : .cancel)
    }
    func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) { downloadingFromReadyPage = false; download.delegate = self }
    func webView(_ webView: WKWebView, navigationResponse: WKNavigationResponse, didBecome download: WKDownload) { downloadingFromReadyPage = false; download.delegate = self }
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
