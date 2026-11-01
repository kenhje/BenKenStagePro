BENKEN STAGE PRO V26.43 — REGION LOOP, TRACK EQ AND MASTER COMPRESSOR

UPDATE
Extract the ZIP. Upload its contents to the root of your existing
kenhje/BenKenStagePro GitHub repository, replacing matching filenames.
Include benken-master-fx-v26-43.js and demo/. Upload the extracted files,
not the ZIP. Open BenKen with internet after GitHub has published the update.
Check V26.43 in the mixer. Close and reopen if the previous version remains.
Prepare offline access again before switching to the mixer Wi-Fi.
No Xcode, Swift or REAPER Lua update is needed. Do not delete the app or
reset its storage. Existing songs, audio files and routing are retained.

REGION LOOP
1. Choose a song with prepared audio and timed REAPER or SYNC LYRICS sections.
2. Turn on LOOP REGION beside WAVEFORM. This also enables TAP SECTION TO PLAY.
   LOOP REGION can also be assigned to a button in CUSTOMIZE CONTROLS.
3. Tap the desired section heading in the lyrics, or its label in the
   waveform's upper colored row. It starts there and repeats that region.
4. While looping, tap another section. It shows NEXT and starts when the
   current round ends. All audio tracks change at the same scheduled time.
5. Choose another section to change the queue, or choose the currently
   looping section to cancel a queued change and keep repeating it.
6. Turn LOOP REGION off to finish the current round and continue the song.

ALLOW SEEKING DURING PLAYBACK must be enabled for section changes while
playing. DOUBLE-TAP PLAY protection still applies when starting from Stop.
Dragging the waveform or using ordinary seek buttons leaves the active loop.
Pause cancels the queued choice and resumes the current region when played.
Stop or a song change clears the active loop and queue. The LOOP REGION
on/off preference is remembered, but reopening never restarts playback.
Autoplay does not advance to the next song while a region keeps looping.

Matching-length REAPER stems loop without copying decoded audio. A shorter
stem that overlaps the region uses a padded region buffer, counted against
the existing 256 MiB decoded-audio limit. A rejected queue keeps the current
loop playing. Very late changes inside the final 20 ms cannot replace an
already committed transition; choose again after it changes.

TRACK EQ
Press EQ at the top of a track strip, or select another track in TRACK EQ.
Enable EQ ON and adjust Low / Mid / High, each from -15 to +15 dB.
Low is a 120 Hz shelf; Mid is a 1 kHz bell (Q 1); High is an 8 kHz shelf.
EQ applies before mono/stereo routing in both Practice and Live modes.
Changes save automatically with the track and song, survive REAPER stem
updates, and are included in song projects and full backups. EQ starts off.
RESET EQ returns the bands to zero and bypasses EQ.

MASTER COMPRESSOR
Open COMP on the Master strip, MASTER COMP in Mixer Settings when the
Master fader is hidden, or the MASTER COMP tab in the Audio FX dialog.
Enable COMPRESSOR ON. Adjust Threshold, Ratio and Makeup. The meter shows
gain reduction. Attack is 10 ms, release 150 ms and the soft knee is 6 dB.
Compression is before the Master fader, after Song volume. One linked gain
reduction applies across all outputs, including generated click. Separate
USB channels remain separate; this does not create a stereo downmix.
Settings are shared by all songs on this device and save automatically.
Full backups include them; importing a song project keeps this device's
master settings. The compressor starts off. RESET COMPRESSOR bypasses it.
This is a compressor, not a brickwall limiter.

The compressor requires AudioWorklet support and the matching versioned
worklet file, included in the offline cache. If preparation fails, the FX
dialog reports it and retains the previous setting. A processor failure
bypasses compression and reports the error while transport continues.

PRESERVED
REAPER stem selection and lyric/region updates, Personalization region
colors, touch section playback, compact Tracks/Buses and Audio & Files,
multitrack USB routing, mono default, mute groups, MIDI, backup, offline,
Autoplay and local Host/Follow. Storage keys, database schema and native
LAN protocol 26.37 / follower page 26.37.1 are unchanged.

VERIFICATION
381 checks passed with no failures: transport/audio-graph models, the
actual JavaScript compressor kernel, persistence/import/backup/offline checks,
and CSS cascade/layout assertions. Native source and storage schema are
unchanged. Audio DSP is new. No physical iPad/Ui24R or full browser interaction
test is claimed. Test audio quality, queued region transitions, offline FX
loading and CPU performance on your setup. Not deployed to GitHub.
