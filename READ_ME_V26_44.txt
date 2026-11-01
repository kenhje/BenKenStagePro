BENKEN STAGE PRO V26.44 — LOOP PLAY AND GRAPHIC AUDIO FX

UPDATE
Extract this ZIP and upload all its contents to the root of your existing
kenhje/BenKenStagePro GitHub repository, replacing matching filenames.
Include benken-master-fx-v26-44.js and demo/. Upload the extracted contents,
not the ZIP. No Xcode, Swift or REAPER Lua update is needed.
Open BenKen with internet after GitHub has published. Check V26.44 in the
mixer. Close and reopen if necessary and let the offline update complete
before switching to the mixer Wi-Fi. Do not delete the app or reset storage.

PLAY WITH LOOP REGION
Turn on LOOP REGION, then press ordinary PLAY. It starts and loops the
section at the current position. After STOP, PLAY starts with the first
section. Pause resumes the same loop at the paused position. This works
with controls-only layouts and does not require a waveform or an initial
section tap. DOUBLE-TAP PLAY still requires two taps when enabled.

While looping, tap a different timed heading or waveform region label to
queue it. It starts when the current round ends. Change that choice by
selecting another section, or select the current section to keep looping it.
Turn LOOP REGION off to finish the current round and continue the song.
Stop clears the active loop and queue. The mode preference is remembered.
REAPER regions and manual SYNC LYRICS timing both work.

A song without valid timed sections can still play normally. If an initial
loop cannot be prepared, ordinary playback is retained and a message explains
why. A failed queued change leaves the existing loop running. Matching-length
REAPER stems require no extra decoded copies; shorter overlapping stems may
need silence padding within the existing 256 MiB limit.

The exact reported disabled Play behavior on a physical iPad was not
reproduced here. The previous behavior where normal Play did not activate
the selected loop mode is covered by a before/after comparison. Check your
actual iPad and Ui24R after updating.

ONE TRACK FX BUTTON
The TRACK SETTINGS button below each mixer track is replaced with FX · EQ.
The previous small EQ header button is removed. Press FX · EQ for that
track's equalizer. Output routing and mute groups remain accessible through
their existing fields and Mixer Settings. Master compression is accessible
via COMP, MASTER COMP in Mixer Settings, or the MASTER COMP tab in Audio FX.

GRAPHIC FOUR-BAND EQ
Low and High are shelf filters with gain and frequency. Low Mid and High Mid
are peaking filters with gain, frequency and width in octaves. Gain range is
-15 to +15 dB. The frequency scale is logarithmic, 20 Hz to 20 kHz, capped
at the audio engine's usable upper frequency.

Drag a numbered point to change gain and frequency. Drag a knob vertically,
use arrow keys, or type a value. Double-tap a knob to reset it. EQ ON toggles
processing; RESET EQ returns to the default, bypassed settings. The graph
still shows stored settings when bypassed, with a dashed curve.

The old three-band EQ gains and frequencies migrate into the four-band EQ;
the added High Mid band begins at zero gain. The EQ saves per track and song,
is retained through REAPER stem updates, and is included in project files
and full backups. EQ adjustments do not replace or re-decode source files.

GRAPHIC MASTER COMPRESSOR
The graph shows input level versus output level. Drag T horizontally for
Threshold and R vertically for Ratio. Six rotary controls set Threshold,
Ratio, Makeup, Attack, Release and Knee. The meter shows gain reduction.
Numeric fields and knob keyboard controls are also available.

Compression remains linked across every output channel before Master volume,
after Song volume. All USB channels remain separate, including click outputs.
It is a compressor, not a brickwall limiter. The settings are shared by all
songs on this device, save automatically, and are included in full backups.
Importing a song project preserves this device's master settings.

If a saved compressor cannot load when pressing PLAY, it is bypassed and the
reason is reported; it no longer blocks ordinary or loop playback. This can
happen when a required worklet file is missing, unavailable offline or not
supported. The bypass state is saved, retaining the parameter values. Retry
COMPRESSOR ON after making the complete update available. A processor error
also bypasses compression while backing-track transport continues.

PRESERVED
All existing audio files, songs, routing, buses, mute groups, REAPER import,
transpose/tempo, section colors, touch controls, MIDI, backup and Host/Follow.
Storage keys and database schema are unchanged. Native LAN protocol is 26.37
and the follower page remains 26.37.1. EQ and compressor start bypassed on
new tracks/devices. Existing saved on/off choices are kept during migration.

VERIFICATION
393 checks passed with no failures: transport/audio-graph models, the
actual JavaScript compressor kernel, persistence/import/backup/offline checks,
and CSS cascade/layout assertions. Native source and storage schema are
unchanged. Four-band EQ and additional compressor controls change audio DSP. No physical iPad/Ui24R or full browser interaction
test is claimed. Test audio quality, queued region transitions, offline FX
loading and CPU performance on your setup. Not deployed to GitHub.
