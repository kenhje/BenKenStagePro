import SwiftUI
import WebKit
import AVFoundation
import CoreAudioKit
import UIKit
import Network
import Darwin
import CoreImage

// Local follower header update 26.37.1.
// Native startup and local-network diagnostics 26.31.3.
private enum BenKenStartup {
    static let bridge = #"""
    (() => {
      window.BenKenNativeNetwork={version:'26.31.3',post:payload=>window.webkit.messageHandlers.benkenNetwork.postMessage(payload)};
      window.BenKenNativeLAN={version:'26.37',post:payload=>window.webkit.messageHandlers.benkenLAN.postMessage(payload)};
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

// Read-only HTTP host. All mutable state belongs to this serial queue.
// The viewer is served by this app so browsers never contact a public service.
private final class BenKenLANHost {
    private let queue = DispatchQueue(label: "no.benken.local-follow", qos: .utility)
    private let emit: ([String: Any]) -> Void
    private var listener: NWListener?
    private var monitor: NWPathMonitor?
    private var connections: [ObjectIdentifier: NWConnection] = [:]
    private var sessionID = ""
    private var token = ""
    private var addresses: [String] = []
    private var port: UInt16 = 0
    private var content: [String: Any] = ["title": "Waiting for host", "artist": "", "text": "", "next": "", "regions": [], "colors": [:]]
    private var transport: [String: Any] = ["position": 0, "length": 0, "playing": false, "following": false, "progress": 0]
    private var contentVersion = 0
    private var lastUpdate = Date.distantPast
    init(emit: @escaping ([String: Any]) -> Void) { self.emit = emit }
    deinit { listener?.cancel(); monitor?.cancel(); connections.values.forEach { $0.cancel() } }
    private func report(_ type: String, _ extra: [String: Any] = [:]) {
        var value = extra; value["type"] = type; value["id"] = sessionID
        DispatchQueue.main.async { [weak self] in self?.emit(value) }
    }
    func handle(_ message: [String: Any]) {
        guard let id = message["id"] as? String, id.hasPrefix("lan-"), id.count <= 80,
              let data = try? JSONSerialization.data(withJSONObject: message), data.count <= 1_500_000 else { return }
        queue.async { [weak self] in
            guard let self, let payload = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any], let command = payload["command"] as? String else { return }
            if command == "start" { self.start(id); return }
            guard id == self.sessionID, self.listener != nil else { return }
            if command == "stop" { self.stop(); return }
            if command == "snapshot" { self.snapshot(payload) }
        }
    }
    func shutdown() { queue.async { [weak self] in self?.stop() } }
    private func start(_ id: String) {
        stop(notify: false); sessionID = id; token = UUID().uuidString.replacingOccurrences(of: "-", with: "").lowercased()
        addresses = Self.localAddresses()
        guard !addresses.isEmpty else { report("error", ["message": "No local Wi-Fi/Ethernet address found. Connect to the same router as the followers, then START HOST again."]); sessionID = ""; return }
        do {
            let parameters = NWParameters.tcp
            parameters.requiredLocalEndpoint = .hostPort(host: .ipv4(.any), port: .any)
            let next = try NWListener(using: parameters, on: .any)
            listener = next
            next.stateUpdateHandler = { [weak self, weak next] state in
                guard let self, let next, self.listener === next else { return }
                switch state {
                case .ready:
                    guard let value = next.port else { self.report("error", ["message": "The local host did not receive a port."]); self.stop(notify: false); return }
                    self.port = value.rawValue; self.publishLinks()
                case .failed(let error):
                    self.report("error", ["message": "Local host: \(error.localizedDescription)"]); self.stop(notify: false)
                default: break
                }
            }
            next.newConnectionHandler = { [weak self] connection in self?.accept(connection) }
            next.start(queue: queue)
            let path = NWPathMonitor(); monitor = path
            path.pathUpdateHandler = { [weak self, weak path] _ in
                guard let self, self.monitor === path else { return }
                let values = Self.localAddresses()
                if values != self.addresses { self.addresses = values; if self.port != 0 { self.publishLinks() } }
            }
            path.start(queue: queue)
        } catch { report("error", ["message": "Local host could not start: \(error.localizedDescription)"]); stop(notify: false) }
    }
    private func publishLinks() {
        let urls = addresses.map { "http://\($0):\(port)/#\(token)" }
        var value: [String: Any] = ["urls": urls]
        if let first = urls.first, let filter = CIFilter(name: "CIQRCodeGenerator") {
            filter.setValue(Data(first.utf8), forKey: "inputMessage"); filter.setValue("M", forKey: "inputCorrectionLevel")
            if let output = filter.outputImage?.transformed(by: CGAffineTransform(scaleX: 6, y: 6)), let image = CIContext().createCGImage(output, from: output.extent), let png = UIImage(cgImage: image).pngData() { value["qr"] = "data:image/png;base64," + png.base64EncodedString() }
        }
        report("ready", value)
    }
    private func stop(notify: Bool = true) {
        if notify && !sessionID.isEmpty { report("stopped") }
        let old = listener; listener = nil; old?.cancel(); monitor?.cancel(); monitor = nil
        let active = Array(connections.values); connections.removeAll(); active.forEach { $0.cancel() }
        sessionID = ""; token = ""; addresses = []; port = 0; contentVersion = 0; lastUpdate = .distantPast
        content = ["title": "Waiting for host", "artist": "", "text": "", "next": "", "regions": [], "colors": [:]]
        transport = ["position": 0, "length": 0, "playing": false, "following": false, "progress": 0]
    }
    private func snapshot(_ payload: [String: Any]) {
        guard let value = payload["transport"] as? [String: Any], let position = value["position"] as? Double,
              let length = value["length"] as? Double, let progress = value["progress"] as? Double,
              position.isFinite, length.isFinite, progress.isFinite, position >= 0, length >= 0, length <= 86400 else { return }
        if let song = payload["content"] as? [String: Any] {
            guard let text = song["text"] as? String, text.utf16.count <= 512000,
                  song["title"] is String, let regions = song["regions"] as? [[String: Any]], regions.count <= 2048 else { return }
            content = song; contentVersion += 1
        }
        transport = ["position": min(position, length > 0 ? length : 86400), "length": length, "progress": min(1, max(0, progress)), "playing": value["playing"] as? Bool == true, "following": value["following"] as? Bool == true]
        lastUpdate = Date()
    }
    private func accept(_ connection: NWConnection) {
        guard connections.count < 32, case .hostPort(let host, _) = connection.endpoint,
              Self.privateIPv4(String(describing: host)) else { connection.cancel(); return }
        let key = ObjectIdentifier(connection); connections[key] = connection
        connection.stateUpdateHandler = { [weak self] state in
            if case .cancelled = state { self?.connections.removeValue(forKey: key) }
            if case .failed = state { self?.connections.removeValue(forKey: key) }
        }
        connection.start(queue: queue)
        queue.asyncAfter(deadline: .now() + 6) { [weak self, weak connection] in
            guard let self, let connection, self.connections[key] === connection else { return }
            connection.cancel(); self.connections.removeValue(forKey: key)
        }
        read(connection, buffer: Data())
    }
    private func read(_ connection: NWConnection, buffer: Data) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 8192) { [weak self] bytes, _, complete, error in
            guard let self, self.connections[ObjectIdentifier(connection)] === connection else { return }
            var data = buffer; if let bytes { data.append(bytes) }
            if data.count > 8192 { self.reply(connection, status: "431 Request Header Fields Too Large", type: "text/plain", data: Data()); return }
            if let delimiter = data.range(of: Data([13, 10, 13, 10])) {
                guard delimiter.upperBound == data.endIndex, let headers = String(data: data[..<delimiter.lowerBound], encoding: .utf8) else { self.badRequest(connection); return }
                self.request(connection, headers: headers); return
            }
            if complete || error != nil { connection.cancel(); return }
            self.read(connection, buffer: data)
        }
    }
    private func badRequest(_ connection: NWConnection) { reply(connection, status: "400 Bad Request", type: "text/plain", data: Data()) }
    private func request(_ connection: NWConnection, headers: String) {
        let lines = headers.components(separatedBy: "\r\n"), first = (lines.first ?? "").components(separatedBy: " ")
        guard first.count == 3, first[0] == "GET", ["HTTP/1.0", "HTTP/1.1"].contains(first[2]),
              first[1].hasPrefix("/"), !first[1].hasPrefix("//"), !first[1].contains("#"),
              let url = URLComponents(string: first[1]), url.host == nil else { badRequest(connection); return }
        var fields: [String: String] = [:]
        for line in lines.dropFirst() {
            guard let colon = line.firstIndex(of: ":") else { badRequest(connection); return }
            let name = String(line[..<colon]).lowercased(), value = String(line[line.index(after: colon)...]).trimmingCharacters(in: .whitespaces)
            guard !name.isEmpty, name.range(of: "^[a-z0-9-]+$", options: .regularExpression) != nil, fields[name] == nil else { badRequest(connection); return }
            fields[name] = value
        }
        guard let authority = fields["host"], addresses.contains(where: { "\($0):\(port)" == authority }),
              fields["transfer-encoding"] == nil, fields["content-length"] == nil || fields["content-length"] == "0" else { badRequest(connection); return }
        if let origin = fields["origin"], origin != "http://" + authority { reply(connection, status: "403 Forbidden", type: "text/plain", data: Data()); return }
        if url.path == "/" || url.path == "/index.html" { reply(connection, status: "200 OK", type: "text/html; charset=utf-8", data: Data(BenKenLANPage.html.utf8)); return }
        guard url.path == "/state" else { reply(connection, status: "404 Not Found", type: "text/plain", data: Data()); return }
        guard !token.isEmpty, fields["authorization"] == "Bearer " + token else { reply(connection, status: "401 Unauthorized", type: "text/plain", data: Data()); return }
        let afterValue = url.queryItems?.first(where: { $0.name == "after" })?.value
        let after = afterValue.flatMap { Int($0) }
        var state: [String: Any] = ["version": 1, "contentVersion": contentVersion, "transport": transport, "hostAge": min(86400, max(0, Date().timeIntervalSince(lastUpdate)))]
        if after != contentVersion { state["content"] = content }
        guard let data = try? JSONSerialization.data(withJSONObject: state) else { badRequest(connection); return }
        reply(connection, status: "200 OK", type: "application/json; charset=utf-8", data: data)
    }
    private func reply(_ connection: NWConnection, status: String, type: String, data: Data) {
        let headers = "HTTP/1.1 \(status)\r\nContent-Type: \(type)\r\nContent-Length: \(data.count)\r\nCache-Control: no-store\r\nConnection: close\r\nX-Content-Type-Options: nosniff\r\nX-Frame-Options: DENY\r\nReferrer-Policy: no-referrer\r\nContent-Security-Policy: default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'\r\n\r\n"
        var wire = Data(headers.utf8); wire.append(data)
        connection.send(content: wire, completion: .contentProcessed { [weak self] _ in connection.cancel(); self?.connections.removeValue(forKey: ObjectIdentifier(connection)) })
    }
    private static func privateIPv4(_ value: String) -> Bool {
        let parts = value.split(separator: ".").compactMap { Int($0) }
        guard parts.count == 4, parts.allSatisfy({ (0...255).contains($0) }) else { return false }
        return parts[0] == 10 || parts[0] == 192 && parts[1] == 168 || parts[0] == 172 && (16...31).contains(parts[1]) || parts[0] == 169 && parts[1] == 254
    }
    private static func localAddresses() -> [String] {
        var list: UnsafeMutablePointer<ifaddrs>?; guard getifaddrs(&list) == 0 else { return [] }; defer { freeifaddrs(list) }
        var current = list, found: [(String, String)] = []
        while let item = current {
            defer { current = item.pointee.ifa_next }
            guard let address = item.pointee.ifa_addr, Int32(address.pointee.sa_family) == AF_INET,
                  item.pointee.ifa_flags & UInt32(IFF_UP) != 0, item.pointee.ifa_flags & UInt32(IFF_LOOPBACK) == 0 else { continue }
            let name = String(cString: item.pointee.ifa_name)
            guard name.hasPrefix("en") || name.hasPrefix("eth") || name.hasPrefix("bridge") else { continue }
            var buffer = [CChar](repeating: 0, count: Int(NI_MAXHOST))
            guard getnameinfo(address, socklen_t(address.pointee.sa_len), &buffer, socklen_t(buffer.count), nil, 0, NI_NUMERICHOST) == 0 else { continue }
            let ip = String(cString: buffer); if privateIPv4(ip) { found.append((name, ip)) }
        }
        return Array(Set(found.map { $0.1 })).sorted { a, b in
            let first = found.first(where: { $0.1 == a })?.0 == "en0", second = found.first(where: { $0.1 == b })?.0 == "en0"
            return first == second ? a < b : first
        }
    }
}


private enum BenKenLANPage {
    static let html = #"""
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="referrer" content="no-referrer"><meta name="benken-follower-version" content="26.37.1"><title>BenKen · Follow</title><style>
:root{color-scheme:dark;--bg:#19232e;--text:#f1f3f6;--title:#a7bd74;--chord:#f1bf67;--verse:#7cd9ed;--chorus:#ffd073;--intro:#8bdeac;--bridge:#cfacff;--solo:#ffa579;--outro:#f0a9cf;--melody:#82c4ff}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}header{position:relative;z-index:2;border-bottom:1px solid #ffffff30;padding:max(10px,env(safe-area-inset-top)) 14px 10px;background:var(--bg)}h1{font-size:22px;color:var(--title);margin:4px 0}#followArtist,#followNext{font-size:13px;line-height:1.5}#followStatus{font-size:12px;color:var(--intro)}#followStatus[data-lost=true]{color:var(--solo)}nav{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px}button{min-height:42px;min-width:46px;border:1px solid currentColor;background:transparent;color:var(--text);border-radius:5px;padding:7px 12px;font-weight:600}button[aria-pressed=true]{background:var(--text);color:var(--bg)}#followViewport{position:absolute;top:var(--follow-top,190px);bottom:0;left:0;right:0;overflow-x:auto;overflow-y:hidden;padding:18px max(16px,4vw) max(16px,env(safe-area-inset-bottom))}#followContent{position:relative;padding-bottom:65vh;transform-origin:top left;will-change:transform}#followLyrics{position:static}.lyric-line{min-height:1.5em;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.chord-line,.lyric-text{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre}.chord-line{color:var(--chord);font-weight:700;line-height:1.2}.chord-pair{margin-bottom:.35em}.section{font-weight:700;margin-top:.8em}.verse{color:var(--verse)}.chorus{color:var(--chorus)}.intro{color:var(--intro)}.bridge{color:var(--bridge)}.solo{color:var(--solo)}.outro{color:var(--outro)}.melody{color:var(--melody)}
</style></head><body><header id="followHeader"><nav aria-label="Reading options"><button id="followSmaller" type="button" aria-label="Smaller text">A−</button><button id="followLarger" type="button" aria-label="Larger text">A+</button><button id="followChords" type="button" aria-pressed="true">CHORDS</button><button id="followAuto" type="button" aria-pressed="true">FOLLOW</button></nav><h1 id="followTitle">BenKen · Follow</h1><div id="followNext"></div><div id="followArtist"></div><div id="followStatus" role="status">Connecting to host…</div></header><main id="followViewport"><div id="followContent"><article id="followLyrics"></article></div></main><script>
(function (root) {
  'use strict';
  const sectionColors={verse:'#7cd9ed',chorus:'#ffd073',bridge:'#cfacff',intro:'#8bdeac',solo:'#ffa579',outro:'#f0a9cf',melody:'#82c4ff'};
  function songColor(song){return typeof song?.songColor==='string'&&/^#[0-9a-f]{6}$/i.test(song.songColor)?song.songColor.toLowerCase():undefined}
  function englishDefaults(state){
    const opts=state.opts||{};
    if(Array.isArray(opts.audioBuses))for(const bus of opts.audioBuses){if(bus.name==='Klikk')bus.name='Click';else if(bus.name==='Buss '+bus.id)bus.name='Bus '+bus.id}
    if(Array.isArray(opts.muteGroupNames)){const names=[...opts.muteGroupNames];opts.muteGroupNames=names.map((name,i)=>{if(name!=='Gruppe '+(i+1))return name;let next='Group '+(i+1),suffix=2;while(names.some((n,j)=>j!==i&&String(n).toLowerCase()===next.toLowerCase()))next='Group '+(i+1)+' ('+(suffix++)+')';names[i]=next;return next})}
    return state
  }
  function valid(s){return !!(s&&Array.isArray(s.songs)&&s.songs.length<=10000&&s.sets&&typeof s.sets==='object'&&!Array.isArray(s.sets)&&s.songs.every(x=>x&&typeof x.title==='string'&&typeof x.text==='string'&&(x.ui24rCue==null||root.StageUi24R?.validLink(x.ui24rCue))&&(x.songColor==null||!!songColor(x))&&(x.reaperSource==null||(()=>{try{root.StageReaper.validate(x.reaperSource);return true}catch{return false}})())&&(x.playback?.tempo==null||(()=>{try{root.StageTempo?.config(x);return true}catch{return false}})())&&(x.playback?.transpose==null||(()=>{try{root.StageTranspose?.config(x);return !!root.StageTranspose}catch{return false}})())&&(x.scrollSpeed==null||(Number.isFinite(x.scrollSpeed)&&x.scrollSpeed>=2&&x.scrollSpeed<=120)))&&(s.opts?.importBusRules==null||(()=>{try{root.StageImportRules.validate(s.opts.importBusRules);return true}catch{return false}})())&&(s.setAutoplay==null||root.StageLive?.validSetAutoplay(s))&&s.songs.every(x=>x.playback?.click==null||(()=>{try{root.StageClick?.settings(x);return !!root.StageClick}catch{return false}})())&&Object.entries(s.sets).every(([n,a])=>n.length<=200&&Array.isArray(a)&&a.every(i=>Number.isInteger(i)&&i>=0&&i<s.songs.length)));}
  function normalize(s){
    if(!valid(s))throw Error('Invalid song library or setlist. No data has been replaced.');
    s=structuredClone(s);s.idx=Math.max(0,Math.min(Math.floor(Number(s.idx)||0),s.songs.length-1));s.set=Object.hasOwn(s.sets,s.set)?s.set:'';s.opts=s.opts&&typeof s.opts==='object'&&!Array.isArray(s.opts)?s.opts:{};
    s.songs.forEach(x=>{x.refBente=x.refBente??x.bente??0});return englishDefaults(s);
  }
  function cloud(s){s=normalize(s);delete s.idx;delete s.set;delete s.opts.view;s.songs.forEach(x=>delete x.lastOpened);return s;}
  const signature=s=>JSON.stringify(cloud(s));
  function withSession(remote,local){
    const s=normalize(remote);if(local){s.idx=Math.max(0,Math.min(local.idx||0,s.songs.length-1));s.set=Object.hasOwn(s.sets,local.set)?local.set:'';if(local.opts?.view!=null)s.opts.view=local.opts.view;s.songs.forEach((x,i)=>{if(local.songs[i]?.title===x.title&&local.songs[i].lastOpened)x.lastOpened=local.songs[i].lastOpened})}return s;
  }
  function importBackup(current,raw){
    if(Array.isArray(raw)){if(!raw.every(s=>s&&typeof s.title==='string'&&typeof s.text==='string'))throw Error('The file contains invalid songs.');return normalize({...current,songs:[...current.songs,...raw]});}
    if(raw&&Array.isArray(raw.songs)&&!raw.sets)return importBackup(current,raw.songs);return normalize(raw);
  }
  function swipe(a,b){if(!a||!b)return 0;const dx=b.x-a.x,dy=b.y-a.y;return Math.abs(dx)>=75&&Math.abs(dx)>Math.abs(dy)*1.7&&b.time-a.time<1200?(dx<0?1:-1):0;}
  const sectionType=v=>/melody|melodi/i.test(v)?'melody':/chorus|refreng/i.test(v)?'chorus':/bridge|bro/i.test(v)?'bridge':/intro/i.test(v)?'intro':/solo|instrumental/i.test(v)?'solo':/outro|ending|slutt/i.test(v)?'outro':'verse';
  root.StageCore={songColor,englishDefaults,valid,normalize,cloud,signature,withSession,importBackup,swipe,sectionColors,sectionType};
})(typeof window!=='undefined'?window:globalThis);

(function(root){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const hex=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
 function colorRange(text,start,end,color){
  if(!hex(color))throw Error('Choose a valid text color.');text=String(text);start=Math.max(0,Math.min(text.length,Number(start)||0));end=Math.max(start,Math.min(text.length,Number(end)||0));if(start===end)return null;
  const pattern=/\{\s*(color\s*:\s*#[0-9a-f]{6}|kor|\/color|\/kor)\s*\}/gi,stack=[];let before=[],after=[],m;
  while((m=pattern.exec(text))){if(m.index>=end)break;if(m.index<start&&pattern.lastIndex>start||m.index<end&&pattern.lastIndex>end)throw Error('Select complete words, outside the color tags.');if(m.index<start){const tag=m[1].toLowerCase();tag[0]==='/'?stack.pop():stack.push(tag==='kor'?'#f0a9cf':tag.match(/#[0-9a-f]{6}/i)[0]);before=[...stack]}else{if(after.length===0)after=[...stack];const tag=m[1].toLowerCase();tag[0]==='/'?stack.pop():stack.push(tag==='kor'?'#f0a9cf':tag.match(/#[0-9a-f]{6}/i)[0])}}
  after=[...stack];const prefix='{/color}'.repeat(before.length)+'{color: '+color.toLowerCase()+'}',selected=text.slice(start,end).replace(pattern,''),suffix='{/color}'+after.map(c=>'{color: '+c+'}').join('');
  return {text:text.slice(0,start)+prefix+selected+suffix+text.slice(end),start:start+prefix.length,end:start+prefix.length+selected.length};
 }
 function header(raw){
  const m=raw.trim().match(/^\{\s*([^}:]+?)\s*(?::\s*(.*?))?\s*\}$/);if(!m)return null;
  const k=m[1].trim().toLowerCase(),labels={soc:'CHORUS',start_of_chorus:'CHORUS',sov:'VERSE',start_of_verse:'VERSE',sob:'BRIDGE',start_of_bridge:'BRIDGE',som:'MELODY',start_of_melody:'MELODY'};
  if(['c','comment','section'].includes(k))return {label:m[2]||'',type:root.StageCore.sectionType(m[2]||'')};
  if(labels[k])return {label:m[2]||labels[k],type:root.StageCore.sectionType(labels[k])};return null
 }
 function sections(text){const out=[];String(text||'').split(/\r?\n/).forEach((line,i)=>{const h=header(line);if(h)out.push({...h,line:i,index:out.length})});return out}
 const signature=text=>JSON.stringify(sections(text).map(s=>[s.label,s.type]));
 function inline(raw,stack=[],transpose=v=>v){
  let plain='',html='',marks=[],last=0;const rx=/\{\s*(color\s*:\s*#[0-9a-f]{6}|kor|\/color|\/kor)\s*\}|\[([A-G](?:#|b)?[a-zA-Z0-9+#/()\-]*)\]/gi;
  const add=value=>{plain+=value;const content=esc(value);html+=stack.length?'<span class="lyric-color" style="color:'+stack[stack.length-1]+'">'+content+'</span>':content};let m;
  while((m=rx.exec(raw))){add(raw.slice(last,m.index));last=rx.lastIndex;
   if(m[2]){marks.push({pos:[...plain].length,chord:transpose(m[2])});continue}
   const tag=m[1].toLowerCase();if(tag[0]==='/')stack.pop();else stack.push(tag==='kor'?'#f0a9cf':tag.match(/#[0-9a-f]{6}/i)[0].toLowerCase())
  }add(raw.slice(last));return {plain,html,marks}
 }
 function render(text,{hideChords=false,transpose=v=>v}={}){
  const stack=[],out=[];let sectionIndex=0;
  for(const raw of String(text||'').split(/\r?\n/)){
   const h=header(raw);if(h){out.push('<div class="lyric-line section '+h.type+'" data-section-index="'+sectionIndex+++'">'+esc(h.label)+'</div>');continue}
   const trimmed=raw.trim(),colorOnly=/^\{\s*(?:color\s*:\s*#[0-9a-f]{6}|kor|\/color|\/kor)\s*\}$/i.test(trimmed);
   if(/^\{\s*[^{}]+\s*\}$/.test(trimmed)&&!colorOnly)continue;
   const line=inline(raw,stack,transpose);if(colorOnly)continue;
   if(hideChords&&line.marks.length){if(line.plain.trim())out.push('<div class="lyric-line">'+line.html+'</div>');continue}
   if(line.marks.length){let chords='',end=0;for(const mark of line.marks){const col=Math.max(mark.pos,end);chords+=' '.repeat(Math.max(0,col-[...chords].length))+mark.chord;end=col+[...mark.chord].length+1}out.push('<div class="lyric-line chord-pair"><div class="chord-line">'+esc(chords)+'</div><div class="lyric-text">'+(line.html||'&nbsp;')+'</div></div>')}
   else out.push('<div class="lyric-line'+(line.plain?'':' blank-line')+'">'+(line.html||'&nbsp;')+'</div>')
  }return out.join('')
 }
 function validateSaved(timing){
  if(timing==null)return;
  if(!timing||timing.version!==1||typeof timing.signature!=='string'||timing.signature.length>200000||!Array.isArray(timing.starts)||timing.starts.length>2048||timing.starts.some(n=>n!==null&&(!Number.isFinite(n)||n<0||n>86400)))throw Error('Invalid section timing in the song.');
 }
 function saved(song){const list=sections(song?.text),timing=song?.sectionTiming;try{validateSaved(timing)}catch{return {list,stale:true,starts:list.map(()=>null)}}const stale=!!timing&&timing.signature!==signature(song.text);return {list,stale,starts:timing&&!stale&&timing.starts.length===list.length?[...timing.starts]:list.map(()=>null)}}
 function validateStarts(starts,length=0){let prev=-1;for(const n of starts){if(n===null)continue;if(!Number.isFinite(n)||n<0||n>86400)throw Error('Enter the start as mm:ss or seconds.');if(length>0&&n>=length)throw Error('Sections must start before the end of the song.');if(n<=prev)throw Error('Start times must follow the lyric order and be different.');prev=n}return starts}
 function segments(song,length){
  if(!(length>0))return [];const imported=root.StageReaper?.timedRegions(song,length);if(imported)return imported;const data=saved(song),{list,stale}=data,rate=root.StageTempo?.ratio(song)||1,starts=data.starts.map(n=>n===null?null:n/rate);if(stale||!list.length||starts.some(n=>n===null))return [];
  try{validateStarts(starts,length)}catch{return []}
  return list.map((s,i)=>({...s,start:starts[i],end:starts[i+1]??length}))
 }
 function sectionColor(type,opts){const value=opts?.colors?.[type];return hex(value)&&value.toLowerCase()!=='#62dfce'?value:root.StageCore.sectionColors[type]||root.StageCore.sectionColors.verse}
 function parseTime(value){const v=String(value).trim().replace(',','.');if(!v)return null;const m=v.match(/^(\d{1,4}):([0-5]\d(?:\.\d{1,3})?)$/);if(m)return Number(m[1])*60+Number(m[2]);if(/^\d+(?:\.\d{1,3})?$/.test(v))return Number(v);throw Error('Use mm:ss, for example 01:24, or seconds.')}
 function time(value){if(value===null||!Number.isFinite(value))return '';const n=Math.round(value*100)/100,whole=Math.floor(n);return String(Math.floor(whole/60)).padStart(2,'0')+':'+String(whole%60).padStart(2,'0')+(n%1?'.'+String(Math.round((n%1)*100)).padStart(2,'0'):'')}
 function interpolate(time,anchors){if(!anchors.length)return 0;if(time<=anchors[0].time)return anchors[0].y;for(let i=1;i<anchors.length;i++)if(time<=anchors[i].time){const a=anchors[i-1],b=anchors[i];return b.time===a.time?b.y:a.y+(b.y-a.y)*Math.max(0,Math.min(1,(time-a.time)/(b.time-a.time)))}return anchors[anchors.length-1].y}
 root.StageLyrics={VERSION:'26.37',esc,hex,colorRange,header,sections,signature,inline,render,validateSaved,saved,validateStarts,segments,sectionColor,parseTime,time,interpolate};
})(typeof window!=='undefined'?window:globalThis);

(function(root){
 'use strict';
 const $=id=>root.document.getElementById(id),finite=(n,d=0)=>Number.isFinite(n)?n:d,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function validContent(c){return !!c&&typeof c.title==='string'&&typeof c.text==='string'&&c.text.length<=512000&&Array.isArray(c.regions)&&c.regions.length<=2048&&c.regions.every(r=>Number.isInteger(r.index)&&r.index>=-1&&r.index<2048&&Number.isFinite(r.start)&&r.start>=0&&Number.isFinite(r.end)&&r.end>r.start&&r.end<=86400)&&(!c.colors||typeof c.colors==='object')}
 function position(value,now){const elapsed=Math.max(0,(now-value.received)/1000),extra=value.transport.playing&&value.age+elapsed<3?Math.min(2,elapsed+value.age):0;return clamp(value.transport.position+extra,0,value.transport.length||86400)}
 function target(content,time,height,extent,rows){
  const anchors=[];let next=null;for(let i=content.regions.length-1;i>=0;i--){const r=content.regions[i],row=rows.get(r.index);if(row==null)continue;const top=clamp(row-height*.32,0,extent),end=clamp(next==null?extent:next-height*.32,top,extent);anchors.unshift({time:r.start,y:top},{time:r.end,y:end});next=row}
  return anchors.length?root.StageLyrics.interpolate(time,anchors):null;
 }
 function mount(){
  const token=root.location.hash.slice(1),viewport=$('followViewport'),content=$('followContent');let active=null,received=null,revision=-1,running=true,flight=false,failures=0,timeout=null,follow=true,chords=true,font=root.innerWidth<600?22:30,y=null,lastFrame=null,renderKey='',rows=new Map(),height=0,extent=0;
  function status(text,lost=false){$('followStatus').textContent=text;$('followStatus').setAttribute('data-lost',String(lost))}
  function layout(){rows=new Map(Array.from($('followLyrics').querySelectorAll('[data-section-index]'),node=>[Number(node.dataset.sectionIndex),node.offsetTop]));height=viewport.clientHeight||root.innerHeight;extent=Math.max(0,content.scrollHeight-height)}
  function render(){if(!active)return;const key=JSON.stringify([active,chords,font]);if(key===renderKey)return;const songChanged=active.text!==render.lastText;render.lastText=active.text;renderKey=key;$('followTitle').textContent=active.title||'No song selected';$('followArtist').textContent=[active.artist,active.key].filter(Boolean).join(' · ');$('followNext').textContent=active.next?'NEXT · '+active.next:'';$('followLyrics').innerHTML=root.StageLyrics.render(active.text,{hideChords:!chords});content.style.fontSize=font+'px';for(const key of ['bg','text','title','chord','verse','chorus','bridge','intro','solo','outro','melody']){const value=active.colors?.[key];if(root.StageLyrics.hex(value))root.document.documentElement.style.setProperty('--'+key,value)}root.document.title=(active.title||'BenKen')+' · Follow';if(songChanged){y=null;viewport.scrollTop=0}layout()}
  function receive(data,now,rtt){if(!data||data.version!==1||!Number.isInteger(data.contentVersion)||!data.transport||!Number.isFinite(data.hostAge)||data.hostAge<0)throw Error('Invalid host update.');if(data.content){if(!validContent(data.content))throw Error('Invalid song data.');active=data.content;revision=data.contentVersion;render()}else if(data.contentVersion!==revision)throw Error('Waiting for song data.');const t=data.transport;if(!Number.isFinite(t.position)||!Number.isFinite(t.length)||t.position<0||t.length<0||t.length>86400)throw Error('Invalid song position.');received={transport:{position:t.position,length:t.length,playing:t.playing===true,following:t.following===true,progress:clamp(finite(t.progress),0,1)},age:data.hostAge+Math.min(1,rtt/2000),received:now};failures=0;status(data.hostAge>=3?'Host is not updating. Keep BenKen open on the host.':t.playing?'CONNECTED · PLAYING':'CONNECTED · '+(active?'READY':'Waiting for host'),data.hostAge>=3)}
  async function poll(){if(!running||flight)return;flight=true;const controller=new root.AbortController(),started=Date.now(),abort=root.setTimeout(()=>controller.abort(),2500);try{const response=await root.fetch('/state?after='+revision,{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:controller.signal});if(response.status===401){running=false;status('Session ended. Open a new link from the host.',true);return}if(!response.ok)throw Error('Host unavailable.');receive(await response.json(),Date.now(),Date.now()-started)}catch{failures++;if(failures>=2||!received)status('Connection lost. Reconnecting…',true)}finally{root.clearTimeout(abort);flight=false;if(running)timeout=root.setTimeout(poll,500)}}
  function frame(now){const dt=lastFrame==null?0:clamp((now-lastFrame)/1000,0,.1);lastFrame=now;if(received&&active){const age=(Date.now()-received.received)/1000+received.age,t=position(received,Date.now());if(age>=3)status('Host is not updating. Reconnecting…',true);if(follow&&age<3){let next=received.transport.playing||received.transport.following?target(active,t,height,extent,rows):null;if(next==null)next=extent*(received.transport.playing&&received.transport.length?t/received.transport.length:received.transport.progress);y=y==null?next:y+(next-y)*(1-Math.exp(-dt*10));content.style.transform='translate3d(0,'+(-y).toFixed(3)+'px,0)'}}root.requestAnimationFrame(frame)}
  $('followSmaller').onclick=()=>{font=Math.max(14,font-2);render()};$('followLarger').onclick=()=>{font=Math.min(64,font+2);render()};$('followChords').onclick=()=>{chords=!chords;$('followChords').setAttribute('aria-pressed',String(chords));render()};$('followAuto').onclick=()=>{follow=!follow;$('followAuto').setAttribute('aria-pressed',String(follow));viewport.style.overflowY=follow?'hidden':'auto';content.style.transform='none';if(!follow)viewport.scrollTop=y||0;else viewport.scrollTop=0;y=null};
  root.addEventListener('resize',layout);root.document.addEventListener('visibilitychange',()=>{if(!root.document.hidden){if(timeout!=null)root.clearTimeout(timeout);timeout=null;poll()}});root.addEventListener('pagehide',()=>{running=false;if(timeout!=null)root.clearTimeout(timeout)});
  if(/^[a-f0-9]{32}$/.test(token)){poll();root.requestAnimationFrame(frame)}else status('Open the complete local link from BenKen, including its session code.',true);
  return {receive,render,state:()=>({active,revision,received,follow,chords,font}),stop:()=>{running=false;if(timeout!=null)root.clearTimeout(timeout)}};
 }
 root.BenKenFollower={validContent,position,target,mount};
 if(root.document?.getElementById('followViewport'))root.benkenFollower=mount();
})(typeof window!=='undefined'?window:globalThis);

const followHeader=document.getElementById('followHeader');
const fitFollow=()=>{document.documentElement.style.setProperty('--follow-top',followHeader.offsetHeight+'px');window.dispatchEvent(new Event('resize'))};
if(typeof ResizeObserver!=='undefined')new ResizeObserver(fitFollow).observe(followHeader);else window.addEventListener('resize',()=>document.documentElement.style.setProperty('--follow-top',followHeader.offsetHeight+'px'));
fitFollow();
</script></body></html>

"""#
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
    private var lanHost: BenKenLANHost!
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
        config.userContentController.add(MIDIMessageHandler(self), name: "benkenLAN")
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
        lanHost = BenKenLANHost { [weak self] payload in self?.event("benken-native-lan", payload) }
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
    deinit { startupTimer?.invalidate(); progressObservation?.invalidate(); mixerNetwork?.shutdown(); lanHost?.shutdown(); observers.forEach { NotificationCenter.default.removeObserver($0) } }
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
        if message.name == "benkenLAN" { lanHost.handle(payload); return }
        if message.name == "benkenNetwork" { mixerNetwork.handle(payload); return }
        if command == "connect" { midi.refresh(); if let error = midi.error { event("benken-native-midi-error", error) } }
        if command == "bluetooth" { present(CABTMIDICentralViewController(), animated: true) }
    }
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        if downloadingFromReadyPage { return }
        self.navigation = navigation; beginStartup("Loading the BenKen page…"); resetMixerNetwork(); lanHost?.shutdown()
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard currentNavigation(navigation) else { return }; let generation = startupGeneration
        webView.evaluateJavaScript(BenKenStartup.readiness) { [weak self] value, error in
            guard let self, self.startupGeneration == generation else { return }
            if let error { self.navigationFailed(error); return }
            guard let result = value as? [String: Any] else { self.showStartupError("The page opened but its startup status could not be read."); return }
            if result["incomplete"] as? Bool == true { self.showStartupError("The GitHub update is incomplete. Upload all web files from the same version together, then RETRY."); return }
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
        startupGeneration += 1; pageReady = false; lanHost?.shutdown()
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
