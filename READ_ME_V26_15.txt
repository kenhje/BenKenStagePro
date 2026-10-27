BenKen Stage Pro V26.15 – smooth scrolling, English UI, song colors and Melody

UPDATE GITHUB
Extract the ZIP and upload ALL files, including the demo folder, to the root of
your GitHub repository. Replace files with the same names.
Upload index.html, sw.js, benken-runtime-v26-15.js and benken-ui-v26-15.css
together with the rest of the package. Older versioned bundles may remain.
This ZIP does not publish itself automatically.
Wait for GitHub Pages to finish publishing, then reopen the app.
Check that V26.15 appears at the top of the app and inside the mixer.
Use the same URL and browser profile as before. Song, setlist and local audio
storage keys are unchanged. You do not need to delete browser data.

SMOOTH SECTION SCROLLING
The reading positions introduced in V26.14 are kept. Short verses and choruses
still fit inside the reading area, and long sections scroll their overflow.
Automatic movement between those positions now eases in and out, with a speed
limit, instead of jumping directly from one section to the next.
A manual seek in the timeline still goes directly to the selected time.
Text size changes recalculate the reading position at the same song time.
Existing section markers are kept; you do not need to set them again.
When the song ends, the last scroll movement finishes gently before autoscroll
switches off. Pause and resume keep the current sync time and scroll position.
Section timing follows the markers you set, rather than individual words.
Timing and text layout still determine where each section appears.

ENGLISH INTERFACE
App-owned buttons, headings, menus, help text, input hints, accessible labels
and status/error messages are now English. The included demo song is English.
Old default bus/group labels are converted to their English equivalents.
Your song titles, lyrics, original filenames, custom names, setlist names and
custom button labels are kept as authored.
The app does not change the language of the iPad/macOS file picker or system
dialogs. Those follow the device language.

SONG COLORS
Open LIBRARY and press the pencil beside a song to open Edit Song.
Choose a color swatch, or use the color picker, then press SAVE SONG.
The color appears in the setlist, library, current song title and next-song cue.
Each song has its own color. It is shared by that song in every setlist.
Press NO COLOR, then SAVE SONG, to remove the color.
CANCEL leaves the saved color unchanged. Failed saves preserve the previous song.
Colors are saved locally and included in JSON and .benken project backups.
Audio files, routing, lyric colors and section timings are retained.

MELODY SECTIONS
MELODY is available beside INTRO, VERSE and CHORUS in both lyric editors.
Press MELODY to insert a {c: MELODY} heading at the cursor position.
It has its own section color, also used in the waveform after section syncing.
The app also reads {start_of_melody} as a Melody section.
To sync a song: SYNC LYRICS → SET NOW at every section start → SAVE SYNC.
All starts must be set, in order, before colored section lengths appear.
A Melody section lasts until the next marker, or the song end if it is last.
Adding a new section changes the section list. Update its timing in SYNC LYRICS.
Changing only words between existing headings keeps the saved start times.

OTHER CONTROLS
A− and A+ remain available through the control-bar settings.
Text size changes by 2 px per press, from 14 to 52 px, without restarting audio.
The mixer still shows buttons only; the waveform returns when the mixer closes.
Play is green while running; Stop is red when stopped. Both are neutral on pause.
Audio file naming, confirmed deletion, right-swipe deletion, buses, mute groups,
meters, channel colors and double-tap to reset faders to 0 dB are retained.

FILES AND LIMITS
Select a song → MIXER → settings gear → AUDIO & FILES → + AUDIO FILES.
The app copies and prepares files locally. No project export/import is needed
for normal playback. All stems should be exported from the same start point.
Backup and project file, and Audio output and more options, are expandable.
The active song still has a 256 MiB decoded-audio memory limit.
Playback files are limited to 160 MiB each. Project backups are limited to
256 MiB of stored audio. MP3 saves storage space, but not decoded memory at
the same duration, sample rate and channel count. No EQ has been added.
New project files use format 3. Format 1 and 2 imports remain supported.

VERIFICATION
152 automated tests pass, plus the separate chord/settings regression check.
Tests use modeled DOM, screen geometry, Web Audio and IndexedDB. They cover
smooth transitions, seeks, text size, English UI, Melody, song colors, backups,
exact media bytes, save failures and the existing playback/setlist functions.
No real Safari layout or physical iPad/Ui24R test was performed here.
Check smooth section transitions, song colors and Melody on your iPad.
