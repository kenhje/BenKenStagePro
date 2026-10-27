import Foundation
import CoreMIDI

// Running status and partial packets are kept separately for each connected source.
final class MIDIByteStream {
    private var status: UInt8 = 0
    private var data: [UInt8] = []
    private var sysex = false
    func feed(_ bytes: [UInt8]) -> [[UInt8]] {
        var result: [[UInt8]] = []
        for byte in bytes {
            if byte >= 0xF8 { continue }
            if byte == 0xF0 { sysex = true; status = 0; data.removeAll(); continue }
            if byte == 0xF7 { sysex = false; continue }
            if sysex { continue }
            if byte >= 0xF0 { status = 0; data.removeAll(); continue }
            if byte >= 0x80 { status = byte; data.removeAll(); continue }
            guard status >= 0x80 else { continue }
            data.append(byte)
            let kind = status & 0xF0, length = kind == 0xC0 || kind == 0xD0 ? 1 : 2
            if data.count == length {
                if [UInt8(0x80), 0x90, 0xB0, 0xC0].contains(kind) { result.append([status] + data) }
                data.removeAll(keepingCapacity: true)
            }
        }
        return result
    }
}

final class MIDIService {
    private var client = MIDIClientRef(), port = MIDIPortRef()
    private var connected = Set<MIDIEndpointRef>()
    private var streams: [String: MIDIByteStream] = [:]
    var receive: ((String, [UInt8]) -> Void)?
    var portsChanged: (([[String: String]]) -> Void)?
    private(set) var error: String?
    init() {
        let clientStatus = MIDIClientCreateWithBlock("BenKen MIDI" as CFString, &client) { [weak self] _ in
            DispatchQueue.main.async { self?.refresh() }
        }
        guard clientStatus == noErr else { error = "Core MIDI client error \(clientStatus)"; return }
        let portStatus = MIDIInputPortCreateWithBlock(client, "BenKen pedal input" as CFString, &port) { [weak self] packets, reference in
            let source = MIDIEndpointRef(UInt(bitPattern: reference))
            var unique = MIDIUniqueID()
            MIDIObjectGetIntegerProperty(source, kMIDIPropertyUniqueID, &unique)
            let offset = MemoryLayout<MIDIPacketList>.offset(of: \.packet)!
            var packet = UnsafeRawPointer(packets).advanced(by: offset).assumingMemoryBound(to: MIDIPacket.self)
            let dataOffset = MemoryLayout<MIDIPacket>.offset(of: \.data)!
            var bytes: [UInt8] = []
            for _ in 0..<packets.pointee.numPackets {
                let data = UnsafeRawPointer(packet).advanced(by: dataOffset).assumingMemoryBound(to: UInt8.self)
                bytes.append(contentsOf: UnsafeBufferPointer(start: data, count: Int(packet.pointee.length)))
                packet = MIDIPacketNext(packet)
            }
            let id = String(unique)
            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                let stream = self.streams[id] ?? MIDIByteStream(); self.streams[id] = stream
                for message in stream.feed(bytes) { self.receive?(id, message) }
            }
        }
        if portStatus != noErr { error = "Core MIDI input error \(portStatus)" }
        refresh()
    }
    deinit { if port != 0 { MIDIPortDispose(port) }; if client != 0 { MIDIClientDispose(client) } }
    func sources() -> [[String: String]] {
        (0..<MIDIGetNumberOfSources()).map { index in
            let source = MIDIGetSource(index); var unique = MIDIUniqueID(); var name: Unmanaged<CFString>?
            MIDIObjectGetIntegerProperty(source, kMIDIPropertyUniqueID, &unique)
            MIDIObjectGetStringProperty(source, kMIDIPropertyDisplayName, &name)
            return ["id": String(unique), "name": name?.takeRetainedValue() as String? ?? "MIDI input"]
        }
    }
    func refresh() {
        guard port != 0 else { return }
        let current = Set((0..<MIDIGetNumberOfSources()).map { MIDIGetSource($0) })
        for source in connected.subtracting(current) { MIDIPortDisconnectSource(port, source); connected.remove(source) }
        for source in current.subtracting(connected) {
            if MIDIPortConnectSource(port, source, UnsafeMutableRawPointer(bitPattern: Int(source))) == noErr { connected.insert(source) }
        }
        let ports = sources(), ids = Set(ports.compactMap { $0["id"] })
        streams = streams.filter { ids.contains($0.key) }; portsChanged?(ports)
    }
}
