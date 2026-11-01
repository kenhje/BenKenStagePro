BENKEN STAGE PRO V26.45 — AUDIO STABILITY

UPDATE
Extract this ZIP and upload all its contents to the root of your existing
kenhje/BenKenStagePro GitHub repository, replacing matching filenames.
Upload the extracted contents, including demo/, not the ZIP itself.
No Xcode, Swift or REAPER Lua update is needed. Keep the working native
network fix 26.37.2 already installed on your iPad.

Open BenKen with internet after GitHub has published and check V26.45 in the
mixer. Close and reopen the app if necessary. Let the offline update finish
before switching to Ui24R Wi-Fi. Do not delete the app or reset its storage.

AUDIO FIRST
This update temporarily bypasses region looping, track EQ and master
compression. Saved FX values remain in your library, projects and backups.
The FX panels show bypass explicitly and their controls are read-only.
The loop toggle is hidden; a previously customized loop button is disabled.
Saved loop mode is turned off. Ordinary Play, Pause, Stop and timed section
navigation remain available. There is no extra processor in the audio path.

Master and Song meters now attach only while the mixer is visible and only
to hardware channels used by this song or the generated click. Closing the
mixer or hiding the page releases those meter branches without stopping the
stems. Track and bus meters continue to work in the open mixer.

Waveform previews use bounded sampling. New or unfinished waveform previews
wait until playback and metronome stop; an existing preview remains visible.
This avoids new PCM buffer reads and long waveform scans while music plays.
The preview is approximate; the signal meters still use actual audio samples.

PRESERVED
Audio files, songs, track names, output buses, mute groups, faders, Ui24R cue
links, MIDI, REAPER import/update, transpose/tempo, backups and Host/Follow
are retained. Storage keys and database schemas are unchanged. Levels are
not automatically reset, normalized or limited. The iPad volume buttons can
still affect the output: retain your established soundcheck level.

TEST ON YOUR IPAD
1. Use the same song and six stems that produced clicks. Keep routing and
   levels as they were. Start from the installed app icon; you can stop the
   Xcode run and open the installed app again for this test.
2. Play the whole song with the mixer closed. Then repeat with the mixer
   open and move a few faders. Check for audible clicks, pops or dropouts.
3. Check a second song. If the issue remains, compare Practice / Stereo
   with Live / USB separately. Stop before changing output mode.
4. In the open mixer, check CLIP indicators. Record whether any clicks occur
   with or without clipping, and whether they depend on opening the mixer.
5. Confirm cue recall, then test after switching to Ui24R Wi-Fi without
   internet. Existing local audio remains on the iPad.

Report the song, mode, whether the mixer was open, and whether clicks remain.
The physical iPad/Ui24R problem was not reproduced here; this release removes
identified sources of unnecessary work and requires your hardware test.

VERIFICATION
374 automated checks passed: audio-graph/transport models, storage, REAPER
import/update, backups, offline caching, Ui24R cue control and layout rules.
The retired compressor's JavaScript shutdown was also checked. With six
mono routes on USB 17–22, the graph model changes master-meter branches from
64 to 12 with the mixer open, and to zero when it is closed. These are node
counts, not CPU benchmarks or proof of dropout-free audio on hardware.
No physical iPad/Ui24R, Xcode build or full browser interaction test is
claimed. This ZIP has not been deployed to GitHub.
