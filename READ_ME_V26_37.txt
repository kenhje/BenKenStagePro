BENKEN STAGE PRO V26.37 — LOCAL HOST / FOLLOW

WEB UPDATE
Unzip this archive. Upload the web files from its root (including demo/)
to the root of the existing kenhje/BenKenStagePro GitHub repository,
replacing matching files. Do not upload the ZIP itself or remove old songs.
The iPad_update folder is for your local Xcode project; it is not needed
by GitHub Pages. After publication, open the app with internet once and
check V26.37 in Mixer. Do not delete the app or clear its local data.

NATIVE HOST UPDATE
Read iPad_update/READ_ME_IPAD.txt. The app's existing Swift source must be
updated and run from Xcode once. No account or app installation is needed
for followers. Old native apps continue to play audio but cannot START HOST.

USE ON THE SAME NETWORK
1. Put host and followers on the same Wi-Fi/router.
2. In the native host app choose SETTINGS > NETWORK > START HOST.
3. On each follower scan the host's QR code or open its complete local link.
4. Keep BenKen open on the host. Select and play songs normally.

The follower link points to the host device, not the public GitHub website.
The host serves the entire reading page, text and position locally, so no
internet or separate server is required during rehearsal. Followers do not
import songs or audio. They hear the host's audio through the rehearsal
speakers or Ui24R/monitor system. No audio is streamed to follower devices.
They can choose text size, chord visibility or manual scrolling independently.

Song selection, play/pause, seeking, next title, transposed chords and lyric
section timings are shared. If exact section timing exists, followers lay
out and scroll using their own screen size. Otherwise scrolling uses overall
song position or the host's reading progress; it is not word-level alignment.
Replies update about twice per second with short position extrapolation.
This is a lyric display link, not MIDI clock or sample-accurate audio sync.

Keep the host screen awake and the app in front. Locked-screen/background
hosting is not guaranteed in this initial test version. Guest-network
isolation may block communication. If the host's IP changes, use the new
QR/link. STOP HOST ends the session; the next session has a fresh link.
Connection loss leaves the last lyrics visible and stops following until
updates resume. The session is read-only and shares only the current song.

PRESERVED
REAPER V5 import/update and V26.36 lyric-section sync, six-stem playback,
local songs, setlists, mixer settings, Ui24R, MIDI, backup and offline shell
use the same storage formats. No new Lua exporter or audio DSP is included.
The previous internet-based song-title sync remains in Tools as Cloud Song
Sync. It is separate from this local NETWORK feature.

TESTING
Automated JavaScript/model checks cover the host bridge, standalone browser
viewer, reading options, reconnect behavior, count-in, existing playback,
REAPER imports, persistence, backup and the embedded startup/MIDI/Ui24R bridge.
Swift compilation and real two-device Wi-Fi operation have not been verified
in this environment. This is a test build for your iPad, not a public release.

VERIFICATION
Full regression suite: 339 passing JavaScript/model checks. Final focused
host/viewer/native-bridge suite after text-budget handling: 28 passing checks
(27 repeated checks plus one additional UTF-8 size case). These are not
Swift build, device Wi-Fi, browser rendering or live performance tests.
