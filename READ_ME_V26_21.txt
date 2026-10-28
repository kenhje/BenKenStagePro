BenKen Stage Pro V26.21 — Setlist autoplay, count-in and routed metronome

GITHUB WEB UPDATE
Upload these files to the ROOT of the existing GitHub repository:
index.html, sw.js, benken-runtime-v26-21.js, benken-ui-v26-21.css,
manifest.webmanifest, icon-192.png, icon-512.png, SUPABASE_SETUP.sql,
and the demo folder. Wait for GitHub Pages publishing, then reload until
V26.21 appears. Keep a .benken backup before updating.
The iPad_MIDI folder is a separate Xcode project, not a web asset.
This package has not been uploaded to your GitHub repository automatically.

WHAT CHANGED IN V26.21
- Each song entry in a setlist has its own AUTO button. Tap it to switch that
  entry on or off. Settings > SETLIST also offers Default / On / Off for each
  entry. Default follows Settings > PLAYBACK > DEFAULT AUTOPLAY FOR SETLIST
  ENTRIES. Autoplay starts the NEXT entry after the enabled entry finishes.
  For example: first entry On, second entry Off plays both, then stops.
  The same song can have different choices in different setlists or repeated
  positions. Reordering or deleting entries keeps their choices aligned.
  The final entry stops; ALL SONGS never plays through automatically.
  Audio for the next song is prepared after the previous one ends, so this
  is not gapless playback. An invalid route or failed preparation stops it.
- Mixer > TEMPO > Count-in & metronome contains the new per-song settings.
  Choose OFF, 2 bars or 4 bars and 2–12 beats per bar (4 by default). Starting
  from the beginning waits the chosen number of bars before all stems start
  together. Beat lights show the count above the bottom controls, including
  icons-only/buttons-only layouts and while the mixer is open.
  COUNT-IN SOUND optionally adds audible clicks. It defaults off.
  STOP cancels the count and scheduled playback. Resuming partway through a
  song does not repeat the count-in; returning to the beginning does.
- START METRONOME works without any uploaded audio. Choose an output bus
  from the existing 16 buses and adjust the click level. Follow saved playback
  BPM uses the song's saved tempo when available; otherwise the manual
  metronome BPM is used (default 120, not an automatically detected tempo).
  Turn Follow off to choose an independent metronome tempo. All BPM fields
  remain under TEMPO. SAVE CLICK SETTINGS remembers these choices per song.
- CONTINUE WITH BACKING adds generated click during song playback. It defaults
  off. The generated click follows the playback clock, including seeks and
  resumes. Bus gain/mute, SONG and MASTER levels all affect it. LIVE / USB
  uses that bus's saved USB outputs; PRACTICE / STEREO mixes it into 1–2.
  Visual-only count-in needs no click output. An audible click needs an
  available output; an unavailable USB output is reported, never silently
  changed to stereo. Confirm your click bus is excluded from the audience mix.
- Metronome start / stop and Count-in off / 2 / 4 bars can be assigned as
  bottom controls or MIDI actions. They are optional additions; the default
  eight controls remain. STOP also stops a metronome running without backing.
- Full backups now include per-entry autoplay and all click settings. New
  .benken projects use format 5; new full backups use format 2. V26.21 reads
  older projects (1–4) and full backups (1). Older releases reject the new
  formats rather than silently losing these playback settings.

FEATURES RETAINED FROM V26.20
- Settings now opens on PLAYBACK. PRACTICE / STEREO and LIVE / USB are large,
  explicit choices. They are also at the top of Mixer Settings, and the mixer
  header shows the current mode. Output routing is preserved in Practice.
  Click is included in the stereo mix; mute its bus/track when not wanted.
  Stop playback before switching. A failed save restores the previous mode.
- DOUBLE-TAP PLAY and DOUBLE-TAP STOP / PAUSE are optional in Settings >
  PLAYBACK. First press arms the action; a second press within one second
  confirms it. Applies to screen controls and MIDI commands. Both default off.
  A third immediate toggle after a confirmed Play does not pause playback.
- Default autoplay is optional, default off. It uses the selected
  setlist order, including repeated entries, and stops at the final entry.
  No looping or automatic playback through ALL SONGS. Missing audio, invalid
  USB routing or an open editor stops the transition. Manual Stop cancels a
  next-song preparation before it can start playing late.
  THE NEXT SONG IS PREPARED AFTER THE PREVIOUS ONE ENDS: THIS IS NOT GAPLESS.
  Only one song is decoded at a time to respect the existing memory guard.
- PRACTICE / LIVE, AUTOPLAY and BACKUP are available as assignable bottom
  controls. The default eight controls are unchanged. Up to 40 slots allow
  every currently available action to be assigned.

AUTOMATIC LOCAL SAVING
Confirmed library, setlist, mixer and settings changes still save locally.
A second local recovery checkpoint can restore an unreadable primary state.
The lyrics editor, song editor, Mixer Settings, controls editor, section timing
and BPM/click fields save their latest pending recovery draft automatically.
A draft is recovered only for the same song/settings and the same baseline.
SAVE / APPLY confirms editor changes; CANCEL intentionally discards the draft.
Drafts are local recovery data, not an automatic cloud upload or a full backup.
A failed lyrics save leaves the editor open and keeps the original song intact.

FULL BACKUP & RESTORE
Settings > BACKUP > CREATE FULL BACKUP includes confirmed songs, lyrics,
section markers, setlists, mixer data, device settings and original audio bytes.
Large libraries are split into numbered .benkenbackup files, normally around
32 MiB of stored audio each. A single larger asset stays together (up to the
existing 160 MiB per-file limit). Aggregate library backups can exceed 256 MiB.
Decoded audio is released before backup preparation. Prepare and download one
part at a time, saving each before choosing NEXT PART. Keep EVERY part together.
Downloads can be stored/moved with Files into iCloud Drive or Google Drive.
Cloud providers have not been physically tested here; selected source audio is
copied locally, and edits are not written back into the original cloud files.

To restore, select ALL parts from ONE backup under RESTORE FULL BACKUP.
Parts may be selected in any order. Missing, duplicate, mixed or structurally
incomplete parts are rejected before any audio is written. New audio writes
roll back if copying or library metadata saving fails. Existing local audio is
kept. A text backup of the current library downloads before replacement.
ALSO RESTORE DEVICE SETTINGS is off by default: this keeps the receiving
device's output mode, master level, MIDI assignments and control layout.
Enable it explicitly to restore those settings from the full backup as well.
The full backup contains confirmed settings, not unfinished editor drafts.
Existing .benken projects (formats 1-5) and JSON text backups remain supported
in their existing import locations. .benkenbackup is a separate full-backup
format; newly created format-2 backups need V26.21 or later. It is not an
audio-file import.

FAILOVER / REAPER
No pilot tone or automatic hardware failover has been added in this release.
The intended failover switch and its signal specification must be identified
before implementing and physically validating a dedicated output signal.
REAPER integration is intentionally deferred, as requested.

FEATURES RETAINED FROM V26.19
- New audio tracks default to MONO. In Mixer Settings > AUDIO & FILES, use
  New tracks > Stereo when you want to retain stereo playback. This choice
  applies only to future additions and is remembered on this device.
- Mono playback now creates a one-channel working buffer by averaging L/R.
  The original file remains unchanged in local storage and project backups.
  Changing back to Stereo prepares the original L/R channels again.
- Existing tracks keep their saved format. To reduce their memory use, go to
  Mixer Settings > TRACKS, set Playback format to Mono and SAVE MIXER SETTINGS.
  Audio is prepared again automatically. No project import is needed.
- Audio & Files shows the original file format separately from Playback:
  Mono / Stereo. A mono output bus alone does not reduce decoded file memory.
- When an asset is shared by multiple tracks, its decoded buffer is shared.
  If any of those tracks needs Stereo, both channels are retained for that
  asset. Otherwise a stereo source uses half the retained PCM in Mono mode.
- A playback notice next to the bottom controls explains why Play is disabled,
  including preparation errors and unavailable USB outputs. It remains visible
  with icons only, buttons only and the mixer open. A shortcut opens AUDIO &
  FILES, or PREPARE AUDIO when buffers need to be prepared.
- Deleting a file no longer replaces a failed audio preparation with a success
  message. Changing names or reading outputs cannot hide the blocker notice.

SIX TRACKS AND MEMORY
The web engine still has a fixed 256 MiB audio working-memory guard.
At 48 kHz, six separate 2:50 mono playback stems retain about 187 MiB;
the same six stereo stems need about 374 MiB and cannot fit that limit.
Mono conversion also budgets the temporary stereo source plus mono copy.
Longer songs, other sample rates, shared stereo assets and tempo processing
can still exceed the limit. Muting tracks does not release their buffers.
Pitch-preserving tempo preparation needs additional temporary memory.
A newer iPad does not automatically change this software limit.
These are PCM calculations and automated checks, not physical iPad results.

FEATURES RETAINED FROM V26.18
- TRACKS, OUTPUTS / BUSES, MUTE GROUPS and TEMPO are exclusive views in one
  mixer navigation row. BPM fields appear only in TEMPO.
- TRACKS shows the same six mute group buttons used in MUTE GROUPS. The actual
  button row is shared; labels and mute states stay synchronized with the
  bottom controls and MIDI actions.
- Mixer Settings > Display contains Show master fader, Channel width and the
  control bar toggle. These choices stay visible on every mixer settings tab.
  The mixer header keeps the title, settings gear and close button.
- Settings now has separate CONTROLS and MIDI tabs. SCENE was renamed CONTROLS.
- TOOLS is organized into Library & Backup, Live sync, Song info poster and
  Current song utilities. Duplicate Audio file / Multitrack shortcuts were
  removed. Audio output tests are under Mixer Settings > AUDIO & FILES >
  Audio output and more options > Audio test and Ui24R USB routing.

FEATURES RETAINED FROM V26.17
- The console now reserves the combined width of SONG and MASTER, including
  Narrow mixer and phone layouts. Their fader rails have compact internal
  spacing so they stay within the strips.
- Slow autoscroll retains fractional pixels in a reading layer, compensating
  when the browser rounds native scroll offsets. Pause/resume preserves the
  visible position. Manual seeks and font-size changes still follow timing.
- TEMPO now has one main Playback BPM field with -/+ buttons (1 BPM per tap).
  Tap APPLY while stopped to prepare and save the new tempo.
- Original BPM & detection contains the source BPM field and DETECT ORIGINAL
  BPM. Existing {tempo: 120} / {bpm: 120} song metadata can prefill the BPM.
  Audio detection analyzes a prepared click/drum/backing stem locally. It
  produces an estimate, not a guarantee of the original musical beat.
  Check half/double tempo using the 1/2 and 2x buttons, then USE ESTIMATE.
  APPLY commits the source/playback BPM. No estimate is saved automatically.
  A regular click track is the clearest reference. Silence, sustained notes
  or material without a clear beat can require manual BPM entry.

FEATURES RETAINED
- Duration-synced lyrics move continuously through marked sections instead
  of holding a section and then jumping. Mark each section start using
  SYNC LYRICS. Without markers the existing duration-based scroll remains.
  Timing is estimated within each section, rather than word-level karaoke.
- SONG controls all stems for the current song and remembers its level.
  Your previous per-song master level becomes this SONG level automatically.
- MASTER is now a separate overall level, shared by all songs on this device.
  Hide it under Mixer Settings > Display > Show master fader. Hiding it keeps its current level and mute.
  Both faders support double-tap / double-click to return to 0 dB.
- MUTE GROUPS is a mixer tab next to OUTPUTS / BUSES. It shows the six mute
  buttons, membership summaries and a shortcut to edit assignments.

TEMPO IN BPM
In the mixer, open TEMPO. Set or detect the original BPM under Original BPM
& detection, choose Playback BPM using the field or -/+, then press APPLY
while playback is stopped. Both values are saved per song.
Example: Original 120, Playback 108 = 90% speed, same pitch.
ORIGINAL TEMPO resets Playback BPM to the stored Original BPM.
The supported range is 75–125% of the original (BPM inputs 20–300).
The original BPM must be correct. Detection is a suggestion; confirm the beat
before applying a speed change. Manual entry remains available.
Preparation applies a common pitch-preserving time-stretch map to all stems.
Audio files are not rewritten or re-encoded. Separate USB routing is retained.
Waveform, seek, song length and saved lyric-section markers follow the new tempo.
Tempo preparation takes extra time and temporary decoded memory. The 256 MiB
working-memory limit still applies. A large song can play at original tempo
but fail preparation at a different BPM. Choose ORIGINAL TEMPO in that case,
or use fewer/shorter/mono stems. MP3 does not lower decoded memory by itself.
Check musical sound quality and click clarity before live use; this version's
time-stretch processing has automated pitch/synchronization tests, not hardware
or listening validation on your iPad/Ui24R.

MIDI / FOOT CONTROLLER
Settings (gear) > MIDI > OPEN MIDI SETTINGS.
MIDI can also be assigned as a bottom control using Customize controls.
1. Connect the MIDI interface and press CONNECT.
2. Choose an action, press LEARN and press the desired FCB1010 footswitch.
3. Repeat for START, STOP, NEXT, PREVIOUS, mute groups or other actions.
The learning press assigns the control and does not execute its action.
START is idempotent; PLAY / PAUSE toggles playback.
CC, Program Change and Note messages are supported. CC value 0 / note-off
is ignored for buttons. Expression-pedal volume assignments accept CC 0–127.
Program Change numbers are displayed as 1–128 (raw MIDI values are 0–127).
MIDI channel and message number are captured by Learn. Conflicts are reported.
Input selection and assignments are saved on this device, outside song projects.
FCBFF may configure the original FCB1010; BenKen does not send SysEx or alter
its programming. Configure one consistent message per intended action.

MIDI ON IPAD / MAC
Safari on iPad does not expose Web MIDI. The web update alone cannot receive
your hardware pedal in Safari. FCBFF does not change that browser limitation.
On Mac, a Web MIDI browser such as Chrome can receive the pedal directly.
For iPad, the included iPad_MIDI folder contains an Xcode companion app source
project using Apple's Core MIDI and this same hosted BenKen web interface.
It supports a wired MIDI interface and the system Bluetooth MIDI pairing panel.
A stock FCB1010 needs a MIDI interface or an external Bluetooth MIDI adapter;
it does not gain Bluetooth just by installing FCBFF.
See iPad_MIDI/READ_ME.txt for build and transfer steps.

STORAGE AND COMPATIBILITY
Existing songs, original audio files, setlists and section markers stay in
these stores: benken-ipad-v4 / benken-audio-v1. No cache clear is required.
A new .benken export uses project format 5 to prevent older app versions from
silently ignoring click settings. V26.21 reads project formats 1 through 5.
Song tempo, click settings and SONG level travel with projects; device MASTER and MIDI
assignments stay on the receiving device. Safari and the iPad companion app
have separate local storage: export a .benken project in Safari and import
that copy in the companion app. Original cloud files stay untouched.

VERIFICATION
256 automated tests passed across the complete suite, plus the chord-display
regression checks. These cover per-entry autoplay, count-in timing/cancellation,
metronome routing and seek phase, modeled DOM/Web Audio, project transfers,
MIDI, tempo DSP, pitch, BPM detection, fractional scroll motion and CSS width
constraints. Actual Safari/iPad touch layout,
FCB1010/Ui24R, Bluetooth pairing and the Xcode build require testing on Apple
hardware. This package is source code, not a signed app or TestFlight release.
Continuous click uses the browser audio clock with scheduling ahead, but
background execution and simultaneous use with Mixing Station have not been
physically validated. Keep BenKen visible for the first hardware test.
