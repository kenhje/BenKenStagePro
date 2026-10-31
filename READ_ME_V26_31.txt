BenKen Stage Pro V26.31 — Ui24R cue links and native local network bridge

GITHUB UPDATE
Upload the web files and demo folder from this ZIP to the ROOT of the existing
BenKenStagePro repository. Wait for GitHub Pages publishing and reload until
V26.31 appears. Files: index.html, sw.js, benken-runtime-v26-31.js,
benken-ui-v26-31.css, manifest.webmanifest, icon-192.png, icon-512.png,
SUPABASE_SETUP.sql and demo/. This package has not been uploaded automatically.
The iPad_MIDI folder is an optional Xcode source project, not a web asset.
Your existing songs, setlists, original audio, routing and settings use their
existing stores. No clearing of browser storage or re-import is required.

UI24R CUES — APP SOURCE IMPLEMENTATION, HARDWARE TEST PENDING
Settings > UI24R reads shows/cues and saves an exact show name + cue name on
individual songs. Links are retained in the library, JSON, .benken projects and
full backups. Mixer IP and automatic recall are device preferences, preserved
on ordinary project import and optionally restored with a full device backup.
READ CUES, saving/removing a link, and enabling AUTO-RECALL do not load cues.
LOAD CUE NOW explicitly loads the linked cue. With Auto-recall enabled, a later
song selection (setlist, Next/Previous, MIDI or autoplay) sends its linked cue.
The current show must already be open on the mixer. This integration does not
load shows/snapshots, save/delete cues, or guess another cue if a name is missing.
It watches mixer feedback and distinguishes sent from confirmed. A timeout or
missing network reports the failure; backing audio remains independent. Lost
selections are not queued or replayed after reconnect. Startup does not connect
or recall automatically: press CONNECT on each run, then choose the song.

GITHUB VERSUS NATIVE APP
Direct local mixer connections are deliberately not enabled in the HTTPS
GitHub browser version. The included iPad_MIDI Xcode source adds a native
URLSession WebSocket bridge, Local Network permission and private IPv4 ATS
exceptions. It still opens the hosted BenKen web app and uses the existing Web
Audio engine. It is not a compiled/signed app, new audio engine or Mac target.
A GitHub upload alone does not activate cue reading on iPad Safari. Build and
run the included Xcode project on iPad/iPhone to test the local network bridge.
See iPad_MIDI/READ_ME.txt. No real Ui24R, Apple SDK or iPad was available here.

FIRST SETUP / OFFLINE
1. Open the built app online and wait for V26.31. Import your saved projects or
   full backup inside it; app storage is separate from Safari.
2. Settings > UI24R > PREPARE OFFLINE ACCESS downloads the pinned, self-contained
   soundcraft-ui-connection 7.0.3 module from jsDelivr and caches it on this app.
   Wait for confirmation; a cache failure says offline setup is incomplete.
   This dependency is loaded only on request and is not embedded in this ZIP.
3. Join the same LAN as the Ui24R. Allow Local Network permission when asked.
   Enter its private IPv4 address (no http:// or port), press CONNECT / READ CUES.
4. Open the intended live show on the mixer. Choose a song in BenKen, choose the
   show and cue from the read lists, and SAVE LINK. Repeat for other songs.
5. At a controlled listening level, use LOAD CUE NOW and verify the actual Ui24R
   cue indicator and levels. Then enable AUTO-RECALL and test song selection.
6. Reopen on the mixer LAN without internet and verify both library caching and
   local cue access before relying on offline operation.
The connection module is fetched and executed from the pinned public dependency
URL only during setup; normal mixer traffic goes directly over the local socket.
No cloud relay, MIDI pedal or Mixing Station integration is used for cue access.
The dependency library manages the Ui wire protocol; these tests use its
published API and a simulated client, not an actual fetched library or mixer.

PROTOCOL / PLATFORM REFERENCES
- Author's cue/catalog API (community library, not an official Soundcraft SDK):
  https://fmalcher.github.io/soundcraft-ui/features/shows
- Custom native WebSocket constructor:
  https://fmalcher.github.io/soundcraft-ui/more/websocket
- Self-contained browser module:
  https://fmalcher.github.io/soundcraft-ui/usage/quickstart
- Soundcraft V3 cue behavior:
  https://www.soundcraft.com/en-US/softwares/ui24r-firmware-update-v3-0-eb6b9f13-656f-4408-986b-aa9b9fa3b88e
- Apple local network transport configuration:
  https://developer.apple.com/documentation/bundleresources/information-property-list/nsapptransportsecurity/nsallowslocalnetworking
soundcraft-ui-connection is by Ferdinand Malcher, MIT licensed; no upstream
library source is redistributed in this package. See its repository for license.

NEXT SONG BESIDE THE WAVEFORM TITLE
The bottom control bar now shows NEXT > and the upcoming song beside the
current title. It uses the same song order and colors as the original next-song
preview and transport, including repeated entries, library order and END OF SET.
The title pair stays in the fixed control bar while the lyrics scroll. Long
titles truncate visually and retain their complete text in the title tooltip.
Buttons-only mode and the mixer keep their existing compact buttons-only view;
returning to the waveform shows both titles again. Fullscreen's existing
tap-to-show controls still applies.

OPTIONAL PINNED SETLIST
Settings > Setlist > KEEP SETLIST VISIBLE WHILE SCROLLING keeps the list beside
the lyrics with independent native scrolling. This choice saves automatically
on this device and survives reopening. The list fits between the top bar and
bottom controls, including orientation and visible-viewport changes. On narrow
screens it uses a compact side column. Selecting a song keeps a pinned list
open. SETLIST or the mobile close button can still hide it; SETLIST reopens it.
Fullscreen hides the list and restores the choice on exit. Default behavior
stays unpinned until selected. Existing song/project imports keep the device's
pinning choice; a full backup can restore it with device settings.

SETTINGS SCROLLING
Settings opens in a separate fixed panel with its own native vertical scrolling
area. It no longer enlarges the sticky header or uses the reading page's scroll.
The category list stays reachable; on iPhone it scrolls horizontally. The content
starts at the top when switching categories, while edits within the same
category retain the content scroll position. Close with X, SETTINGS or Escape.
The panel adapts to the visible viewport, orientation, keyboard and Controls.
Underlying lyric autoscroll rests while Settings is open. It remains enabled and
resumes when Settings closes; audio keeps playing. No wheel/touch threshold or
custom scrolling speed is imposed on the Settings content. Tools > Live sync
closes Settings to reveal the existing live panel.

CONSISTENT SKINS
All ordinary buttons use the same normal text, background and border colors,
including Classic, mixer navigation, mixer settings, file actions, channel
settings, reset buttons and Controls. Active buttons share the chosen accent
and its automatically contrasting foreground. Outline button style stays
available. Hard-coded interface text, panel, field and border colors are now
skin tokens throughout the main page, editors, dialogs and mixer. Browser chrome
also follows the chosen background color. Dark/Light error text is chosen for
readability. Main progress/memory fills use the skin accent and memory overflow
retains its error indication. The master label follows the accent as well.
User-selected song/track/bus labels and lyric/section colors remain independent.
Signal meters, waveform markers and hardware-style fader graphics keep their
meaningful level/position cues. Color-palette previews show the palette being
chosen. All previously saved skins, custom choices and button layouts remain.

DIRECT SONG NOTES
- Add NOTES under Controls > Customize controls if your saved custom button
  layout does not already have it. NOTES works on the reading page and over
  the mixer while playback continues, using the same audio engine.
- An empty song opens directly in the writing field. Changes save to that
  song automatically as you type. Press DONE to view the notes. Reopening
  NOTES shows saved notes and FX information, with EDIT for further changes.
- Notes are plain text. Multiline text and pasted markup remain safe text.
- Closing or pressing Escape saves first. A failed save retains your text,
  keeps the editor open and offers a retry with DONE. A local recovery draft
  is attempted separately. Successfully saved changes are part of the existing
  song metadata and backups; there is no separate notes collection.
- Song changes after a successful save display the selected song's own notes.
  If a save fails during a song change, the editor remains attached to its
  original song so notes cannot accidentally be written to the next song.

INDEPENDENT TITLE SIZE AND LYRIC ALIGNMENT
Settings > Lyrics places FONT SIZE and SONG TITLE SIZE together. The default
main title is 30 px; set it independently from 18 to 64 px. A-/A+ and FONT SIZE
change only the lyrics/chords, from 14 to 52 px, and keep the saved title size.
TEXT ALIGNMENT offers Left or Center. Center moves each chord/lyric pair as
one unit so the chord positions over words are retained. The pair scrolls
horizontally when wider than the screen. Two-column page view remains available.
Title size and alignment save locally and survive reopening. The external
lyrics window retains its existing independent font setting.

DARK, LIGHT AND COMPLEMENTARY PALETTES
Settings > Personalization offers Classic, Dark, Light, Navy & Copper,
Teal & Coral and Plum & Gold, plus your Custom / My skin. Dark and Light are
explicit palettes, with matching panels, fields, mixer/dialog surfaces and
native color scheme. Complementary palettes use subdued backgrounds and
contrasting accents. Existing saved Graphite/Sunset choices remain readable
and retain their saved colors; they no longer occupy the preset preview row.
Choose soft corners, square corners or outline buttons. Under Customize app
colors, ALL ACTIVE BUTTONS sets one accent for every active button: top and
settings navigation, selected songs, mixer tabs, mute/solo/groups, Play/Stop,
metronome/count-in and controls. Active foregrounds automatically use black
or white for contrast. This chosen accent also replaces the previous separate
Play/Stop active colors. Inactive buttons retain neutral theme surfaces.
Background/title/chord/lyric/section colors remain editable. Own edits become
Custom / My skin, remembered when trying other presets. Song/track/bus colors
remain separate. RESET TO CLASSIC restores the original palette. Appearance
save failure retains the previous saved appearance.

TRANSPOSE AFTER REOPENING
Previously, prepared transposed PCM existed only in working memory. Reopening
rebuilt the pitch processing from the original files, while the bottom bar
showed only the generic "Preparing audio" status.
V26.31 keeps successfully prepared key audio in a separate local IndexedDB
cache. Let a transposed song complete preparation once in THIS version. Later
opens can load its saved prepared PCM without running the pitch processor
again. This first preparation may take time on older devices; the current
filename, stage and percentage are shown beside Controls. A CANCEL action is
available there. STOP also cancels preparation, leaving the saved song/key
unchanged. PREPARE AUDIO retries. Bounded read/decode/processing waits report
an error instead of leaving an indefinitely disabled Play button.
The original input files are retained unchanged. Cache keys include an encoded
source SHA-256 fingerprint, asset identity, sample rate, mono/stereo use,
playback tempo, transpose and key-follow variants. Replacing a file, changing
these settings, importing on another device or losing the cache rebuilds the
correct prepared audio. A missing original file still needs REPLACE FILE or
restore; a cache does not replace the source/backup.
Prepared PCM is stored as floating-point samples, with bounded 1 MiB chunks,
and restored sample-for-sample. A manifest is published only after every chunk
has been saved. Failed/partial caches fall back to original audio preparation.
Storage/quota failure keeps the playable song and saved key; it means the
prepared copy may need rebuilding at the next open. Previously used derived
copies are evicted within an approximately 512 MiB disk-cache budget. This
budget is disk space, separate from the unchanged 256 MiB decoded working-
memory guard. Temporary browser/native memory can differ from the modeled
PCM budget. Browser data clearing removes the local cache and local originals.
The cache uses benken-prepared-v1 and never rewrites benken-audio-v1. Project
files and full backups contain the original audio and saved settings, not the
derived cache; prepared copies can be regenerated after a restore. A newer
iPad or the current wrapper app does not automatically raise the web limit.

RETAINED FEATURES / NAVIGATION
- Settings > BACKUP: lyric/JSON import and export, .benken project files,
  full backup & restore. Settings > PLAYBACK: Practice/Stereo versus Live/USB,
  audio output tools, test outputs, memory display and play/stop protection.
- Mixer > MIXER SETTINGS: names/colors, per-song track bus assignments, output
  buses, six mute groups, display preferences and the song's Audio & Files.
- Bus names/colors/USB outputs are shared by all songs. Track-to-bus assignments
  belong to each song. Group names, per-song group memberships and active
  group buttons persist across reopening; active groups carry across songs.
- AUDIO & FILES > REPLACE FILE reconnects missing files or replaces a take while
  retaining the track identity, app name, format, bus, color, gain/pan,
  mute/solo, key-follow setting and mute groups. It updates the original name.
  The previous local copy is removed only when no song/track references it.
- SETLIST > + ADD SONGS supports search, multi-selection and adding entries in
  selection order to existing/new lists. Existing entries/autoplay stay intact.
- LIBRARY > ALL SONGS clears old filters and shows all library songs vertically.
- Text colors retain entire phrases and multiline selections through native
  selection/color-picker focus changes. Old inline color tags can be recolored
  without losing the later words. MELODY appears in Personalization and shares
  its color with lyric headings and synced waveform markers.
- CURRENT SONG COLOR is at the top of Personalization, with EDIT CURRENT SONG.
- Add/Edit Song and Edit Lyrics temporarily hide Controls/waveform and restore
  the saved footer preference when closed. Add/Edit Song has a top close button.
- Tools provides described, collapsible utilities with saved open/closed state.
- USE ESTIMATE accepts/saves detected BPM; count-in/metronome follow the saved
  playback BPM when Follow song playback BPM is enabled. An independent click
  BPM remains available with Follow off. Count-in offers two/four bars.
- Transpose -2..+2 semitones is per song, preserves duration/BPM and updates chord
  roots, slash bass, diagrams and displayed key. Click/drum exclusions are
  controlled by each track's Follow song key setting. Original files and raw
  ChordPro text are kept. Key changes commit after successful preparation.

EXTERNAL DISPLAY / OFFLINE / APP STATUS
On Mac: Settings > Tools > External lyrics display > OPEN LYRICS WINDOW. Move
that clean browser window to a connected screen. Song, key and lyric colors
follow; external chord visibility/font/scroll-follow are independently set.
No second audio player is created. On iPad 6 use system screen mirroring.
A separate native external-display scene is not implemented in this wrapper.
Local audio can play offline after the complete web app has been cached and
files imported. Initial cloud imports/updates need internet. The current cloud
song follower still needs internet and shares song titles only. Local HOST/JOIN
is a decision for the future app phase and is not implemented in this release.
The optional MIDI companion is iPad/iPhone Xcode source for iOS/iPadOS 17+,
using WKWebView and Core MIDI. It is not compiled/signed here and is not a new
native audio engine or native Mac build. Background multitrack/click/MIDI and
switching to Mixing Station remain unverified; the bridge is active-app-only.

BACKUP AND DEVICE TRANSFER
Use Settings > BACKUP to create current-song or entire-library .benken files
with the original referenced audio. Full backup includes all confirmed songs,
setlists, originals and settings, split into parts when large. Save every part
and select every part from the same backup when restoring. Restoring device
controls/output/MIDI settings is optional. Existing data formats are unchanged:
project format 6 and full-backup format 3, with supported older formats readable.
JSON text backups do not contain audio. Local data is separate per browser/app.

VERIFICATION
407 automated checks pass, plus the separate chord-display check. The new
cue tests use a simulated mixer API. They cover read-only cue lists, exact name
linking, selection/confirmation, missing cues, wrong shows, connection timeout,
network loss/reconnect without replay, stale acknowledgements, failed saves,
native text-socket adaptation, continued playback during cue setup, reopening,
project metadata and the hosted-browser limitation.
Native source/plist/project references and regeneration are checked structurally.
The native app is not compiled or signed here. Actual upstream-module loading,
offline caching, Local Network permission and live Ui24R cue recall still need
an iPad test. The existing web audio engine/DSP and memory limit are unchanged.
