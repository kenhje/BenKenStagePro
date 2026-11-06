BenKen Stage Pro — Web V26.118 · 6 November 2026

Tracks show their saved name in a large bold header instead of Track 01/02. Mute group buttons, summaries and assignments are removed from Tracks; existing assignments remain and can be managed under Mute groups.
Waveform off hides its whole strip, heading buttons, Sync Lyrics and time labels. Re-enable Show waveform from Controls settings. Section bar remains independent. Sync Lyrics is available under Lyrics & scrolling.
Both the Controls Metronome action and the optional left shortcut toggle the click directly. Settings still hold tempo, output bus, sound and level. Native requires V27.29 for this function. Select and prepare a song first. The click can run without starting backing tracks, and can be stopped without stopping active backing tracks.
Profile & document details can show the saved band/artist name and local logo in the top bar. Save profile after changing the option.

Validation: web syntax/assets/regression tests, browser track-name edit, waveform-hidden state, profile position and metronome shortcut on/off. Native: 47 tests, 2 skipped, no failures. iOS and Mac Catalyst builds completed without signing. Existing Apple SDK/deprecation warnings remain. Actual hardware/background/USB audio and touch verification are still required.

For Native metronome on/off, build BenKen_Stage_Pro_V27_29_Native_Metronome/App/BenKenStagePro.xcodeproj over the installed app. Same bundle ID/storage. Do not uninstall BenKen. Keep a full backup with audio before device testing.
Older Native V27.28 retains existing playback, EQ, waveform and meter support; direct metronome buttons show an upgrade message.
Publish all current web files together, wait for GitHub Pages to finish, then reload BenKen. Native V27.29 is a separate Xcode update.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026
