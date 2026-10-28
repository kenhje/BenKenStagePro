BenKen iPad MIDI companion — source project, V26.21

This small iPad/iPhone app opens the GitHub web app in WKWebView and connects
Core MIDI to BenKen's MIDI Learn. It uses the same Web Audio playback engine;
it does not remove the web audio memory limit or introduce a new native mixer.
The standalone native audio project from earlier work is a separate project.

BUILD AND TEST ON YOUR MAC
1. Upload the V26.21 web files to the existing GitHub repository and wait
   until https://kenhje.github.io/BenKenStagePro/ shows V26.21.
2. Open BenKenStagePro.xcodeproj in Xcode on your Mac.
3. Select the BenKenStagePro target > Signing & Capabilities, choose your
   Apple development team and, if needed, a unique bundle identifier.
4. Connect and trust your iPad/iPhone. Enable Developer Mode if Xcode requests
   it. Choose your device as the run destination and press Run.
   This project requires iOS/iPadOS 17+. It has not been compiled or signed here.
5. Open the app online the first time so it can load the hosted web version.
6. Import your .benken song projects inside the app. Its storage is separate
   from Safari and any earlier BenKen native app.
7. Open gear > MIDI > OPEN MIDI SETTINGS. Connect the MIDI interface,
   press CONNECT, choose START and press LEARN, then press the FCB1010 switch.
8. Assign STOP, NEXT and mute groups in the same way. Test these with your
   existing Ui24R setup and confirm USB output routing before live use.

OPTIONAL TERMINAL ENTRY POINT (MAC)
From this folder:
  open BenKenStagePro.xcodeproj
Signing and the selected physical device must be configured in Xcode first.
This is not an installable .ipa and cannot be installed using an iPad terminal.

CONNECTIONS
Wired: FCB1010 MIDI OUT -> MIDI interface IN -> iPad USB adapter.
Only MIDI OUT from the pedal is needed for BenKen control. Both MIDI directions
are needed when reading/writing pedal setups with FCBFF.
Bluetooth: use an actual Bluetooth MIDI adapter/peripheral. Press BLUETOOTH
MIDI inside the app to open Apple's nearby-device pairing panel. An original
FCB1010 does not contain Bluetooth hardware.
No SysEx is requested or sent by this companion app.

WHAT TO VERIFY ON THE IPAD
- Read every Ui24R output, route the stems and listen for click separation.
- Check original-tempo and changed-tempo playback and the song/master faders.
- Test a 2-bar and 4-bar count-in, beat lights and Stop during the count.
- Start the metronome without backing audio and verify the selected bus.
- Test per-entry autoplay, including an On entry followed by an Off entry.
- Confirm learned footswitches work once per press and expression volume moves.
- If using Bluetooth, pair the MIDI adapter and repeat the playback tests.
- Verify save/import/export and reopening of your projects in the companion app.
- Offline reopening relies on the hosted app's cached assets in WKWebView;
  check it in airplane mode before relying on it. Safari's cache is separate.
This source was checked structurally but no Apple SDK, iPad, pedal or Ui24R was
available to compile and physically validate it. No App Store or TestFlight
upload has been performed.

Source uses Apple system frameworks only: SwiftUI, WebKit, Core MIDI,
Core Audio Kit and AVFoundation. No third-party SDK or account service is added.
