BENKEN STAGE PRO V26.36 — REAPER REGIONS AND LYRIC SECTIONS

INSTALL THE WEB UPDATE
Unzip this archive. Upload its contents to the root of the existing
kenhje/BenKenStagePro repository on GitHub, replacing matching files.
Do not upload the ZIP itself. Keep other repository files.
After GitHub Pages publishes, open BenKen with internet and check V26.36
in the mixer. If the installed app still shows V26.35, fully close and
reopen it while connected to internet. Do not delete or reinstall the app,
and do not clear its data. Safari and the native app have separate data.

REGION AND LYRIC UPDATES
Continue using the working BenKen_Export_V5.lua script in REAPER.
No new Lua script or Xcode/native update is required for this feature.

1. Edit, rename, retime, move or add regions in your song's REAPER project.
2. Run BenKen_Export_V5.lua and save a new .benken export.
3. In BenKen: MIXER > MIXER SETTINGS > AUDIO & FILES >
   IMPORT / UPDATE FROM REAPER. Open that .benken file.
4. Select the existing song. Leave these options selected:
   - Use REAPER regions for waveform and section timing
   - Sync lyric section headings
5. Check the section-change summary, then press UPDATE SONG.

Region names and order update the section headings in BenKen's song text.
New regions create empty sections. Existing words, chords and text colors
stay with their matched section. Start/end times update the waveform and
lyric-follow timing. Removed or unmatched sections containing text are kept
at the end, with no imported region timing. They are shown in the summary.
Empty unmatched headings may be removed. Text before the first heading
stays at the beginning; the importer does not guess which region it belongs to.

If you want only the audio and waveform updated, turn OFF
Sync lyric section headings. Existing text and saved manual section times
then stay unchanged. Turning off Use REAPER regions also disables lyric sync.

Existing songs first match exact heading names, including equal counts of
repeated names, or valid previously saved REAPER section times. Subsequent
updates remember each region's link to its lyric section. Keep REAPER region
IDs stable where possible. After deleting/recreating or renumbering regions,
check the result: reused IDs can represent different sections. Local manual
heading changes may also leave sections unmatched; their words are retained.

This updates the text saved INSIDE the BenKen song. It does not overwrite
an original .txt/.cho file on iCloud or Google Drive. An ordinary Save in
REAPER does not sync BenKen; use the export/import steps above.

PRESERVED BEHAVIOR
Other tracks, local track aliases, notes, setlists, buses, levels, colors,
playback format and mute groups are kept when updating an existing song.
Partial exports still replace only the chosen stems. The normal project
backup and full backup preserve region-to-lyric links for later updates.
Playback/import failure before saving leaves the original song and audio
intact. The same local databases and 256 MiB decoded-audio limit are used.

The generated BenKen metronome does not yet follow a variable REAPER tempo
map. Export the REAPER Click stem for songs with tempo changes.

TESTING
Automated JavaScript/model checks cover region renames, additions, ordering,
retiming, removed-section preservation, repeated names, color formatting,
import review and opt-out, audio-error rollback, reopening, offline assets,
project/full backup, mixer controls and the existing six-bus V5 packets.
The updated app must still be tested on your iPad. This archive is not
published automatically. No audio DSP, Lua exporter or native Swift change.

VERIFICATION
321 automated JavaScript/model checks passed, including the corrected
offline cache/version assertions. Physical-device testing remains required.
