BENKEN NATIVE LOCAL HOST / FOLLOW — 26.37 TEST BUILD

This native update is needed for START HOST. A GitHub update alone cannot
start a local server from the old app. Followers only need a browser.

1. Publish the V26.37 web files on the existing GitHub Pages site first.
2. Open your existing BenKenStagePro project in Xcode on the Mac.
3. Open the Swift file containing your app (on your Mac it was named
   BenKenMIDIApp 2.swift). Replace its ENTIRE contents with the contents of
   BenKenMIDIApp.swift from this folder. Save the file.
   Do not add a second app file or another @main entry.
4. In your existing target's Info settings, keep Privacy - Local Network
   Usage Description. Its value can be updated to:
   Share song lyrics, chords and playback position with browsers on the
   same local network, and connect to Soundcraft Ui24R cues.
   The supplied Info.plist is a reference with the existing keys preserved.
   Keep your signing, bundle identifier and existing project settings.
5. Keep the existing MIDIService.swift. A matching copy is included only
   if you need to compare it; there is no new MIDI requirement here.
6. Select your physical iPad as the Run destination, unlock it, then Run.
   Do not delete the installed BenKen app or clear its data.

No external package or new source-file registration is required. Network,
Darwin and CoreImage are Apple system frameworks imported by the app file.
The existing MIDI, Ui24R bridge, startup screen and download handling are kept.

FIRST TWO-DEVICE TEST
- Open the updated app with internet once, so V26.37 has loaded.
- Connect the host and follower to the same Wi-Fi/router (for example the
  network used by Ui24R). That network need not have internet access.
- On the host: SETTINGS > NETWORK > START HOST.
- On the follower: scan the displayed QR code with its camera, or open the
  complete displayed http:// local link in Safari, Chrome or another browser.
- Select a song and test play/pause, seeking, transpose and next song.
  The follower should display the lyrics/chords without importing any song.
- Check A-/A+, CHORDS and FOLLOW on the follower. These affect only that screen.
- Test with the internet connection unavailable after the initial setup.
  The follower page and its scripts are served directly by the host app.

Keep the host app open, its screen unlocked and its device awake. This first
LAN version does not promise background or locked-screen hosting. Keep the
follower screen awake as well. Reopening a follower page reconnects using the
same link while that host session remains active.

If no address is shown, connect to Wi-Fi/Ethernet and START HOST again. Guest
Wi-Fi/client isolation can prevent devices on the same named Wi-Fi from
communicating. If Wi-Fi/IP changes, scan the updated QR code. If the host is
stopped, restarted or the app page reloads, start a new session and share its
new link. The old link will no longer work. Local addresses are IPv4.

SCOPE OF THIS TEST BUILD
Only the selected song text, transposed chords, next title, display colors,
section timing and transport position are sent. Audio stays on the host.
The follower cannot start/stop/seek the host or alter its files/settings.
The native HTTP endpoint is read-only, requires the session code for song
state, accepts private-network peers, and provides no file or audio route.
Anyone with the local session link on that network can view the shared song.
Use your trusted rehearsal network; this is local HTTP, not public hosting.

JavaScript/model checks are automated. No Apple SDK is installed in the
build environment: native Swift compilation, the actual iPad server, QR
scanning, browser layout and Wi-Fi performance still require device testing.
If Xcode reports a build error, send the exact red error message.
