BenKen Stage Pro — Web V26.134 / Native V27.31
8 November 2026

All songs prepare automatically while the app is open, visible and idle for 15 seconds, with playback stopped. Interaction cancels background work; playback has priority. Requires Native V27.31 with the Native engine.

Settings → Audio & playback → Clear cache removes disposable playback copies, preserving imported originals, songs, setlists, settings and saved concert libraries. The current song reloads immediately; other copies rebuild while idle.

Removed Check offline availability and Prepare concert buttons. Restored the iPad song panel left edge while retaining centred closed-list lyrics.

Older native versions retain normal playback. Install Native V27.31 over the existing app using Xcode with the same bundle identifier; do not delete the installed app. The web update alone cannot add native cache commands.

Validation: 53 Swift tests completed, 2 skipped, 0 failures. Unsigned iOS Simulator and Mac Catalyst builds pass. All-song scheduler, source-preserving Clear cache and responsive browser checks completed. Physical iPad/iPhone speed, device storage and USB-interface verification remain required. Playback is not gapless.
