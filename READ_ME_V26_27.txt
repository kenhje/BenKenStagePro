BenKen Stage Pro V26.27 — Text buttons, Notes, skins and prepared keys

GITHUB UPDATE
Upload the web files and demo folder from this ZIP to the ROOT of the existing
BenKenStagePro repository. Wait for GitHub Pages publishing and reload until
V26.27 appears. Files: index.html, sw.js, benken-runtime-v26-27.js,
benken-ui-v26-27.css, manifest.webmanifest, icon-192.png, icon-512.png,
SUPABASE_SETUP.sql and demo/. This package has not been uploaded automatically.
The iPad_MIDI folder is an optional Xcode source project, not a web asset.
Your existing songs, setlists, original audio, routing and settings use their
existing stores. No clearing of browser storage or re-import is required.

TEXT BUTTONS AND NOTES
- SETLIST, SETTINGS, MIXER and CONTROLS are four equally sized text buttons.
- MIXER SETTINGS is text-only, beside Tempo and Controls in the mixer row.
- NOTES is available under Controls > Customize controls as an assignable
  button. The default layout for devices without a custom layout includes it.
  Existing custom button layouts are kept: add a NOTES slot yourself if needed.
- Notes opens a separate dialog above the reading page or mixer, showing the
  current song's notes and FX information. Playback continues. Closing Notes
  returns to the same mixer/page. Edit notes under Settings > Tools > Current
  song. Stored notes are rendered as text, not executable HTML.
- The main song title uses 1.5 times the lyric font size. Font changes through
  A-/A+ or Settings > Lyrics scale both lyrics and main title and are saved.

SKINS AND YOUR OWN COLORS
Settings > Personalization starts with APP SKIN. Choose Classic, Graphite,
Midnight Blue, Forest, Violet Lights or Sunset. Preview buttons show each
palette. Classic keeps the familiar appearance. Colored skins also change
panels, fields, controls and mixer surfaces. Song/track/bus colors stay separate.
Choose soft corners, square corners or outline buttons. Under Customize app
colors, edit panels, buttons/fields, borders and active-button colors. The
existing background/title/chord/lyric/section colors remain available below.
Own edits automatically become Custom / My skin. That saved custom palette
can be recalled after trying another preset. RESET TO CLASSIC restores the
original app and lyric colors. Appearance changes save locally; a failed save
retains the previous appearance. Supplied lyric/title/accent colors pass
numeric contrast checks. Physical display rendering still needs device QA.

TRANSPOSE AFTER REOPENING
Previously, prepared transposed PCM existed only in working memory. Reopening
rebuilt the pitch processing from the original files, while the bottom bar
showed only the generic "Preparing audio" status.
V26.27 keeps successfully prepared key audio in a separate local IndexedDB
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
361 automated tests passed, plus the chord-display regression. Checks cover
cache save/reopen with exact PCM, source/settings
fingerprints, partial/quota/corrupt caches, memory limits, cancellation and
retry; actual deployed modeled DOM/Web Audio, skins/persistence/contrast,
Notes during playback, title/layout constraints, MIDI, original audio/project
transfers, backups, USB routing, count-in/metronome, tempo/transpose DSP,
lyric colors, scrolling and offline assets. Test count is recorded in delivery
metadata. These are automated/model checks: physical Safari/iPad reopen and
power-cycle tests, live listening, touch rendering, Ui24R/FCB1010 and Xcode
compilation still require Apple hardware. No physical test is claimed here.
