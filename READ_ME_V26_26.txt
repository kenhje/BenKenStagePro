BenKen Stage Pro V26.26 — Lyric colors, cleaner navigation and external display

UPDATE THE EXISTING GITHUB VERSION
Upload the web files and demo folder from this ZIP to the ROOT of the existing
BenKenStagePro repository. Wait for GitHub Pages publishing, then reload until
V26.26 appears. The web files are index.html, sw.js,
benken-runtime-v26-26.js, benken-ui-v26-26.css, manifest.webmanifest,
icon-192.png, icon-512.png and SUPABASE_SETUP.sql. Your existing local songs,
settings and imported audio use the same stores. There is no database reset.
The iPad_MIDI folder is an optional Xcode source project, not a web asset.
This package has not been uploaded to GitHub automatically.

WHAT CHANGED IN V26.26
- Text selection is tracked through selectionchange, touch/pointer selection
  and color-picker focus changes. Whole phrases and multiline selections can
  be colored with BACKING VOCALS or COLOR SELECTED TEXT. Recoloring across
  older color tags keeps the entire phrase in the new color and preserves
  colors outside the selection. Partial selection inside a color tag is
  rejected instead of inserting broken markup. Keyboard/caret navigation
  clears a stale selection. Chords stay in their original lyric positions.
- MELODY is now in Settings > PERSONALIZATION, alongside the other section
  colors. Its setting applies to lyric headings and timed waveform markers.
- CURRENT SONG COLOR is at the top of PERSONALIZATION for the selected song.
  Choose a swatch or NO SONG COLOR. EDIT CURRENT SONG opens its existing name,
  lyrics and color editor. Changing only its color keeps audio and setlists.
- TOOLS shows an explanation for each utility. Sections open initially and
  can be collapsed. Their open/closed choices persist on this device.
- LIBRARY > ALL SONGS clears older artist/tag/search filters and displays all
  library songs vertically, including songs outside the active setlist. The
  menu is compact and the setlist chooser is hidden while viewing the library.
- Opening Add/Edit Song or Edit Lyrics temporarily hides the bottom controls
  and waveform. Closing or saving restores the previous footer preference.
  The song editor has a persistent top Close button and sticky bottom actions.
- CONTROLS is now in the main mixer tab row, beside MIXER SETTINGS. It shows or
  hides the same shared bottom controls without opening Mixer Settings.
- DETECT ORIGINAL BPM still proposes an estimate. USE ESTIMATE now immediately
  saves and applies the accepted original/playback BPM. If Follow song playback
  BPM is checked, count-in and metronome use that saved playback BPM, including
  after reopening. Turning Follow off keeps the independent metronome BPM.

EXTERNAL LYRICS DISPLAY (MAC BROWSER)
Settings > TOOLS > External lyrics display > OPEN LYRICS WINDOW opens a clean
window containing the current title, lyrics and chords. Move this window onto
the connected external screen using macOS. Browser popup permission may be
needed. Reusing OPEN focuses the existing window. Closing it keeps audio going.
The window follows song changes, transposition, lyric highlights, song/section
colors, and offers its own chord visibility and font size. Chord visibility is
independent of Hide Chords on the main page. Optional FOLLOW MAIN LYRIC SCROLL
uses the main view's proportional scroll position with fractional transforms;
line wrapping can differ between display widths. Turn it off to scroll the
window manually. No second audio player, audio route or polling timer is added.
This window is for the same Mac/browser session; it is not a network follower.
On iPad 6, use operating-system screen mirroring. This web update and its
optional MIDI companion do not implement a separate native external-display
scene; they do not promise different content on iPad and external screen.
A browser popup can become a tab on mobile and is not a native display output.
Closing/reloading the main page closes its lyrics window. Physical external-
screen, Safari touch selection and live audio tests still require your devices.

GENERAL SETTINGS AND MIXER SETTINGS
- The top gear opens general Settings.
- Settings > BACKUP contains Library & Backup (lyrics/JSON import and JSON
  export), Backup and project file (.benken import/create/share/download),
  and Full backup & restore. JSON exports contain no audio bytes.
- Settings > PLAYBACK contains Audio output and more options: output mode,
  Read outputs, direct-track routing tools, working-memory display, output
  tests and the Ui24R demo. Practice / Stereo and performance protection
  remain here too. Practice is also available at the top of Mixer Settings.
- Mixer > MIXER SETTINGS (beside Tempo) handles mixer display, track names,
  colors, bus routing, mute groups and Audio & Files for the current song.
  Project/backup/output tools have been moved to the general settings.
- Track-to-bus assignments belong to each song. Bus names, colors and USB
  output assignments are shared throughout the library. Changing a bus's USB
  output changes that bus for every song. Switching songs does not reset it.
- Mute-group names, per-song track memberships and active mute groups save
  automatically. Active groups apply across songs on this device and restore
  after reopening. They do not reset when the app restarts. Song projects
  preserve the receiving device's active group buttons; a full backup can
  restore device settings when explicitly selected.

REPLACE OR RECONNECT A TRACK'S FILE
Stop playback. Open Mixer > MIXER SETTINGS > AUDIO & FILES and press
REPLACE FILE on the existing track. Choose a local, iCloud or Google Drive
file in the system picker. The selected file is copied to local app storage.
Use the same action if the track's audio is missing or you have a new mix.
The app keeps the track's identity, app name, bus, color, gain/pan, playback
format, mute/solo, Follow song key and mute-group assignments. The original
filename shown below the app name changes to the replacement filename.
The file is checked before its song reference is committed. Empty, corrupt,
unsupported files and failed storage/metadata saves keep the previous track.
When several stems are missing, replace them one by one. Play becomes ready
when every track is prepared and its output is available. An unused old local
copy is removed only after the change is saved; copies used by other tracks
or songs stay. Files in iCloud/Drive/Files are not modified or deleted.
Supported imports: WAV, MP3, M4A, AIFF and CAF, subject to browser decoding.

ADD SONGS TO A SETLIST
Open SETLIST, choose a list in the visible dropdown and press + ADD SONGS.
Search by title, artist or tag. Select several songs in the order you want
and press ADD SELECTED. Choose an existing list or enter a new list name.
Selections remain checked when searching. Existing entries and their autoplay
choices stay in place. Selecting a song already in the list adds another
occurrence, for a reprise. CANCEL changes nothing. Settings > SETLIST also
opens this picker. Reusing an existing list name never clears its contents.
The current playing song and mute groups are retained while adding entries.
Use the setlist's up/down controls to reorder entries afterward.

AUTOMATIC LOCAL SAVES
Confirmed settings and setlist changes persist in the existing browser/app
storage, including after closing and reopening. Mixer name/color/routing/
group edits save as you edit; Back flushes valid pending mixer fields.
Some editors (lyrics, song details, controls, timing and pending BPM/key fields)
still have explicit SAVE/APPLY buttons and local recovery drafts. A draft is
not a confirmed change. A failed save keeps the previous data and allows retry.
Primary state commits before optional recovery copies. Failure to write an
optional recovery copy cannot roll back an otherwise successful primary save.
Intentionally deleting the last setlist is remembered even if its old recovery
copy could not be updated. Legacy setlist recovery remains available for data
from versions before this local-save marker was introduced.
Clearing browser storage removes local data. Use backups to transfer devices.

PROJECT FILES AND FULL BACKUPS
Settings > BACKUP > Backup and project file creates one .benken file for the
current song or the entire library, including its referenced original audio.
Press CREATE PROJECT FILE, then SHARE / SAVE TO FILES or DOWNLOAD.
Use IMPORT PROJECT to open a .benken file; it is separate from audio import.
Full backup & restore includes the library, setlists, original audio and
settings, split into numbered parts for large libraries. Save all parts
and select every part from the same backup when restoring. Restoring device
settings (outputs/MIDI/controls) is optional. New project format is 6 and new
full-backup format is 3, unchanged from V26.23/V26.24. Older supported formats
remain readable. Do not use a pre-V26.23 release to open formats 6/3.

MAC M1 / TH-U
The current BenKen web version also runs on Mac; use the same HTTPS site.
For Web MIDI, use Chrome and grant MIDI access. The local library/audio are
separate on each device/browser. Transfer them with project/full backup files.
The web audio guard is still 256 MiB on Mac and iPad. MP3 reduces storage size,
not the decoded PCM needed for playback. Mono playback reduces retained PCM.
TH-U has native Apple Silicon standalone support. Set the Mac/BenKen output
and TH-U input/output to your Ui24R or interface. Use separate USB returns
for backing and processed guitar and the same hardware sample rate. Test the
complete setup, input routing and latency before performance. This release
has no physical Mac M1 + TH-U/Ui24R verification and adds no native Mac engine.

RETAINED AUDIO / PERFORMANCE FEATURES
- Song volume plus optional global Master; meters, faders and double-tap unity.
- Six mute groups, named/color-coded tracks/buses, per-song routing and gain.
- Tempo preserving pitch; original BPM detection/manual entry and BPM -/+.
- Transpose -2..+2 semitones, saved per song, with chords and displayed key.
  Follow song key excludes drums/click by default according to names. Review
  per-track choices. Original audio and ChordPro text are not rewritten.
- Key preparation processes one unique file at a time within the same 256 MiB
  software guard. Shared files reuse prepared variants where possible. Browser
  and decoder overhead can differ from the modeled memory budget. Preparation
  can take time. Tempo-only preparation may require more temporary memory.
- Per-setlist-entry autoplay, optional double-tap Play/Stop protection,
  count-in with 2/4 bars and beat lights, metronome routed to a chosen bus.
  Autoplay prepares the next song after the current one ends; it is not gapless.
- Shared assignable bottom controls, optional waveform/seek, smooth lyric
  scrolling, section markers, song colors and lyric highlighting.
- Offline use after the complete app has been cached and audio imported locally.
  Cloud imports need network access initially. No cloud fetch during normal
  local playback is required. A full backup is recommended before live use.

MIDI KEYBOARD TEST
On Mac, connect a USB MIDI keyboard and open BenKen over HTTPS in Chrome.
Settings > MIDI > OPEN MIDI SETTINGS > CONNECT. Select START, press LEARN
and press one key. Learning assigns it without starting playback. Release and
press again to start. Learn a different key for STOP/NEXT. Releases do not
trigger commands. These are transport controls, not a built-in piano/synth.
Safari on iPad does not implement Web MIDI. The optional native-MIDI Xcode
companion provides iPad MIDI input after being built/signed/installed. It
requires iPadOS 17+ and a Mac/Xcode setup; it is source, not a signed app.

VERIFICATION
337 automated tests passed, plus the chord-display regression. Checks cover
the deployed runtime, modeled DOM/Web Audio,
whole-phrase coloring, external-window behavior, click BPM acceptance, editor
visibility, file replacement and rollback, missing/shared files, setlist search/order/
repeated entries and autoplay, mute-group save/reopen, backup/project transfers,
MIDI commands, transpose/tempo DSP, cached offline assets, lyric scroll and
CSS layout constraints. 
Physical iPad power cycles, Mac M1 + TH-U/Ui24R, touch rendering and the Xcode
build still require Apple hardware. The optional companion's MIDI bridge only
handles the active app. Background multitrack/metronome/MIDI and switching to
Mixing Station have not been physically validated. No native audio engine or
increase of the web memory guard is included.
