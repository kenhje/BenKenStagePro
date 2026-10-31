BENKEN STAGE PRO V26.34 — IMPORT BUS DEFAULTS AND SAFER FILE REPLACEMENT

DEFAULT BUSES FOR NEW TRACKS
Open Mixer Settings > Audio & Files > DEFAULT BUSES FOR NEW TRACKS.
Choose a bus and comma-separated file-name keywords for each track type.
Presets cover drums, guitar/gitar, bass, lead vocals/vokal, click, cue, keys,
backing vocals/BGV and percussion/perk. Use + ADD RULE for more categories.
Changes save automatically. Names are matched without case sensitivity;
spaces, underscores, hyphens and track numbers are handled as separators.
The last matching stem label takes priority over words in the song title.
At the same ending, a longer phrase such as backing vocals wins over vocals.
Identical ambiguous rules for different buses do not select a bus.

Before rules have been edited, unique matching bus names provide suggested
routes. Once edited, rules retain the chosen bus ID across renaming/reopening.
Unmatched files keep the normal import default: Backing / bus 1, or bus 2
for click files. The selected mono/stereo import preference is unchanged.
Rules apply to NEW imports, including other songs. Existing tracks and
REPLACE FILE retain their saved bus, name, color, levels and mute groups.
Rules are included in library projects and full backups. Importing a single
song project keeps the receiving library's existing import defaults.

REPLACE FILE
A replacement is validated by itself and with the full song before replacing
the saved track or deleting its unused original local copy. If full-song
preparation fails because of memory or another preparation issue, the original
file and metadata are retained. Only the chosen track's asset is changed.
Other tracks and their bytes remain in place. Shared original assets are kept
while another track or song uses them. Other genuinely missing/unreadable
files can still be reconnected one at a time.

Audio & Files now shows Stored on this device or Missing on this device for
each track. A track without decoded playback is not automatically a missing
file. Presence checks use IndexedDB keys, avoiding reading all audio bytes.
If audio was never copied to this app/device, it still needs to be imported
or restored from a backup containing audio. Safari and the native app have
separate local data. No iCloud/Drive source file is modified.

UPDATE
This is a web update. Upload the ZIP contents to the root of the existing
kenhje/BenKenStagePro GitHub repository, replacing files with matching names.
Do not upload the ZIP itself or place the files in a new subfolder.
Keep existing files, repository settings and GitHub Pages configuration.
After publishing, open BenKen with internet and verify V26.34 in the mixer.
No Xcode source change or deletion of the installed app is required.
The V26.33 keyboard behavior, top save button and collapsed mute groups are
included. Storage database names/versions and audio memory limits are unchanged.

DEVICE CHECK
Choose the standard buses, import a song's stems and check their routing.
On a test song with several locally stored files, replace one and verify that
all other files stay stored, retain their routing and play after reopening.
If another file is genuinely missing, reconnect that file or restore its audio.
Verify USB routing on Ui24R and offline startup/playback after the update.

VERIFICATION
269 automated checks passed, including the ten new import/replacement tests.
These cover aliases, suffix precedence, backing vocals, ambiguous keywords,
saved routes, reopening, mono imports, six-track replacement, combined-song
preparation rollback, genuine missing/corrupt files, preserved replacement
routes and low-memory key-only presence checks. Project/full-backup metadata
and receiving-library defaults were also checked separately.
Checks use DOM/audio/IndexedDB/CSS models. Actual iPad Files/iCloud/Drive picker,
keyboard behavior, native offline startup and Ui24R routing still need device
testing. The physical cause of the reported relinking issue is not confirmed.
