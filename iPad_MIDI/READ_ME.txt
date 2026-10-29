BenKen iPad MIDI companion — source project, V26.29

This small iPad/iPhone app opens the GitHub web app in WKWebView and connects
Core MIDI to BenKen's MIDI Learn. It uses the same Web Audio playback engine;
it does not remove the web audio memory limit or introduce a new native mixer.
The standalone native audio project from earlier work is a separate project.

BUILD AND TEST ON YOUR MAC
1. Upload the V26.29 web files to the existing GitHub repository and wait
   until https://kenhje.github.io/BenKenStagePro/ shows V26.29.
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
- Check ±1/±2 semitone transpose against your instrument, confirm chords/key
  follow, and verify that click/drum tracks keep their original pitch when
  Follow song key is off. The same 256 MiB preparation guard still applies.
- Test a 2-bar and 4-bar count-in, beat lights and Stop during the count.
- Start the metronome without backing audio and verify the selected bus.
- Test per-entry autoplay, including an On entry followed by an Off entry.
- Check that the page control bar stays at the screen bottom during lyrics
  scroll, rotation and Safari/WKWebView viewport changes.
- Confirm learned footswitches work once per press and expression volume moves.
- If using Bluetooth, pair the MIDI adapter and repeat the playback tests.
- Verify save/import/export and reopening of your projects in the companion app.
- Change track-to-bus assignments without pressing SAVE, close/reopen the app,
  and verify every USB route and the saved mute/group state.
- Test USB keyboard MIDI Learn for START/STOP as an alternative to a pedal.
- Offline reopening relies on the hosted app's cached assets in WKWebView;
  check it in airplane mode before relying on it. Safari's cache is separate.
This source was checked structurally but no Apple SDK, iPad, pedal or Ui24R was
available to compile and physically validate it. No App Store or TestFlight
upload has been performed.

BACKGROUND LIMITATION
The audio session is configured for playback and the project declares the
audio background mode, but background multitrack/continuous click has not
been validated. This source still uses the web audio engine. Its MIDI bridge
forwards received commands only while UIApplication is active. Keep BenKen
visible for live tests; switching to Mixing Station is not yet a verified
background playback/MIDI workflow.

Source uses Apple system frameworks only: SwiftUI, WebKit, Core MIDI,
Core Audio Kit and AVFoundation. No third-party SDK or account service is added.

V26.29 EXTERNAL SCREEN NOTE
The separate lyrics popup is intended for the Mac browser. This optional
WKWebView MIDI wrapper does not implement a separate native external-display
scene or popup presenter. On iPad 6, use system screen mirroring.

V26.29 PREPARED AUDIO / APPEARANCE
The hosted web update adds local prepared-key PCM reuse, cancel/retry progress,
text navigation buttons, directly editable song Notes, independent title size,
centered lyrics, Dark/Light palettes and a shared active-button accent. Let
each transposed song finish
preparing once in V26.29 before testing reopening. Original audio storage is
unchanged. This optional wrapper still uses the web engine and its 256 MiB
working-memory guard; native compilation and device tests remain outstanding.

V26.29 SETTINGS / SKIN
The hosted web update adds a bounded native-scrolling Settings panel and shared
skin colors across all ordinary buttons, fields and mixer tools. Audio engine,
Core MIDI and the current foreground-only wrapper behavior are unchanged.
Physical scrolling and Xcode compilation remain unverified here.
