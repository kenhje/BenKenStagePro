# BenKen Stage Pro – changelog

Collected from the per-version READ_ME and LES_MEG files (newest first). The app shows the same history under Help & Info → What’s new.


## BenKen Stage Pro V26.276

- Help & Info → Privacy: short summary of what is stored on the device and in the cloud, with links to https://benkenstagepro.com/privacy.html and support@benkenstagepro.com. Search for "privacy" or "personvern" in Ask BenKen.
- About BenKen and Report a problem show support@benkenstagepro.com.
- Native V27.63 opens links to other sites (https and mailto) in Safari and Mail; earlier versions ignore them.
- Problem reports now send an email to support@benkenstagepro.com through Resend: supabase/sql/SUPABASE_PROBLEM_REPORT_ALERTS.sql (already run; the Resend key is in Supabase Vault as benken_resend_key).

## BenKen Stage Pro V26.275

- Help & Info → Report a problem: area, summary, what happened, steps, song and optional email, plus diagnostics (versions, engine, screen, current song, recent errors, Audio Status from the app). SHOW WHAT IS SENT previews the exact report.
- Sent to Supabase table benken_problem_reports via benken_report_problem() (anon or signed in; 10/hour per account, 120/hour unsigned). The app cannot read reports; read them in the Supabase dashboard. Reports are queued offline and sent later.
- Database: supabase/sql/SUPABASE_PROBLEM_REPORTS_V26_275.sql (already run).

## BenKen Stage Pro V26.274

- licenses.html: third-party code and full license texts (QR Code Generator MIT; soundcraft-ui-connection 7.0.3 MIT with bundled RxJS 7 Apache-2.0 and tslib 0BSD), plus trademark notes. Shown in Help & Info → Open-source licenses.
- The Ui24R library is bundled as soundcraft-ui-connection-7.0.3.mjs (unmodified, license header added) instead of downloaded from jsDelivr: works offline and keeps the App Store build free of downloaded code.
- sw.js and app-files.json include both new files.

## BenKen Stage Pro V26.273

- Delete account (App Store requirement): Settings → Songs & setlists → Profile & document details → BenKen account, and under Autosync & web editor. Confirm by typing DELETE.
- The app first removes the user's files in Storage (rehearsal mixes they uploaded, their shared packages), then calls benken_delete_my_account(), signs out and keeps local songs and audio.
- Database: run SUPABASE_DELETE_ACCOUNT_V26_273.sql once.

## BenKen Stage Pro V26.272

- In the app (BenKenMainAudio.available), the Native engine is the default when this device never chose an engine. The Mac had no choice saved and used the Browser engine, which could not decode Ghost song (6 x 3.5 min MP3).
- Audio decode errors include the device reason and point to the Native engine.
- Needs native V27.62 for update checks while open (foreground + hourly).

## BenKen Stage Pro V26.271

- benken://app is not a secure context, so crypto.subtle (SHA-256), crypto.randomUUID and navigator.clipboard were missing and .benken / audio import failed in the app. Inline fallbacks (pure-JS SHA-256, UUID from getRandomValues, execCommand copy) are installed only when the functions are missing.

## BenKen Stage Pro V26.270

- Storage: shows "Updates come with new versions of the app" and hides Check for update now when the app is an App Store build (native V27.61 autoUpdate=false).
- Manual: Offline use & updates explains Xcode builds vs the App Store build.

## BenKen Stage Pro V26.269

- Top bar: status messages on one line with ellipsis; BenKen name never wraps; no message after restoring the library.

## BenKen Stage Pro V26.268

- window.BenKenPrepareMove: one-time move used by native V27.59 on the old GitHub address. Saves the library copy and copies every audio file a song uses into the permanent copy in the app, reporting progress to the startup screen.
- Storage: Remove old copy only after the move is done.

## BenKen Stage Pro V26.267

- Local web files in the app (needs native V27.58): app-files.json lists every file the app needs with size and SHA-256 (made by make_app_files.py from the sw.js asset list). The app downloads newer versions in the background, verifies them and uses them from the next start.
- Share links point to the GitHub address when BenKen runs from benken://app.
- Inside the app, audio restored from the permanent copy is not copied again into web storage.
- Storage page: BenKen web files version, Check for update now, Remove old copy at the GitHub address.
- Manual: Offline use & updates rewritten.

Publish routine from now on: run make_app_files.py and upload app-files.json together with the other files.

## BenKen Stage Pro V26.266

- New Settings → Audio → Storage page (needs native V27.57 for app folders and free space).
- Shows web storage, permanent audio copy, library copy, playback cache, saved native concert, temporary files and audio no song uses.
- Buttons: Remove prepared copies (saved native concert), Clear temporary files, Remove unused audio (web + app copy, respects weekly local backup), link to Clear cache.
- Manual section and Ask BenKen topic "Storage".

## BenKen Stage Pro V26.265

- Library safety copy in the app (needs native V27.56): after every save (2 s debounce) and on background, the web library (benken-ipad-v4) plus all other benken* storage keys are sent to the app (librarySave).
- On a start with empty web storage, the app copy is loaded (libraryLoad), written back and the page reloads once. Shows "Library restored from the app copy (N songs)."
- Never mirrors before the restore check on a fresh start; the app refuses to replace a copy with songs by an empty library.
- Step 1 of moving the web files into the app package.

## BenKen Stage Pro V26.264

- Manual and help pages reviewed end to end: current Settings menu names, Autosync section, new calendar, Apple Maps venue search, Song loudness setlist picker, click bus in mixer, single Settings/Done row.
- Old native version requirements replaced by the current app (V27.55); master compression documented for Browser and Native.
- manual.html regenerated from the in-app manual (57 sections) and repaired at the end of the file.
- Ask BenKen: updated destinations and new topics (Autosync, Create a song, MIDI commands, fonts, buttons, EQ, cache, packing export, original tempo).
- Calendar: month arrows visible in all skins; today marker readable.

## BenKen Stage Pro V26.263

- Calendar month view: events shown inside each date (chips on iPad/Mac, dots on phone, concert and rehearsal colours). Tap a date to see only that day's events; Close returns to the month.
- Venues: search placeholder is "Venue name and city".

## BenKen Stage Pro V26.262

- Calendar: the day grid is no longer folded into a dropdown, and the month arrows are compact buttons with visible chevrons.

## BenKen Stage Pro V26.261

- Venues: framed "Search Apple Maps" card at the top of Add / Edit venue. Results appear while typing (and on Enter / SEARCH); tap a match to fill the venue. Real Apple Maps error messages are shown under the field.

## BenKen Stage Pro V26.260

- Create a song: Settings button at the top left.
- Audio files / Mixer settings: the mixer's own heading is hidden again, so there is only one Settings and one Done. Settings goes back to the Settings menu (from Mixer settings home, or from a page opened straight from Settings).
- Song loudness: setlist picker in the dialog; Analyze setlist works without an open setlist.
- Venues: Search Apple Maps shows status, errors and "no matches" right under the button, with an Open Apple Maps fallback.

## BenKen Stage Pro V26.259

- MIDI & pedals: "Open MIDI settings" and "MIDI clock output" are normal menu rows again (V26.257 had filled them with the skin colour as one large block).

## BenKen Stage Pro V26.258 (Blue & White skin)

- Top bar is blue with white text and blue buttons (?, settings, setlist, controls).
- Section bar: blue buttons with white text; each section keeps its colour as a line underneath. Current section is lighter blue.
- Buttons in menus, mixer and editors are blue with white text and a white edge.

## BenKen Stage Pro V26.257

- All action buttons are filled with the skin colour: Send sign-in email, Cancel, Refresh, -/+, No song color, Reset to classic, Settings and Done look like Sign in and Save.
- Mixer: the CLICK strip has an output bus list like the tracks (saved per song, same setting as Tempo > Metronome output bus). Stop playback to change it.
- Also filled: Capo & key -/+ and Save, Songs & setlists buttons (Delete set in red), MIDI buttons, calendar month arrows, Save click settings.

## BenKen Stage Pro V26.256

- Buttons use the skin colour: Settings/Done, -/+, Save/Apply (filled) and Cancel (outlined) in Settings, the mixer and the song editor.
- Theme & colours: Song color is one line - colour, No song color button, Reset to classic button.
- Fonts & text: text, song title and section headings all use the same - value + control. The song title slider is removed.
- Scrolling & sync: Scroll speed is - value % + on one line.
- Settings and Done (Settings and mixer) line up with the cards below and stay inside the frame.
- Blue & White: darker blue menus for better contrast with white text.

## BenKen Stage Pro V26.255 — Autosync between iPad, iPhone and Mac

WHAT IS NEW
- Autosync: when you are signed in under Settings › Songs & setlists › Autosync & web editor, songs and setlists sync on their own.
  It syncs when the app opens, a few seconds after a change, when the network comes back and every five minutes.
  It never syncs during playback, audio preparation, Live lock or while an editor or dialog is open.
- More than lyrics: notes, chord chart, BPM, time signature, tags, capo (bandmate), song colour and chord voicings follow the song.
  Setlists keep their name, order and dividers. Audio files, mixer/playback settings and setlist covers stay on each device.
- Merging: changes to different parts of a song on two devices are both kept. If the same part changed on both, the song is listed
  at the top of Autosync & web editor to compare and choose.
- Deleting: a song or setlist deleted on one device is deleted on the others, with a recovery copy kept on the device.
  More than three deletions at once (and more than a quarter of the library) wait until you tap SYNC NOW.
- "Web song editor" is now called "Autosync & web editor". "Device sync" is now "Device sync (live)".

ONE-TIME SETUP IN SUPABASE (needed for setlists and song details)
- Open the Supabase project › SQL editor, paste SUPABASE_AUTOSYNC_V26_255.sql and run it once.
- Without it, autosync still syncs title, artist, key and lyrics, and the status line says the setup is missing.
- The web editor keeps working; it does not change notes, chord chart or setlists.

HOW TO START
- Sign in with the same email on each device (iPad, iPhone, Mac) and leave AUTOSYNC WITH MY OTHER DEVICES on.

## BenKen Stage Pro V26.254

- Blue & White: selected tabs and buttons have blue text on white (readable).
- Mixer: long track names show on one line and end with ….

## BenKen Stage Pro V26.253

- Apply, Save, Sign in, Send sign-in email and Refresh are real buttons (no arrow). Apply and Sign in are filled in the skin colour.
- Blue & White skin: menus (Settings, mixer pages and other menus) use the same blue as the setlist and library, white text, see-through cards, visible switches.

## BenKen Stage Pro V26.252

- Fields and lists have a frame you can see on every side, in every skin.
- Song color shows its colour squares again (no empty dropdown); Create a song has no lyrics preview.
- Import songs & projects: one icon and one arrow per row. Sync & sharing uses the same card as other pages.
- Web song editor: clear frames, no line between a field and its button.
- Setlist design: notes per song at normal height. Profile: Save profile at the top.
- Chord diagrams and Fonts & text: − value + in equal frames. Packing list: − count + in equal frames; Export and Save rows are back.
- Audio device: Apply and Refresh are buttons. Audio & files: track buttons as tall as the name field, text centred. Tracks: colour no longer overlaps Output bus; More track options centred.
- Available buttons: all tiles the same size, short names (Capo & key, Panic, Autoplay …).

## BenKen Stage Pro V26.251

- Available buttons and MIDI / Foot controller (and MIDI Clock) keep their original look; the new menu style is not applied there.

## BenKen Stage Pro V26.250

- Every menu row has an icon in the skin colour; action rows have an arrow on the right; delete/remove/reset rows are red.
- Lists without a name get one (Current set).
- Audio & files and other mixer pages use the same cards and rows.

## BenKen Stage Pro V26.249

- Choice buttons become one dropdown list (Chords layout, Reading view …); duplicate skin buttons hidden.
- All menu text white in dark skins, dark grey in light skins.
- Create a song, loose buttons and Theme & colours use the same cards and rows.
- Song, setlist and band names in capitals are never changed.

## BenKen Stage Pro V26.248

- Rows, buttons and list choices in the menus use normal sentence case like the Settings menu. USB, MIDI, BPM, PDF etc. stay in capitals; section headings stay in small capitals.

## BenKen Stage Pro V26.247

- Every page looks like the Settings menu: one card per section, rows divided by a thin line, no frame around rows, buttons as rows with accent text, one font and size. Fields keep a frame.

## BenKen Stage Pro V26.246

- One row height (56 px) for buttons, fields, lists, switches and expandable rows in every menu; buttons sharing a row have equal width.
- Beat alignment removed from the Tempo tab (saved values still apply).

## BenKen Stage Pro V26.245 (Native V27.55)

- Band / artist logo and name replace "BenKen Stage Pro" in the top bar when "Show band / artist name and logo in top bar" is on.
- One arrow style for every expandable row in every theme (Audio output and more options, More metronome settings, TEMPO / KEY in Practice). Audio buffer shows one arrow.
- Beat alignment stays inside its card; Count-in has a large list in its own frame; AUDIO DEVICE in Mixer Settings has a large frame.
- The routing / missing-audio note is no longer shown at the bottom of the Tempo tab.
- Stereo split removed from Audio & playback; routing is done in the mixer.
- Native V27.55: a sideways swipe near the bottom edge in landscape changes song instead of switching app.

## BenKen Stage Pro V26.244

Settings > Audio & playback: AUDIO DEVICE list with APPLY replaces PLAYBACK MODE buttons.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.243

Settings > Audio: AUDIO DEVICE list with APPLY replaces the USB / Stereo choice.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.242

AUDIO DEVICE list shown at the top of Mixer Settings and in Buses & outputs.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.241

Mixer Settings: AUDIO DEVICE list (connected mixer/audio interface or iPad speaker) with APPLY replaces the Practice / Live buttons. Output lists show only the device outputs, with names for SSL 12.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.240

A connected USB mixer/audio interface always plays in Live / USB with its own bus outputs; Practice / Stereo only without USB audio.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.239

Bus output lists show only the outputs of the connected audio device; stereo as pairs 1-2, 3-4.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.238

New audio interfaces get a starting routing at once (2 outputs: click 1 / music 2; more: music 1-2, click 3). Needs Native V27.50.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.237

Every USB mixer/audio interface plays in Live / USB with buses and its own outputs (2-output: click on 1, rest on 2). Practice / Stereo only without USB audio.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.236

Outputs per audio device: each mixer/audio interface keeps its own bus outputs; quick set-up for new devices. Native V27.49 adds a stereo click bus.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.235

STEREO SPLIT: on a 2-output interface (Scarlett 2i2), output 1 = click + chosen tracks, output 2 = the rest. Needs Native V27.48 (no native change).
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.234

GO TO NEXT SONG WHEN A SONG ENDS (WAIT FOR PLAY): the next setlist song is selected and prepared, but waits for PLAY. Needs Native V27.48.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.233

MIDI COMMAND OUTPUTS: MIDI commands in the lyrics can go to several MIDI outputs (looper, guitar board, Bluetooth), separate from MIDI Clock. Needs Native V27.48.
Native V27.47: a new song, Play after pause and the click join a MIDI Clock that is still running, on its next bar.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.232

RC-600 keeps playing until STOP (MIDI Clock no longer stops on song end/change). Needs Native V27.46.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.231

MIDI Clock looper offset (MIDI Clock > Looper offset) and click/clock start together. Needs Native V27.45.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.230

Automatic beat alignment from the click or drum stem (Mixer > Tempo > AUTO). Needs Native V27.44.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.229

Beat alignment per song (Mixer > Tempo): moves the music against click, MIDI Clock and START. Needs Native V27.44.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.228

Typed song BPM is saved also when the song has a playback speed; never re-detected. REAPER V6 update also moves a saved playback speed to the REAPER BPM.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.227

Play waits while audio is prepared and starts by itself; MIDI Clock follows the click tempo during playback.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.226

Connect the web editor with a code (needs SUPABASE_WEB_PAIRING_V26_226.sql and the benken-pair-claim Edge Function).
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.225

Web song editor: SYNC ALL, songs with the same title linked automatically, compare panel at the top, readable rows.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.224

Chord diagrams: only a short symbol key with SHOW INFO on.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.223

Info boxes (SHOW INFO) on Sync & sharing, Band & members, Audio & playback, Backup, MIDI, Scrolling, Capo & key and Chord diagrams (chord symbols).
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.222

Settings controls stay inside their cards on iPad (Fonts & text and other pages); full-width title size slider. SYMBOLS row (△ ø ° …) in the lyrics editor.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.221

Dmaj reads as Dmaj7 in chord diagrams (option under Chord diagrams); visible dots on the chosen voicing.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.220

Stay signed in (shared login), full backup as one zip file, barre in chord diagrams, new arrows, Sync & sharing in every skin, iPhone layout fixes.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.219

Correct standard guitar chord shapes for every key; chord diagrams visible in every skin.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.218

Large − / + buttons on all size fields in Settings; no empty cards in Lyrics & chords.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.217

Add songs to a setlist: songs already in the setlist are checked and marked.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.216

Edit setlist: reliable drag handles, new dividers at the top, text-only dividers.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.215

Setlists open inside the Library menu with cover, songs, dividers and slides. New Edit setlist with drag handles.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.214

Simpler settings with equal cards; Sync lyrics under Controls → Scrolling & sync. CLICK channel for the BenKen metronome in Mixer → Tracks.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.213

Each skin remembers its own colours; switching skins no longer carries colours from the previous skin.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.212

Blue & White skin. Section heading frame and heading font options. Settings: Appearance → Fonts & text, Mixer category, Controls → Scrolling & swiping.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.211

Library menu from the list button: Songs, Setlists and Tools (Tuner, Metronome, Control buttons).
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.210

New lyrics font System (San Francisco), now the default. Chords sit over their syllable with proportional letters.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.209

Band & members: clearer layout with tabs (Rehearsals & concerts, Members, Publish) and event tabs (Overview, Songs & setlist, Mixes, Packing list, Comments).
Shared setlists and songs open in your library, or are added to it as lyrics-only songs.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.208

Comments and rehearsal mixes for shared rehearsals and concerts in Band & planning.
Run SUPABASE_BAND_COMMENTS_MIXES_V26_208.sql once in the Supabase SQL Editor.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.207

Device volume and Playback mode first in Audio & playback. New PANIC control (Controls → Playback, also assignable to a MIDI pedal).
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.206

Show waveform back as a normal switch, last in Playback and lyric options.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.205

Show waveform moved under Controls > Playback and lyric options > More.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.204

No thin top-bar line under the section bar; framed NEXT at the left edge.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.203

Framed NEXT shows under the section bar when it covers the top bar.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.202

Ready and NEXT in the top bar instead of STANDALONE · OFFLINE READY (iPad/Mac). Fullscreen and phones unchanged.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.201

RECORD MIDI: arm, play and use your pedals; quantize to beat or bar and save the commands into the lyrics as {midi @mm:ss ...}. Needs Native V27.39+ for MIDI input/output (no new native build).
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.200

Neutral wording: mixer / audio interface and MIDI device instead of Ui24R and RC-600 (kept as examples and in Cues & Show).
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.199

PLAY notice shows STEREO / USB and AUDIO FILES separately. No audio or missing files: ADD AUDIO FILE or PLAY WITHOUT AUDIO (lyrics scroll), with Remember for this song (= LYRICS ONLY, left out of missing-audio lists).
Upload all files to kenhje/BenKenStagePro (main).

## BenKen Stage Pro V26.198

SYNC LYRICS back in Settings > Lyrics. REAPER songs follow every region with your own headings. refr/ref = chorus.
Upload all files to kenhje/BenKenStagePro (main).

## BenKen V26.197 — 17 November 2026

- Fix: MASTER COMP switch and knobs work with Native V27.41.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.196 — 17 November 2026

- MASTER COMP works with the Native engine (needs Native V27.41, folder BenKen_Stage_Pro_V27_41_Master_Compressor).
- Settings go to native with the mix; click-only outputs are not compressed.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.195 — 17 November 2026

- Tuner: input choice (Automatic / iPad microphone / Ui24R USB) and channel, faster display.
- Requires Native V27.40 (folder BenKen_Stage_Pro_V27_40_Tuner) for the new pitch detection and the Ui24R input.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.194 — 17 November 2026

- One arrow on Chords, sections & text colour in Edit lyrics.
- Buttons only (Controls → Control bar) shows just the buttons.
- MIDI commands guide always visible under MIDI & pedals.
- Web only.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.193 — 17 November 2026

- MIDI commands in lyrics ({midi …}), as in Stage Traxx: CC, PC, Note, Start, Stop, Continue.
- Sent to the MIDI Clock output (RC-600) at the start of their section, at song start, or at @mm:ss.
- Add with long press → MIDI COMMAND or + MIDI. LEARN, TEST and an i-button guide (incl. RC-600 ASSIGN).
- Requires Native V27.39 for sending (folder BenKen_Stage_Pro_V27_39_MIDI_Commands).
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.192 — 17 November 2026

- Automatic local backup runs even when audio files are missing; the missing files are listed in the restore point.
- Notice with FIND FILES / BACK UP ANYWAY / LATER, at most once a week for automatic backups (always for BACK UP NOW).
- Web only. No native change needed.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.191 — 17 November 2026

- Find duplicates moved from Library to Settings → Songs & setlists.
- Audio & playback: Play / stop protection and Continuous performance first, Audio cache after.
- Lyrics, chords & scrolling split into Edit, Reading view and Scrolling.
- New option: keep the top bar (Settings) visible with the section bar. Off by default.
- Song info display removed. Reading view removed from Available buttons (MIDI keeps it).
- Web only. No native change needed.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.190 — 17 November 2026

- Settings frames: one frame size and row style through Settings (Sync & sharing, Profile, Setlist view, Mixer cues, Web song editor, Song color).
- Audio files and mixer fold-out menus use the Settings row style with the copper arrow.
- Track EQ, Mixer display and Seek step rows tidied. No frame around the bottom control bar buttons.
- Web only. No native change needed.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.189 — 17 November 2026

- Audio Status includes song tempo, REAPER tempo changes and metronome settings (benkenWeb), plus click timing from Native V27.38 (clickSync).
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.188 — 17 November 2026

- Click first: metronome + MIDI Clock start together; PLAY starts the song on the next bar of the running click. Requires Native V27.37.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.187 — 17 November 2026

- Clear message when the iPad sends audio to another USB device (for example BOSS RC-600) instead of the Ui24R.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.186 — 17 November 2026

- REAPER regions decide: every region is shown with REAPER names, colours and times; lyric headings link to regions by name or type.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.185 — 17 November 2026

- Dark: Setlist uses the Library gap; one line under each settings row; full-height, smooth section playhead.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.184 — 17 November 2026

- Dark: section bar cells get a thin frame in their region colour; the current section stays copper.
- Library rows use the Setlist row as the template.
- The setlist picker matches + ADD SONGS.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.183 — 17 November 2026

- Dark: settings use the same cards and divider lines as Controls; Library songs spaced like the Setlist without lines.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.182 — 17 November 2026

- Dark: control bar toggle button visible again when the bar is shown; Position row matches the switch rows; white settings icon; settings menus share one background with frames only.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.181 — 17 November 2026

- Dark skin: one button style. White text when not selected, copper when selected, copper outline while pressed.
- Library songs look like Setlist songs. Drop-downs and fields share one height and frame.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.180 — 17 November 2026

- Dark skin: refined copper look. Same layout; new colours, one button shape, larger button text, solid control bar, PLAY as main button.
- Unknown saved skin falls back to Dark.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.179 — 17 November 2026

- Tempo page: Song tempo and Metronome side by side, count-in under; transpose in Capo & Key.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.172 — REAPER V6, tempo & time signature — 16 November 2026

- REAPER updates keep existing lyric text and headings; regions link by saved link, name, then section type in order.
- REAPER Export V6 support: automatic song end, BPM/time signature/tempo map, Audio NO (regions + tempo only, audio kept).
- Detect tempo works with the native engine; optional automatic BPM; manual Original BPM saves directly.
Physical iPad/REAPER verification pending. Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.171 — Lyric notes & Lyrics only — 16 November 2026

- Notes in lyrics: {note COLOR: text} lines (yellow, red, blue, green, purple). Press and hold a lyric line or use + NOTE to add; tap a note to edit/delete. Notes scroll with the lyrics and are saved with the song.
- EDIT LYRICS and + NOTE control-bar buttons (added once to existing control bars).
- LYRICS ONLY: per-song switch that turns audio off without removing tracks, routing or files. PLAY starts autoscroll.
Native V27.33 recommended for the permanent audio library. Physical device verification pending.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.170 — Audio safety — 16 November 2026

Requires Native V27.33 for the permanent audio library, automatic USB reconnection and MIDI device matching.

- Permanent audio library: every audio file is mirrored into the app's own storage and restored automatically if the web storage is emptied.
- RELINK MISSING AUDIO: choose several files; matched by original file name. Mixer, routing and song info kept.
- USB reconnection: outputs are read again automatically when the Ui24R appears late or drops out via the hub. Never auto-plays.
- Persistent web storage requested.

Deploy all files in this folder together (index.html, versioned assets, sw.js, demo files).
Physical device verification pending. Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.168 — Getting started — 11 November 2026

Demo for empty new libraries; three-start home tour with permanent opt-out.
Optional import and web-editor help. Compact lyric import review.
Physical device and TestFlight checks remain. No new native version required.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.167 — Settings colours — 10 November 2026

Submenus match their main category background. Vertical accent line removed.
Indentation and single-category opening retained. No new native update required.
Physical iPad/iPhone verification pending. Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.166 — Clearer Settings — 10 November 2026

Inset submenus. One main category open at a time, including search.
No new native update required. Physical iPad/iPhone verification pending.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.165 — Mixer space — 10 November 2026

Compact mixer heading; faders and meters use available workspace height.
No native update required. Physical iPad/iPhone verification pending.
Copyright BenKen / Kenneth Hjelle 2026.

## BenKen V26.164 — Theme buttons — 10 November 2026

Ask BenKen and show/hide control bar follow the selected skin accent.
No native update required. Native V27.31 for cache; V27.32 for logo startup.
Browser verification completed; physical iPad/iPhone verification pending.
Copyright Kenneth Hjelle / BenKen 2026.

## BenKen V26.163 — Updated skins — 10 November 2026

Dark accent: logo copper #e5ad83.
Pacific & Coral: #5b84b1 and #fc766a.
Violet & Dahlia: #5f4b8b and #e69a8d.
Select under Settings > Appearance > Theme & colours > App skin.
Existing forest/violet skin IDs remain compatible. Only exact legacy appearance defaults are migrated; custom values and user reading colours remain unchanged.
No new native update required. Native V27.31 for automatic cache, V27.32 for logo startup.
Browser verification completed; physical iPad/iPhone verification pending.
Made for BenKen. Copyright Kenneth Hjelle 2026.
Color palettes has been removed from Settings. App skins and individual colour controls remain available.

## BenKen V26.162 — Web song editor — 10 November 2026

Native: V27.31 for automatic cache, V27.32 for logo startup; no new native required.
App: Settings > Songs & setlists > Web song editor. Use the same email as the website editor. Check for changes, select a song and review both versions before sending or receiving. Audio, routing, timing and separate chord charts remain local. Web changes to section names may require checking playback section timing afterwards.
Website: editor.html. Local drafts and ChordPro export work without an account. Online library requires SUPABASE_WEB_EDITOR_SETUP.sql and email sign-in enabled in the existing Supabase project. Never use the anonymous live-following table for private song texts.
The SQL script grants authenticated users access only to their own text library. Review before applying. Saves use atomic revision checks to prevent silently overwriting simultaneous edits. No service key belongs in the browser.
Local recovery copies of the last 30 text replacements are stored under benken-web-text-recovery-v1. Keep regular complete backups as well.
Cloud schema activated and live database checks passed for own-user read/save, revision conflicts, other-user isolation, anonymous denial and direct-write denial (test rows rolled back). Email delivery/sign-in and physical iPad use still require verification.

## BenKen V26.161 — 10 November 2026

Lyrics / ChordPro > Import mode > Keep chords, add lyrics. Uses incoming lyrics without their bracketed chords. Existing inline chords are placed on safely matching words; unmatched or repeated chord lines and plain chord-only rows remain in CHORDS TO PLACE after the lyrics. Move them into position in Edit lyrics after import. Existing audio, routing, settings and separate chord charts are preserved. Preview before saving; a text backup downloads first. Physical iPad verification pending.

After import: open Lyrics, chords & scrolling > Edit lyrics. Find CHORDS TO PLACE at the end. Move each [chord] before the word where it should sound. Remove its old entry after moving it, then save. For a plain chord row, add brackets around each chord when placing it above a word.

Placement example: To come [Cm]home places Cm above home. Keep the original chord spelling when moving it.

## BenKen V26.160 — 10 November 2026

Lyrics / ChordPro defaults to Keep lyrics, add chords for existing songs. Original text, headings, whitespace and existing chords remain unchanged. Only uniquely matching lyric lines receive bracketed imported chords. Repeated or different lines and conflicting chords are skipped and shown for review. Review the result; explicitly acknowledge skipped lines before importing safe matches. Plain chord-only rows are not guessed. Replace lyrics is a separate mode. Audio, settings and existing charts are preserved. Physical iPad verification pending.

## BenKen V26.159 — 10 November 2026

Settings > Songs & Setlists > Import songs & projects > Lyrics / ChordPro. Select multiple ChordPro/text files or one BenKen lyrics collection (.json, .txt or .benkenlyrics). Extract ChordPro ZIP archives in Files first. The existing attached file input is used without a file-extension filter.
Review every title match. Unmatched titles stay skipped until you select an existing song or Create new song. Only lyrics are updated on existing songs. No changes happen until Import selected lyrics is pressed.
A text backup is downloaded before replacing existing lyrics. Errors/status are shown in the import page. Physical iPad verification pending. No native update required.

## BenKen V26.158 — 10 November 2026

Full backup: when audio is missing, choose CONTINUE WITH AVAILABLE FILES. All songs, lyrics, setlists and settings remain in the backup, together with available audio. Missing files are recorded; reconnect them after restore. Partial backups require V26.158 or newer. Save every part. Complete backups retain the existing format.
Settings frames and checkbox rows have consistent inner spacing and responsive wrapping.
No new native update. Physical device verification pending.
Centered Chords & Lyrics reserves space for adjacent chords such as Cm and Eb/D. Chart generation does not change the original lyrics.

## BenKen Web V26.157 — 10 November 2026

Import lyrics collections under Songs & Setlists > Import songs & projects > Import lyrics collection. Supports .benkenlyrics (BenKen lyrics JSON) and multiple ChordPro/text files. Review all targets before applying. Matching ignores case, punctuation and extra spaces; ambiguous matches need a manual selection. Updates only lyrics for existing songs. Audio, routing, setlists and existing charts/timing are preserved; review timing after changing text. A text backup downloads before updates. Help & Info matches the other category rows. No new native update required. Physical device verification pending.

## BenKen Web V26.156 — 10 November 2026

Settings: Songs & Setlists; Audio; Lyrics & Chords; Appearance; Controls; Planning; Help & Info. Practice stays under Audio. Sync & sharing and Backup & restore have one home under Songs & Setlists. PDF designs and document profile also live there. Help opens directly. Device volume is in Audio & playback. Search remains available.

No new native update required. Physical iPad/iPhone verification remains pending.

QUICK MENU GUIDE
Songs & Setlists: Create, Import, Songs & setlists, Sync & sharing, Backup & restore, PDF designs and document profile.
Audio: files, playback/device volume/cache, mixer, loudness, tempo/metronome, Practice, tuner and mixer cues.
Lyrics & Chords: lyric/chart editing and layout, diagrams, capo/key.
Appearance: theme/colours and song info display.
Controls: buttons/fullscreen, MIDI/pedals and external display.
Planning: band, calendar, venues and packing.
Help & Info: full help page, tour, manual, Ask BenKen, updates, About and diagnostics.

## BenKen Web V26.155 — 10 November 2026

Edit chord chart automatically suggests a chart if none is saved. GENERATE FROM LYRICS regenerates the draft from chords and section names already in the lyrics. Existing saved charts are preserved until Generate and Save are chosen. RESTORE PREVIOUS DRAFT reverses generation. Save/Cancel retain their normal behaviour.

Known tempo and exact synced regions determine the number of suggested bars; chord-change placement is estimated from the order of chord lines. Without timing, one bar per chord is suggested. Existing | bars are preserved. Listen and correct the draft before saving. Generated chords do not change the audio.

Demo: Settings → Lyrics & scrolling → ADD CHORD CHART DEMO. In the editor, GENERATE FROM LYRICS rebuilds the demo chart. PLAY, EDIT CURRENT BAR and PLAY SELECTED BAR help check it.

Native: 27.31 for automatic cache, 27.32 for logo startup. No new native update required. English About history preserved. Browser checks completed; physical iPad/iPhone verification pending.

Lyrics & scrolling starts with Edit song, Edit lyrics, Edit chord chart and Sync lyrics, above display settings.

## BenKen Web V26.154 — 10 November 2026

Edit chord chart: choose LISTEN & EDIT to hear the saved song and watch the current draft move. PLAY/PAUSE, STOP, five-second skips and the timeline use the existing audio player. EDIT CURRENT BAR selects its written chords. PLAY SELECTED BAR seeks to that bar when exact region/tempo timing is known. Save keeps chart changes; Cancel discards them. Playback started in the editor pauses on close. Save a new song with audio before listening in this editor.

Bar highlighting requires exact synced sections or enabled REAPER regions, known tempo and explicit | bars in played order. Estimated timing and automatic repeat expansion are not used. No new native update required (27.31 cache; 27.32 logo startup). English About history and feature list retained. Physical iPad/iPhone/audio verification remains pending.

DEMO: Settings → Lyrics & scrolling → ADD CHORD CHART DEMO adds a separate 38.4-second original instrumental, 100 BPM, 4/4, 16 bars and four synced regions. Opens Listen & edit. The included BenKen_Chord_Chart_Demo.benken can also be imported as a project. Recorded audio stays the same when chart chords are edited.

TRY IT: Press PLAY in the demo editor, wait for the highlighted bar to move, then EDIT CURRENT BAR to select its written chord. Change Bm to B7 to see the draft preview update. PLAY SELECTED BAR returns to its exact synced position. CANCEL keeps the original chart; SAVE keeps your changes.

## BenKen Web V26.153 — 10 November 2026

Settings icons follow the theme. Title size supports 18–192px with title buttons in Lyrics & scrolling, also visible in fullscreen. A−/A+ scales chord sheets, with adaptive column counts. Lyric headings have coloured frames.

Chord playback highlighting uses exact synced sections or enabled REAPER regions, known BPM and metronome beats per bar. Enabled REAPER tempo-map changes are integrated across each region. Match chart section names; add explicit | bars in played order. Estimated boundaries and automatic repeat expansion are not used. Existing autoscroll can follow the current bar. Physical device/audio verification remains pending. No native update required. English About history retained.

Quick setup
1. Settings → Display & controls → Lyrics & scrolling: choose Song title size (18–192px) or use A− TITLE / A+ TITLE. The title is also shown in fullscreen.
2. A− / A+ in the control bar changes both lyrics and chord sheets.
3. In Edit chord chart, use matching section names and explicit | bars in played order. Repeat signs are visual notation; expand repeats into played order yourself for tracking.
4. Use exact Sync lyrics starts or enable imported REAPER regions. Set the song BPM and beats per bar under Tempo & metronome.
5. Follow synced bars is on by default. Enable Scroll for the reading view to follow the active bar. No estimated boundaries are used. Without explicit bars or known BPM, an exact section may be marked without a bar.

Validation: real Browser WAV import/play/pause/seek/stop/autoscroll, exact manual/REAPER regions and gaps, imported tempo-map changes and playback ratio, title persistence/fullscreen, chart scaling/long chords, theme colours and Settings/native-volume visibility checks passed. Physical iPad/audio hardware confirmation pending.

## BenKen Web V26.152 — 10 November 2026

Remove the inherited 40dvh Wrap buttons limit only inside vertical side controls. The side list uses the outer rail height and can grow upwards. Long lists retain outer scrolling; bottom wrap behavior is unchanged. Browser tests reproduce V26.151 clipping and verify both sides and phone/tablet layouts. Physical iPad confirmation pending. No new native installation required. English About history preserved.

## BenKen Web V26.151 — 10 November 2026

Settings categories are expandable dropdowns with one open category at a time. Returning from a settings page remembers the open category for this session. Search opens matching categories; clearing restores the previous category. Device volume/buffer has its own category, and the native volume overlay follows open/closed visibility.

Includes top-right Settings and iPad bottom-anchor fixes. No native update required. Browser interaction and layout checks completed; physical iPad verification remains pending. English About history, features and copyright preserved.

## BenKen Web V26.150 — 10 November 2026

Settings is now at the far top-right; Ask BenKen stays left beside the status. Includes V26.149 bottom-anchored iPad side controls. Header responsive layout and actual last-button alignment verified in browser. Physical iPad confirmation pending. No new native installation required. English About history, features and copyright preserved.

## BenKen Web V26.149 — 10 November 2026

Side controls use the same CSS bottom anchor as the corner dock. The actual rendered list grows upwards, with a 4px gap above the corner button. Long lists still scroll with 44px minimum touch targets. Browser alignment and phone regression checks completed; physical iPad confirmation pending. No new native update required. Native V27.31 remains sufficient for caching; V27.32 adds logo startup. English About history retained.

## BenKen Web V26.148 — 10 November 2026

Release notes for the clean branded launch in Native V27.32. The web app continues to support Native V27.31; install Native V27.32 to change the native opening screen. English About history preserved. Physical launch verification pending.

## BenKen Web V26.147 — 10 November 2026

Side control bars now anchor directly above the bottom corner button and grow upwards as actions are added. Both left and right placements retain header/section clearance. Buttons stay at least 44px high; long lists scroll when needed. Reading gutters still follow the opened side controls.

Native V27.31 unchanged. Browser geometry and interaction checks completed; physical iPhone/iPad touch and safe-area verification pending. Earlier English release notes, features and copyright preserved.

## BenKen Web V26.146 — 10 November 2026

Settings is first in the top header, before Ask BenKen. Only Setlist (left) and show/hide Controls (right) remain at the bottom. Fixed tuner, capo, metronome, mixer and controls-settings shortcuts have been removed from the reading surface; those tools remain available through Settings and selectable control-bar actions.

Lyrics, titles and chord sheets use the available reading width with safe-area margins. Fixed corner buttons do not reserve a full-height side gutter. Opened side control bars still reserve their actual width. Setlist panels retain their own space when open.

No new native update; V27.31 remains current. Browser checks completed; physical iPhone/iPad touch and safe-area verification remains pending.

## BenKen Web V26.145 — 9 November 2026

Controls Reading view contains only Lyrics, Both and Chords. Chord layout and preferred bars per row are in Settings > Lyrics & scrolling, alongside Edit chord chart.

Chords defaults to the compact BenKen chord sheet when no explicit older Lyric positions preference exists. A separate saved chart is used first; otherwise existing song chords/sections appear immediately without opening or saving an editor. This fallback does not write or replace a saved chart. Bar timing cannot be derived from lyric positions, so copied sequences remain unmetered until you insert |.

Chart editor: chord buttons from the song/current chart, new chord input, section/bar/repeat shortcuts, Write/Preview tabs. Saved bar grouping and key/capo behaviour are retained.

Native V27.31 unchanged. Browser checks completed. Physical iPhone/iPad touch/keyboard verification remains pending. Independent chart timing and chart-specific PDF export are not included.

## BenKen Web V26.144 — 8 November 2026

Edit chord chart starts with existing chords and section headings when no separate chart exists. Saved charts are preserved. Create/Edit song uses the current unsaved lyrics preview; saved songs use their original text. Source chord order and lyric-line grouping are kept, without lyric words or invented bar lengths. Explicit chord-only bars are retained. Add | to define bars, or save the copied sequence without bars. Opening and Cancel do not save anything. Save commits the chart, or returns it to the song draft until Save song.

Charts without bar lines support key/capo display, permanent rewrite/restore and backup like bar-based charts.
Native V27.31 unchanged. Browser checks completed; physical iPhone/iPad confirmation pending.

## BenKen Web V26.143 — 8 November 2026

Controls offers Lyrics, Both and Chords. Choose Lyric positions or Chord chart for Chords. Add individual reading-mode buttons in Controls if wanted; the existing cycle button remains.

Each song can hold a separate chordChart. Use EDIT CHORD CHART in Create/Edit song, Lyrics settings, Controls, or the empty chart view. Write section headings and bars such as | G | D/F# | Em7 Cadd9 | % |. Several chords in one bar remain together. % repeats a bar; N.C. means no chord. Bar placement is explicit, never guessed from lyrics. Charts transpose with song key/capo and are included in BenKen project/library backups. Preferred 2/4/8 bars per row adapts to narrow screens.

No new native update. V27.31 remains current. Browser verification completed; physical iPhone/iPad keyboard and touch confirmation pending. Independent chart section timing and chart-specific PDF export are not included.

Song title size is independently adjustable from 18 to 128px under Settings > Lyrics & scrolling using the numeric field or slider. Existing sizes are preserved.

## BenKen Web V26.142 — 8 November 2026

Removed the extra bottom margin on the Create a song import-menu button. Its card now ends at the row edge, matching other import choices. The space between groups remains outside the card.

No native update. V27.31 remains current. Browser row/card geometry checked with Show info off/on; physical device confirmation pending.

## BenKen Web V26.141 — 8 November 2026

Create a song and Edit song use Settings panel geometry instead of a small centred modal. Content scrolls inside the panel with reachable actions. Cancel and Close return to Settings, preserving the originating Settings category when applicable. SONG DETAILS is an uppercase heading with always-visible fields and no disclosure arrow. The shared full-screen lyrics editor remains unchanged.

Native V27.31 remains current; no new native update. Browser layout/navigation/shared-editor checks passed. Physical iPhone/iPad keyboard verification remains pending.

## BenKen Web V26.140 — 8 November 2026

Create a song and Edit song use the existing fullscreen Edit lyrics editor. Open Edit lyrics in the song form; chord/section/text-colour tools live inside that editor. The main form shows a read-only preview. Save in the lyrics editor updates only the song draft; Save song commits metadata, lyrics, colour and selected audio. Cancel lyrics keeps the previous draft; Cancel song leaves the saved library unchanged.

Create and Edit song share an explicitly sized colour picker and visible 44px preset swatches with selected state. Custom colour and No color are retained.

No native change; V27.31 remains current. Browser checks completed; physical keyboard/colour-picker verification remains required.

## BenKen Web V26.139 — 8 November 2026

Create a song is first under Import audio & lyrics. Add a title, paste/import lyrics, select audio and save in one editor. Optional song details and chord shortcuts are grouped below. Audio files and Lyrics / ChordPro stay separate; Import project has its own entry. REAPER import/update remains available.

Pending audio is imported on Save. Cancel makes no audio copies. A failed audio import keeps the saved song and queued files in the editor so Retry updates the same song.

No native change; V27.31 remains current. Browser creation/import/retry and responsive checks completed; physical device verification remains required.

## BenKen Web V26.138 — 8 November 2026

Only Preparing / Ready above NEXT in the reading view. Subtitle details and progress beneath the title are hidden. Mixer progress and diagnostics remain available; song data is preserved.
The section overview shows exact region labels without the automatically added approximation sign. Timing estimate metadata remains available in tooltips and accessibility descriptions.
No native change; V27.31 remains current. Browser checks completed; physical device verification remains required.

## BenKen Web V26.137 — 8 November 2026

Removed phone lyric clipping. Lyrics continue down the page with left/right space based on visible corner shortcuts and side controls. Hidden controls release the space. The wide title and screen-edge Ready/NEXT are preserved. Only a bottom control bar contributes to the automatic-scroll footer; a tall side rail no longer stops the song vertically.

No native change; V27.31 remains current. Responsive browser checks completed; physical iPhone/iPad verification remains required.

## BenKen Web V26.136 — 8 November 2026

Preparing / Ready and NEXT align to the safe left edge above the song/list area, independently of list visibility. iPhone title and lyrics use 10px balanced edge margins rather than permanent control-rail gutters. Existing bottom scrolling space is kept. Native V27.31 remains current; no new native update required.

Browser responsive, centring and end-of-song scrolling checks completed. Physical iPad/iPhone verification remains required.

Phone reading is clipped above the highest visible lower control. Automatic scrolling uses the same boundary; the document retains its full scrollable height. The last line can scroll clear of all controls.

## BenKen Web V26.135 — 8 November 2026

Preparing / Ready appears above NEXT for the selected song. Existing detailed progress is retained. Lyrics-only or failed songs do not display Ready. Automatic preparation of other songs does not change the selected-song status.

No new native release; automatic cache still requires Native V27.31.
Browser validation covers loading, ready, failure and tablet/phone layout. Physical device verification remains required.

## BenKen Stage Pro — Web V26.134 / Native V27.31

8 November 2026

All songs prepare automatically while the app is open, visible and idle for 15 seconds, with playback stopped. Interaction cancels background work; playback has priority. Requires Native V27.31 with the Native engine.

Settings → Audio & playback → Clear cache removes disposable playback copies, preserving imported originals, songs, setlists, settings and saved concert libraries. The current song reloads immediately; other copies rebuild while idle.

Removed Check offline availability and Prepare concert buttons. Restored the iPad song panel left edge while retaining centred closed-list lyrics.

Older native versions retain normal playback. Install Native V27.31 over the existing app using Xcode with the same bundle identifier; do not delete the installed app. The web update alone cannot add native cache commands.

Validation: 53 Swift tests completed, 2 skipped, 0 failures. Unsigned iOS Simulator and Mac Catalyst builds pass. All-song scheduler, source-preserving Clear cache and responsive browser checks completed. Physical iPad/iPhone speed, device storage and USB-interface verification remain required. Playback is not gapless.

## BenKen Stage Pro — Web V26.133 · 7 November 2026

The home help shortcut is a 44 px question-mark button, immediately before STANDALONE · OFFLINE READY on the same row. Its accessible name and tooltip remain Ask BenKen.
Native V27.30 for Prepare concert; other features remain compatible with V27.29. No native rebuild is required for this layout update.
Phone/tablet browser layout checks; physical verification remains required.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.132 · 7 November 2026

Use Native V27.30 for faster song loading and Prepare concert. Older native versions retain their existing playback path.

1. Update the native app over the existing installation; do not delete it.
2. Open a setlist and choose PREPARE CONCERT.
3. With playback stopped, press PREPARE SETLIST and wait until all songs are ready.
4. Play the set. Verified originals and prepared tempo/key versions are reused on this device.

First preparation can take time and uses storage. Changed audio, tempo, key or track format needs preparation again. Cached originals are verified and only missing/changed files are copied. No internet upload is involved. This does not promise gapless transitions; test your full set and audio interface.

Includes the Ask BenKen home button, Getting started guide and guitar chord alias corrections from V26.131.
Validation: 51 native tests (2 skipped), no failures; iPhone/iPad and Mac builds; 30-song/180-track browser workflow; zero-chunk reuse and older-native fallback. Physical device and transition-time verification remains required.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.131 · 7 November 2026

Ask BenKen is available at the top left of the home screen. New installations get a welcome and a short tour of the visible buttons. Next, Back, Skip and Done are available. The tour can be replayed from Settings → About & help → Getting started. Existing libraries are not interrupted by an automatic tour.

Guitar chord aliases (including Dmaj) now reuse the verified standard grips. Unslashed chords use root bass; slash chords retain their requested bass. Every generated grip is checked against the chord tones.

Native V27.29 unchanged. No Xcode rebuild required. Upload the complete web package.
Physical iPhone and iPad verification remains required.

Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.130 · 7 November 2026

Centres every displayed lyric line, including wrapped continuation lines on iPhone. Centred lyrics ignore leading indentation. In centred Lyrics & chords mode, chord labels remain anchored to words when the line wraps. Left-aligned chord columns retain their existing layout.

Native V27.29 unchanged. No Xcode rebuild required. Upload the complete web package.
Physical iPhone and iPad verification remains required.

Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.129 · 7 November 2026

Fixes the one-sided reading-area gutter that shifted centred titles and lyrics to the left on iPhone. Matching left and right space now accommodates corner shortcuts and either side Controls. Fullscreen uses matching safe-area margins, with no horizontal shift when temporary controls appear.

Native V27.29 unchanged. No Xcode rebuild is required. Upload the complete web package.
Browser layout checks are documented in Verification. Physical iPhone verification remains required.

Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.128 · 7 November 2026

Side Controls remain in the same column directly above corner shortcuts. Reduced gaps and adaptive button height (minimum 44px) fit more buttons; long lists scroll. Includes clean fullscreen and Set time only in Setlist. Native V27.29 unchanged; no Xcode rebuild. Browser checks completed; physical device verification remains.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.127 · 7 November 2026

Clean fullscreen: section bar, lyrics and chords only. Controls and corner shortcuts hide regardless of older fullscreen settings. Tap lyrics for temporary access; normal controls layout is retained on exit. Native V27.29 unchanged; no Xcode rebuild. Browser checks completed; physical device verification remains.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.126 · 7 November 2026

Deleted lyric headings are removed from the section bar, including REAPER-linked headings. Remaining boundaries follow matched headings; renamed headings retain position, additions are marked estimated. No audio files or REAPER source regions are deleted.
Single-line region names grow wider. Output buses use the named, compact track style without duplicate name fields. Bus routing, Bus settings and Edit mute groups have text without gear icons.
Native V27.29 unchanged; no Xcode rebuild. Web checks completed; physical device verification remains.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.125 · 7 November 2026

Retain and recover the saved audio section bar independently of lyric edits, including deleted or reordered headings. No lyric rewriting and no guessed timing. Sync lyrics remains available for deliberate arrangement changes. Recovery requires valid existing saved timing.
Native V27.29 unchanged; no Xcode rebuild. Web checks completed; physical device verification remains.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026
New songs: estimated starts from lyric length / duration, marked ≈ and Estimated; Sync lyrics opens estimates for explicit adjustment and saving. Plain Verse/Chorus headings recognised. Renaming Last chorus to an existing Chorus preserves position/time.

## BenKen Stage Pro — Web V26.124 · 7 November 2026

Full-screen lyrics editing, keyboard viewport sizing, top Save/Cancel and collapsible tools.
Section heading renames retain timing when order/count is unchanged, including recovery for previous renames. Reordered/added/removed headings still require checking sync.
Native V27.29 unchanged; no Xcode rebuild. Browser checks completed; physical keyboard/device verification remains.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.123 · 7 November 2026

Show My capo and Show Bandmate capo are visible directly underneath their respective capo controls. Removed the Capo display disclosure. Existing saved settings, custom player names, capo positions and chord/audio behaviour are retained.
Includes the section boundary lines and outer edges from V26.122, with the smooth local-clock position marker.
Native V27.29 unchanged; no new Xcode build required.
Web checks and browser verification completed. Physical iPad/iPhone touch and display verification remain required.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.122 · 7 November 2026

Added thin vertical boundaries between regions so their starts and ends are clear, including the outer edges of the whole arrangement. All regions remain visible and tappable in Practice. Quiet skin backgrounds, region-coloured text and upper/lower lines, and the smooth position marker are retained.
Native V27.29 unchanged; no new Xcode build required.
Web checks/browser preview completed; physical iPad/iPhone display and touch verification remain required.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.121 · 7 November 2026

Softer section overview: skin-matched backgrounds, region-coloured text and thin region-coloured top/bottom lines. The moving position marker and complete tappable arrangement remain. The marker uses requestAnimationFrame and compositor transforms against the local playback clock; no additional Native audio requests.
Practice and Tap sections to play must be enabled for region playback. Count-in and existing protection remain.
Native V27.29 unchanged. No new Xcode build needed.
Web checks and browser preview completed. Physical iPad/iPhone touch/display/audio verification remains required.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.120 · 7 November 2026

Show sections keeps every region visible, wraps on small screens, uses imported region colours with palette fallbacks, and displays a moving line inside the current region.
Practice + Tap sections to play allow jumping to any region at any point in the song. Existing count-in, readiness and seek protection remain in effect.
Native V27.29 unchanged. No new Xcode build needed for V27.29 users.
Web checks and browser verification; physical iPad/iPhone touch, sound and count-in verification remain required.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.119 · 6 November 2026

Removed X and the duplicate Track name input from mixer channels. Delete files in Mixer settings → Audio & Files; rename in Mixer settings → Tracks.
Reduced the name-to-Pan spacing, removed empty channel rows and restored full coloured top/bottom borders. Track, Song and Master faders remain aligned. Fader height adapts to the space above docked Controls; very small screens retain scrolling.
Native V27.29 is unchanged. No new Xcode build is needed when V27.29 is installed.
Verification: web regression checks and local browser layout checks. Physical iPad/iPhone portrait touch/audio tests remain required.
Publish all current web files together and wait for GitHub Pages before reloading BenKen. Keep a full backup with audio before device testing.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.118 · 6 November 2026

Tracks show their saved name in a large bold header instead of Track 01/02. Mute group buttons, summaries and assignments are removed from Tracks; existing assignments remain and can be managed under Mute groups.
Waveform off hides its whole strip, heading buttons, Sync Lyrics and time labels. Re-enable Show waveform from Controls settings. Section bar remains independent. Sync Lyrics is available under Lyrics & scrolling.
Both the Controls Metronome action and the optional left shortcut toggle the click directly. Settings still hold tempo, output bus, sound and level. Native requires V27.29 for this function. Select and prepare a song first. The click can run without starting backing tracks, and can be stopped without stopping active backing tracks.
Profile & document details can show the saved band/artist name and local logo in the top bar. Save profile after changing the option.

Validation: web syntax/assets/regression tests, browser track-name edit, waveform-hidden state, profile position and metronome shortcut on/off. Native: 47 tests, 2 skipped, no failures. iOS and Mac Catalyst builds completed without signing. Existing Apple SDK/deprecation warnings remain. Actual hardware/background/USB audio and touch verification are still required.

For Native metronome on/off, build BenKen_Stage_Pro_V27_29_Native_Metronome/App/BenKenStagePro.xcodeproj over the installed app. Same bundle ID/storage. Do not uninstall BenKen. Keep a full backup with audio before device testing.
Older Native V27.28 retains existing playback, EQ, waveform and meter support; direct metronome buttons show an upgrade message.
Publish all current web files together, wait for GitHub Pages to finish, then reload BenKen. Native V27.29 is a separate Xcode update.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.117

6 November 2026 · Native V27.28 remains current; no Xcode rebuild required for this web update.

Menus share skin colors, card spacing, fields, switches and Settings/Done navigation.
MIDI & pedals now uses the categorized Controls action picker, including the same 46 actions. Existing MIDI mappings remain available.
Waveform off hides the complete seek strip. Sync Lyrics remains available in Lyrics & scrolling.
Lyrics & scrolling includes independent section heading size and weight. Chord diagrams includes Extra small.
Capo & Key has a checkbox to transpose backing tracks with song key; existing playback limits still apply.
Packing list names and responsibility can be edited; press Save list. CSV/PDF exports include responsibility. Shared band lists allow administrators to edit item names, quantities and responsible members without resetting packed/home checks.
Venue search preserves your entered name and fills address details from a selected native Apple Maps result. Web provides an Apple Maps link; automatic address fill requires the installed app.
Setlist time and progress appear within the setlist panel when enabled.
Profile & document details can show the band/artist name and local logo on the home screen.
Song PDF design exports the current song or all songs in a selected setlist. Setlist design includes saved notes per song, retained when reordered.

The packing edit database function has been installed in the existing Supabase project. It retains the administrator restriction and validates assigned band membership.

Verification: package syntax/assets, preserved release history, native meter compatibility, multi-song PDF page separation, reordered setlist notes, venue-name preservation and CSV responsibility checked. Browser menu, field, profile, packing save and PDF-ready checks completed.
Still awaiting physical verification: Apple Maps on iPad/iPhone, MIDI hardware learn/trigger, native audio and touch behavior, and shared packing changes with multiple signed-in band members. Browser viewport override did not take effect; mobile layout needs a device check.

Publish all current v26-117 JS/CSS files, index.html, sw.js, manual.html and the manifest. Keep existing shared images, QR library and logo assets. Wait for GitHub Pages success before reloading BenKen. Do not delete the installed app or its library.
Made for BenKen™ · Copyright © Kenneth Hjelle 2026

## BenKen Web V26.116 · Native meter display fix

6 November 2026

Keep Native V27.28. No new Xcode build is required.
Upload this complete web package. Existing songs and settings are preserved.

The Native player already sends per-track levels. An old UI guard still forced every meter except Master to zero. This release enables Track, Bus and Song displays when Native V27.28 advertises track metering. Master remains a separate output measurement. Older Native versions still show unavailable meters rather than invented levels.

Tests cover the actual display helper, level zero/mute and old-version compatibility. Native processing has not changed. Physical device verification remains.

## BenKen Web V26.115 · Section playback, waveform and Native meters

6 November 2026

Use Native V27.28 for waveform and per-track meters. Build the new Xcode project over the existing app with the same identity; do not delete the app or library. Upload the complete web package.

Practice + Tap section to play: tap headings in lyrics, the current/next/later sections in the top bar, or the waveform regions. Show sections controls visibility only. Sections need REAPER timing or SYNC LYRICS. Turning Practice off disables section tapping. Explicitly enabling Tap section to play enables Practice. Seeking protection, double-tap protection and concert lock remain.

Native waveform: generated from the prepared local audio, one small read buffer at a time; cached compact peaks are returned to the web view. Work waits while playing and is cancelled at Play or song change. No full-song PCM copy is sent to WebKit. Native V27.27 shows an upgrade instruction.

Native track meters: sampled signal after each track EQ, scaled by mix gain (including mute/solo/groups/bus/song/master). The master meter measures the actual combined output. Bus and Song displays summarize the highest track contribution, not a separate summed mix tap. Measurement is leased only while the mixer is visible; old values expire. It does not verify external mixer/speaker sound.

Browser interactions, Native tests and Mac/iOS builds checked. Physical iPad, iPhone, Mac and USB device tests remain.

## BenKen Web V26.114 · Visual Controls picker

6 November 2026

Use Native V27.27 (unchanged). Upload the complete web package. Existing songs and saved layouts are preserved.

Settings → Controls & fullscreen → Available buttons: categorized blue button tiles with search and matching menu icons. Tap to add/remove; numbers show order. Expand Your buttons to reorder with arrows and set optional labels. SAVE CONTROLS applies changes. Closing without saving keeps the prior selection.

Lyrics / Chords / Both: add this button under Lyrics & display. It cycles the reading view using the same setting as Lyrics settings. No audio, key or capo change. Large live buttons still shows only Play and Next until disabled.

Local browser and syntax checks completed. Physical-device verification remains for iPad, iPhone and Mac. Native audio processing has not changed.

## BenKen Web V26.113 · Mixer, packing list, chords and fonts

5 November 2026

Use Native V27.27 for sync wording that includes iPhone. Native EQ works from V27.26. Audio processing is unchanged in V27.27. Update the complete web package; build Native over the existing app without deleting it. Back up your library with audio first.

Track EQ and master compressor have separate windows. COMP is on Master; compression remains Browser-only. Song Loudness has a compact LOUDNESS button.

Controls: use the Large live buttons switch; the extra preset button has been removed. Available button rows have matching frames. Mute group names stay in Mixer Settings.

Packing: List / Cards, PDF / CSV export. Choose default template or event. Event packed / home checkmarks are independent.

Chords: 42 chord families across 12 roots, with guitar and piano diagrams, maj7/maj9/dom7/dom9 aliases, enharmonic spellings and slash bass. Guitar shapes are tone-checked; choose a comfortable fingering. Thirteenth chords may omit fifth/eleventh on guitar. Unsupported spellings are labelled.

Lyrics: System Mono, Courier, Menlo / Consolas and Bold lyrics under Lyrics & scrolling.

About, latest updates and all earlier release entries are in English. Import icons use the Settings accent.

Verification: web tests, chord tones, PDF export and responsive layouts checked locally; native builds and regression tests. Physical touch, audio, font fallback and device-to-device sync still require testing.

## BenKen Web V26.112 · Native track EQ

5 November 2026

Requires Native V27.26 for Native EQ. Install the complete web package and build V27.26 over the existing BenKen app. Do not delete the app or library. Make a full backup with audio first.

Mixer > FX · EQ on each track: four bands, enable/bypass, reset, stored per song track. Existing EQ settings are retained; explicitly enabled saved EQ is applied. EQ is updated without decoding files or preparing tempo/key again. USB bus routing remains the same.

Master compression remains Browser-only. Older Native builds cannot enable/edit EQ. The browser and Apple EQ use different filter implementations; exact curves can differ, especially at high frequencies. Check the sound when changing engine.

Automated audio verification on Mac; physical iPad/iPhone, Ui24R and other interfaces plus background playback still require testing. Start with modest EQ changes and check output headroom.

## BenKen Stage Pro — Web V26.111 / Native V27.25

5. november 2026

USE ORIGINAL TEMPO & KEY
Finnes øverst i Tempo & metronome. Velg en låt og stopp avspilling før du endrer valget. På: lyd klargjøres ved originaltempo og null lydtransponering. Av: lagret måltempo og transponering brukes igjen. Justeringene slettes ikke.

Valget gjelder denne låten i hovedspilleren i BenKen (Browser og Native). Den separate eldre OPEN NATIVE TEST PLAYER har ikke støtte for dette nye valget; bruk hovedspilleren.

Lyrics-toneart og regiontider bruker aktiv avspillingsinnstilling. My capo, Bandmate capo og egne visningstransponeringer beholdes. Metronomen bruker originaltempo når Follow song playback BPM er på. Lydjusteringer er låst mens originalvalget er på; slå av valget før du endrer dem.

LASTETID
Kan hjelpe når lyd ellers må behandles for endret tempo/toneart. Originalfiler må fortsatt leses, verifiseres og klargjøres. Ingen ekstra hastighetsgevinst hvis originaltempo og transponering 0 allerede er valgt. Allerede mellomlagret lyd gir liten forskjell. Mac-målingen gjelder lydbehandlingen alene, ikke full innlasting på iPad.

Publiser alle webfilene samlet. Native V27.25 kan beholdes; ingen ny Xcode-bygging nødvendig. Ikke slett appen eller biblioteket.

Kontrollert: websyntaks, filreferanser, historikk, originaltempo, null lydtransponering, tilbakegang til lagrede justeringer, lyrics-toneart og separate capoverdier. Nettleser: valget finnes i Tempo & metronome. Fysisk iPad/iPhone-test gjenstår.

Laget til BenKen™ — Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.110

5. november 2026

Ny knapp: CHECK OFFLINE AVAILABILITY.
Finnes under setlistvelgeren på venstre side, Settings → Concert & sync og Settings → Setlists & library.

Velg sett og trykk CHECK NOW. Låt for låt vises:
• Audio stored locally: alle tilknyttede originalfiler finnes i BenKen på denne enheten og har innhold.
• Audio missing: låt, spornavn og filnavn vises. Manglende, tomme eller utilgjengelige filer telles ikke som klare.
• Lyrics only: låten har ingen lydfiler tilknyttet.

Kontrollen krever verken internett eller mikser. Den laster ikke ned fra iCloud, endrer ikke originalene og kjører ikke under avspilling/klargjøring. Filer bare i iCloud teller ikke som importert i BenKen. Last dem ned og importer/erstatt i Audio & files, eller gjenopprett en full backup med lyd.

Dette er en kontroll av lokale originalfiler, ikke full dekoding eller lydrouting. Test alltid avspilling uten internett, og kontroller backup-enheten separat. Kontrollresultatet lagres ikke som en varig garanti; kjør på nytt etter endringer.

Publiser hele webpakken. Native V27.25 beholdes; ingen ny Xcode-bygging er nødvendig når V27.25 allerede er installert. Oppdateringen inneholder også USB- og fremdriftsendringene fra V26.109.

Kontrollert: websyntaks, filreferanser, cacheliste, valgt sett, delte lydfiler, manglende/tomme/utilgjengelige filer, tekstlåter og avbrudd. Nettleser: knappen åpner dialogen; tomt sett gir ingen klar-status. Fysisk offlineavspilling gjenstår.

Laget til BenKen™ — Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Native V27.25 / Web V26.109

5. november 2026

USB: Native ber eksplisitt om tilgjengelige utgangskanaler på iPad/iPhone. Beholdt USB-routing kontrolleres mot tilgjengelige kanaler. Appen ruter aldri automatisk til stereo for å skjule en USB-feil.

REFRESH OUTPUTS klargjør et allerede lastet native-prosjekt på nytt fra den lokale lydcachen. Har forrige klargjøring feilet, forsøker webdelen vanlig klargjøring. En ny tilkobling mens avspilling er stoppet utløser klargjøring av valgt låt. Ingen automatisk avspilling ved tilkobling.

Preparing: Web viser kopierte byte; Native viser faktisk fremdrift i lydrenderingen, spor for spor. Kontroll av filer og kobling av utganger er egne faser. Brukt tid vises; et sikkert tidsestimat for det som gjenstår kan ikke gis. Native V27.25 kreves for detaljert fremdrift og Refresh outputs.

Åpne App/BenKenStagePro.xcodeproj. Bruk samme Team og appidentitet som eksisterende app og bygg over den. Ikke slett appen eller biblioteket. Publiser alle Web V26.109-filene sammen.

Kontrollert: iOS- og Mac Catalyst-bygg bestått. 42 lydmotortester kjørt, 2 maskinvareavhengige tester hoppet over, ingen feil. Webtest for fremdrift, refresh, feil og lagring bestått.

Fysisk Ui24R/iPad-test gjenstår. Test mikser før appstart, tilkobling etter appstart, kabel ut/inn med avspilling stoppet, alle rutede utganger og bytte til Mixing Station. Bruk ikke oppdateringen live før dette er bekreftet.

Laget til BenKen™ — Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.108

5. november 2026

• Control bar & side shortcuts åpner valgene direkte.
• Large live buttons viser Play og Next som en egen visning. Available buttons, navn, rekkefølge og vanlige layoutvalg beholdes. Slå av Large live buttons og lagre for å gå tilbake til dine knapper.
• LIVE · PLAY & NEXT overskriver ikke lenger knapper eller vanlige layoutvalg.
• Live-visningen støtter også Left/Right vertical buttons, i samme størrelse som sideknappene.
• Vertikale knapper starter under seksjonslinjen og holder seg over sideverktøyene. Raden kan rulles når plassen er liten.

Hvis en eldre versjon allerede har overskrevet knappene med Play/Next, kan den tapte listen ikke rekonstrueres automatisk. Velg dine knapper i Available buttons én gang. Fra denne versjonen beholdes de ved av/på av live-visningen.

Publiser alle webfilene samlet. Behold app og bibliotek. Native V27.23/V27.24 kan brukes; ny Xcode-bygging er ikke nødvendig.

Kontrollert lokalt; fysisk enhet må bekreftes.
Laget til BenKen™
Copyright © Kenneth Hjelle 2026

Ask BenKen: engelske spørsmålseksempler, emnetitler og svar. Den innebygde bruksanvisningen er oversatt til engelsk; søket er fortsatt lokalt uten AI.

## BenKen Stage Pro — Web V26.107

5. november 2026

Capo & Key, Tuner og Metronome på venstre side skjules når setlisten eller biblioteket er åpent. Setlistknappen er fortsatt synlig. Når listen lukkes, kommer snarveiene tilbake med dine lagrede valg. Knappene til høyre er uendret.

Publiser alle webfilene samlet. Ingen ny Xcode-bygging er nødvendig; behold Native V27.23 eller V27.24 og den eksisterende appen med biblioteket.

Kontrollert lokalt i nettleser ved mobil- og nettbrettbredde. Fysisk iPhone/iPad/Mac må bekreftes.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.106

5. november 2026

Publiser alle webfilene samlet. Behold den eksisterende appen og biblioteket.
Ingen ny Xcode-bygging er nødvendig for disse webendringene. Native V27.23 eller V27.24 kan beholdes.

• Import audio & lyrics ligger først i Settings.
• Controls & fullscreen har kategorier med ikoner og Available buttons.
• Control bar kan klappes sammen i innstillingene. Pilknappen over avspillingsfeltet skjuler/viser tidslinje og låtinfo.
• Separate sidevalg for Metronome, Tuner og Capo & Key. Metronome åpner Tempo & metronome.
• Show next when scrolling finnes i Lyrics & scrolling og Controls → Playback & lyrics.
• Utilgjengelig Play viser Stereo/USB-påminnelse og gjeldende lydfeil uten å starte lyd.
• Mixer Settings → Mixer display: Show master fader, Normal / Narrow / Extra narrow.
• Song- og Master-fadere følger samme størrelse som sporene.
• EQ og masterkompressor har egne innganger under Mixer Settings. Må hukes på; gamle verdier beholdes uten automatisk aktivering.

LYDEFFEKTER: Browser støtter EQ og masterkompressor. Native V27.24 behandler ikke disse effektene. I Native vises forklaringen, og avhukingene er sperret. Native-motoren er uendret. Region-loop er fortsatt sperret.

Kontrollert lokalt: JavaScript, valg/lagring, Play-sperre, opt-in for FX, kanalbredde og fadergeometri, Controls i mobilbredde, capo-modell og 32-kanals kompressor med separate utganger. Fysisk lydtest med iPad/iPhone/Mac og Ui24R gjenstår.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro Web V26.105

Editable capo names; saved capo positions and library are preserved. My capo affects chord shapes; Bandmate capo is a fret reminder only. Lyrics / Chords / Both now lives under Settings > Lyrics & scrolling. Ui24R menu is now Cues & Show, with Soundcraft Ui24R as the supported mixer. New matching Play & Sound logo.

Upload all files together. Web changes work with Native V27.23; rebuilding Native V27.24 is only needed for the new installed app icon. Do not delete your existing app or library. Test on your devices before live use.

## BenKen Stage Pro · Web V26.105 · Native V27.23 unchanged

Navy & Copper is now the default skin for new installations and when no skin was selected. Existing selected skins and saved personal colours are preserved. Classic (REAPER) is unchanged.

Upload all web package files together. No Xcode rebuild is required for this web-only update. Do not delete the installed app or its data. Verify the display on your devices before live use.

## BenKen Stage Pro · Web V26.105 · Native V27.23 unchanged

4 November 2026

BAND & PLANNING
Settings → Planning → Band & planning.
Sign in with your email and the code or original link in the email.
Create your band with your name. The creator is administrator.
CREATE INVITATION LINK produces a one-use, seven-day invitation. Copy it and share privately. No email is sent by this button.
The recipient opens Band & planning, signs in and pastes the link under Join a band. ACCEPT INVITATION adds them as a member.

ADMINISTRATOR
Create a local event in Calendar and attach venue, setlists, individual songs and packing list.
Under Band & planning, choose the local event and PUBLISH NEW EVENT.
Text/setlists/venue are shared snapshots; audio remains separate under Share songs & setlists.
A contract enabled on the event is uploaded to the separate administrator-only table. It may contain the profile's contact and bank details; review it before publishing.
Only admins replace or cancel events, add/remove packing items, create/revoke invitations and remove members. The admin cannot be removed through this interface.
REPLACE SELECTED EVENT FROM CALENDAR replaces the selected shared event and requires new replies. It preserves packing checks; manage equipment separately.

MEMBERS
Open the band page and REFRESH. Select an event and reply I CAN COME, CANNOT COME or UNSURE.
Check Packed and Home on your assigned or unassigned equipment. Only administrators manage items.
An .ICS calendar export creates a copy, not a live calendar subscription. Re-export changes and remove cancelled events from the external calendar.
Contracts and fees cannot be retrieved by ordinary members, even through the database API.

CLOUD / VERIFICATION
SUPABASE_BAND_SETUP.sql was activated in the existing project. Existing audio storage policies were not changed.
PostgreSQL role/RLS checks run locally with PGlite; Supabase auth.uid is simulated for those tests. These are not physical-device or real two-account delivery tests.
Supabase email delivery needs to allow member email addresses. Default delivery may be restricted to project team addresses; configure a suitable email provider before wider invitations.
No automatic email/push event notification, automatic background sync or two-way calendar sync in this version.
Login is kept in sessionStorage only, separate from library backup; you may need to sign in after reopening the app.
Shared planning is loaded when this page is opened/refreshed. No polling or audio-engine changes.

INSTALLATION
Upload all files from this package to the existing BenKenStagePro web repository.
Keep the installed app and its library. Native V27.23 can remain installed; no Xcode rebuild is required for this web update.
Use a full audio backup before changing the installed app or restoring a library.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro Web V26.105 · Native V27.23 unchanged

4 November 2026

Direct output-bus dropdown at the top of every track in Mixer → Tracks. Tap once to see bus names and USB outputs. Choose a bus without opening the track settings. Direct USB remains available.

Track settings also keep Output bus visible; extra format, groups and colour controls sit under More track options. Existing atomic save/player update path is retained. Bus reassignment is blocked during playback, preparation, active click and Live Lock. Physical USB audio routing still needs hardware verification.

Includes V26.101 Ask BenKen, offline manual search, About & help and revised instructions. The public website has been updated separately.

Upload every file from this package to the existing BenKenStagePro GitHub Pages application. Keep Native V27.23, no new Xcode build required. Do not delete the installed app or its data.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro Web V26.105 · Native V27.23

4 November 2026

Settings → About & help brings together Ask BenKen, the full manual, updates, About, library export/backup and diagnostics. Show Info stays at the left. Planning stays last in Settings.

Ask BenKen searches 41 bundled manual topics. Norwegian and English queries, selected synonyms, popular questions and direct links. Answers are existing manual paragraphs, not generated text. No AI, network request, account or subscription is required. Questions are held in memory for the current session only. No question history is saved or transmitted.

Manual text for tuner, count-in, flash and loudness has been updated. Help opens the relevant controls but does not change their values or start playback. Tuner help opens a settings page before microphone use.

Upload all files to the existing BenKenStagePro GitHub Pages app, including benken-help-v26-105.js. Native code is unchanged. Keep Native V27.23; no Xcode rebuild needed. Never delete the installed app or data to update.

Automated search and syntax tests and browser navigation checks. Physical iPad/iPhone display and full-library testing remain necessary.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro Web V26.105 · Native V27.23

4 November 2026

Warm Paper skin; readable warm paper surfaces across lyrics and Settings. Saved personalization colors and tracks are retained. On light skins, display colors are darkened when necessary for readable contrast.

Settings search, clearer categories, Show Info at the left, separate latest updates and diagnostics. Planning remains last.

My profile & band: local details and bounded image logo. Included in backups. Only band name/logo appear in song/setlist PDFs; entered contact/bank details appear in contract drafts. No new cloud account or automatic upload is created.

Song PDF design / Setlist design: theme, font, custom title, sizes, metadata, chords, A4/Letter, first-page preview and PDF download. Setlist selection for export does not change the active playback setlist. Documents use original song key/chords; performance capo/transpose are not applied. PDFs use image pages for Unicode support; text is not searchable. No audio included. Max 100 pages. Exports require stopped playback.

Upload all package files to the existing BenKenStagePro GitHub Pages app, including benken-documents-v26-105.js. Native code is unchanged. Keep Native V27.23; no Xcode rebuild is needed if already installed. Do not delete the installed app or its data.

Verified with browser UI at desktop and iPhone widths, test PDF parsing/image review, and automated regression checks. Save/share PDF on physical iPad/iPhone and full-library behavior still need device testing.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro Web V26.105 · Native V27.23

MASTER-meteret viser målt signal etter Native-miksen (alle utgangene). Oppdatering omtrent 10 ganger i sekundet. Bare ett målepunkt, ingen ekstra måling per spor. Målingen går ut på tid når mikseren ikke vises / appen er i bakgrunnen. Eksisterende transport- og bakgrunnsavspilling beholdes.
Signal betyr at lyd går gjennom motoren. Det bekrefter ikke patching/volum i Ui24R eller lyd fra høyttalere. Det er en samplet signalindikator, ikke en true-peak-måler. Separate spor-, buss- og Song-metere er fortsatt uten separat Native-måling.

Tuneren har kortere ferskt vindu for gitar og sang, langt vindu for bass, raskere oppdatering og mindre flakking rundt grønt. Ingen mikrofonbehandling fortsetter etter at tuneren lukkes. Testet med testsignaler; ekte instrument og mikrofon må bekrefte forbedringen.
Show Info ligger på egen 44 px høy rad med mer avstand fra Done. About og manual er oppdatert.

Denne oppdateringen KREVER en ny Native-bygging for signalmeteret:
1. Last opp alle webfilene til appens GitHub-repo som før.
2. Pakk ut Native V27.23 og åpne App/BenKenStagePro.xcodeproj.
3. Bygg over eksisterende BenKen Stage Pro på iPad/iPhone/Mac. Ikke slett appen. Appidentitet, webadresse og eksisterende lagring er beholdt.
4. About skal vise Web V26.105 og Native V27.23.

Build og automatiske tester passerer. Fysisk iPad/iPhone/Ui24R og ditt bibliotek må testes før livebruk.

## BenKen Stage Pro Web V26.105 · Native V27.22

Song Loudness er nå egen rad i Settings → AUDIO & PLAYBACK. Knappen i Song Master heter SONG LOUDNESS. Den kan også velges som en Controls-knapp via Controls & fullscreen → Button order and labels.
Fremdriftslinjen viser samlet prosent under analyse av låt eller setliste, og status viser gjeldende låt/fil. Avbrutt analyse beholder faktisk fremdrift; ferdige/skippede låter telles i totalen.

Play, Next, alle sideknapper og Controls har samme 94 % tette bakgrunn. Deaktiverte knapper beholder bakgrunnens tetthet, med nedtonet symbol/tekst.
Controls festes ved bunnen uten gjentatt høyde/top-beregning ved normal zoom. Like målinger utløser ikke nye layoutoppdateringer. Song Loudness slipper tastaturfokus før analyse og bruker fokus uten rulling når dialogen lukkes.

Om LUFS: originaltempo, stereo-referanse før EQ/kompressor/global Master. −3 dBFS sample-headroom og eksisterende maks +6 dB Song Master kan begrense oppnådd nivå. Originalfilene endres ikke. Behold Native V27.22.

Last opp alle webfilene til appens GitHub-repo. Ingen ny Xcode-bygging nødvendig. About og manual er oppdatert. Fysisk iPad/iPhone må bekrefte plassering og respons; nettleser og automatiske kontroller er utført.

Large live buttons viser fortsatt bare Play og Next. Song Loudness-knappen i Controls vises i vanlig Controls-oppsett eller på siden.

## BenKen Stage Pro Web V26.105 · Native V27.22

Mixer → TRACKS → SONG → LUFS
1. Velg Target LUFS (−60 til −5, standard −14).
2. ANALYZE & APPLY måler gjeldende låt og lagrer Song Master.
3. ANALYZE SETLIST behandler den valgte setlisten én låt om gangen.
4. RESET SONG henter tilbake mastervolumet fra før første normalisering.

Faktisk oppnådd LUFS vises. Høye lydtopper og eksisterende maksimal Song Master-forsterkning på +6 dB kan gjøre målet uoppnåelig. Ingen komprimering eller endring av originalfiler.
Målingen er en stereo-referanse ved originaltempo før EQ, masterkompressor og global Master. Lagrede spor- og bussnivåer inngår. Midlertidige mute/solo ignoreres. Velg spor under Tracks & measurement; klikk/cue utelates fra LUFS som standard. Alle filspor undersøkes for sample-topper, både i full stereomiks og lagret USB-ruting. Generert metronom inngår ikke. Dette er ikke en sanntids limiter eller true-peak-måler.

Hold BenKen åpen og stans avspilling under analysen. Analyse og dekoding kjøres før konserten. Temporary miksbiter lagres lokalt og slettes etterpå. En fil dekodes om gangen. Analysegrenser: 64 MiB per fil, 192 MiB dekodet lyd, maks stereo. Låter over ca. 8 minutter kan overstige analysegrensen.
Manglende filer rapporteres med låt og spornavn. Cancel stopper videre analyse; ferdige låter beholder lagrede nivåer. Avspilling og automatisk synk venter mens analysen kjører.

Last opp alle webfilene til appens GitHub-repo som før. Ingen ny Xcode-bygging nødvendig. Behold eksisterende app og låtbibliotek.
About og manualen er oppdatert. Automatisk og nettlesertesting er utført. Ditt fulle bibliotek og fysisk iPad/iPhone må fortsatt testes før livebruk.

## BenKen Stage Pro Web V26.105 · Native V27.22

Play og Next har nå bare svært svak gjennomsiktighet.
Ingen endringer i Controls-funksjoner eller lydmotor.
Last opp alle webfilene som ved tidligere oppdateringer. Ingen ny Xcode-bygging nødvendig.

## BenKen Stage Pro Web V26.105 · Native V27.22

Large live buttons viser kun Play og Next med litt gjennomsiktig bakgrunn.
Vanlig Controls-oppsett beholdes når Large live buttons slås av.
Controls-rettelsene fra V26.94 er beholdt. Ingen endring i lydmotor.
Last opp alle webfilene som ved tidligere oppdateringer. Ingen ny Xcode-bygging nødvendig.
Behold eksisterende app og låtbibliotek.

## BenKen Stage Pro Web V26.105 · Native V27.22

Store Controls-knapper har gjennomsiktige flater. Rettet vis/skjul i fullskjerm.
Last opp webfilene som ved tidligere oppdateringer. Native/Xcode trenger ikke bygges på nytt.
Behold eksisterende app og bibliotek. About viser siste endringer.
Fysisk iPad/iPhone må bekrefte responsen.

## BenKen Stage Pro — Web V26.105

4. november 2026

Kun weboppdatering. Behold Native V27.22. Ingen ny Xcode-bygging.
Publiser alle webfilene samlet, vent til GitHub Pages er ferdig og åpne appen igjen.

Settings > Lyrics & scrolling > LYRICS FOLLOW REGION COLOR.
Valget er AV som standard. Slå på for at teksten under Verse, Chorus, Intro, Bridge, Solo, Outro og Melody skal følge regionfargen. Valget gjelder alle låter og lagres på enheten.
Det følger samme REAPER/Personalization-valg som regionoverskriftene. Akkorder beholder sin egen farge. Tekst som er fargelagt manuelt med fargemarkeringer beholder den valgte fargen. Tekst før første region beholder vanlig tekstfarge.
Fungerer med og uten akkorder og i det eksterne tekstvinduet. I «bare akkorder»-visning er ingen sangtekst synlig og akkordfargen er uendret.

Paletter, varslingsvalg og sammenleggbare menyer er beholdt. Lydmotor og routing er uendret. About og manual oppdatert.
Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.92

4. november 2026

Kun weboppdatering. Behold Native V27.22; ingen ny Xcode-bygging.
Publiser alle webfilene samlet og vent til GitHub Pages er ferdig.

Settings > Appearance > Color palettes har fire valg:
Classic (REAPER), Sunset, Lavender og Fjord.
App skin og Color palettes kan fortsatt klappes sammen.

RESET TO CLASSIC bruker Classic (REAPER) og disse regionfargene fra REAPER-oversikten:
Intro #fc7a7e
Verse #fead76
Chorus #f8ff87
Bridge #a0ff91
Solo #70e4ff
Outro #7093fe
Melody #fc74ff
Navn og farger vises under den valgte paletten. Importerte regionnavn endres ikke. Når «Override REAPER region colors with Personalization» er av, brukes fortsatt de faktiske fargene fra importen. Når valget er på, brukes palettens farge per regiontype.

Sunset kombinerer solnedgangsbildenes sjø-, rosa- og ferskentoner. Lavender følger den oppgitte gule/rosa/lavendel/teal-paletten. Fjord bruker innsjøbildets duse rosa-, grønne-, teal- og marineblå toner. Mørke leseflater og lyse tekstfarger sørger for kontrast.
Et palettvalg erstatter Personalization-farger. Sporfarger og lydinnstillinger beholdes. Oppstartsvarselets av/på-valg fra V26.91 er beholdt.
About og manual oppdatert.
Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.91

4. november 2026

KUN WEBOPPDATERING. Behold Native V27.22. Ingen ny Xcode-bygging er nødvendig.
Publiser alle filene fra denne pakken samlet, vent til GitHub Pages er ferdig og åpne appen igjen.

Settings > Appearance:
App skin og Color palettes er to sammenleggbare felt. De starter lukket og viser valgt navn. Mens du velger skin/palett forblir det åpne feltet åpent.
Dark har oransje knapper/aksenter. Studio Black har mørkere grå bakgrunn og flater.
Seks nye koordinerte paletter: Vice, Warm, Cool, Earth, Pastel og Spectrum. Hver har ti farger, i tillegg til Nord, Dracula og Solarized-palettene.
Skinbytte beholder egne tekst-, akkord-, seksjons- og sporfarger. Et eksplisitt palettvalg erstatter Personalization-fargene, som beskrevet i menyen. Importerte REAPER-regionfarger og sporfarger beholdes.

Settings > Audio & playback > Missing audio:
SHOW MISSING AUDIO WARNINGS styrer visning av manglende lyd.
SHOW “SONGS HAVE MISSING AUDIO” AT STARTUP styrer oppstartsvarselet separat. Slå av for å slippe varselet ved neste oppstart. Valget huskes på enheten.
Oppstartsvarselet har også SHOW AT STARTUP som kan slås av direkte.
Disse valgene endrer ikke lydfilene og gjør ikke manglende filer spillbare.

About og manual er oppdatert. Native lydmotor, tempo, MIDI Clock og routing er uendret.
Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Native V27.21 / Web V26.89

4. november 2026

Bygg App/BenKenStagePro.xcodeproj i denne nye Native-mappen over eksisterende app. Ikke slett appen eller biblioteket. Samme appidentitet og lagring beholdes.
Native V27.21 inneholder lydrettingene og oppstartsrettingen. Web V26.87/26.88 kan fortsatt brukes. Web V26.89 oppdaterer About og lydstatusvisningen; den anbefales, men er ikke nødvendig for selve native lydrettingen.

BAKGRUNNSAVSPILLING
Audio Units for spillere, klikk og miksing reserverer minst 4096 frames per renderblokk før motoren startes. Dette er kapasitet for iOS-bakgrunnskjøring, ikke en endring av ditt valgte hardwarebuffer. La bufferen stå på 1024 under første test.
Kontinuerlig signalmåling på lydstrømmen er slått av ved vanlig iPad/iPhone-avspilling for å redusere belastning. Mac-signaldiagnostikk og offline lydtester er beholdt.
Reelt bytte av lydutgang, frakobling eller en annen app som avbryter lydøkten kan fortsatt stoppe avspillingen. Ingen automatisk omstart ved et slikt avbrudd.

KLARGJØRING
Spor med uendret tempo og tonehøyde hopper over TimePitch-behandlingen. Filverifisering og klargjøring til 48 kHz beholdes; dette kan fortsatt ta tid, særlig med store filer og endret tempo/toneart. Verifiserte eksisterende lydcacher gjenbrukes.
Native lydstatus viser tid for filverifisering/installering og for klargjøring/innlasting, samt sist registrerte lydavbrudd. Web V26.89 forklarer at signalmåling er slått av på iOS.

TEST
1. Bruk Native, buffer 1024 og en låt uten tempo- eller toneartsendring.
2. Start avspilling, gå til Hjem-skjermen og la den spille minst ett minutt.
3. Gå tilbake, åpne Mixing Station mens samme låt spiller, og prøv minst ett minutt.
4. Gjenta med multitrack, separat USB-routing, tempo og transponering på ditt vanlige oppsett.
Hvis det stopper: åpne Settings > Audio & playback > Native audio status og lagre rapporten før du klargjør en annen låt. Rapporten inneholder tidspunkt/målinger og siste registrerte lydavbrudd.

Bygging og automatiske lydtester erstatter ikke fysisk iPad/iPhone-testing. Appbytte og Mixing Station må fortsatt bekreftes på dine enheter før livebruk.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## BenKen Stage Pro — Web V26.87 / Native V27.19

4. november 2026

DENNE OPPDATERINGEN TRENGER BÅDE WEBFILENE OG NY BYGGING I XCODE.
Publiser alle webfilene samlet. Åpne App/BenKenStagePro.xcodeproj i den nye Native-mappen. Velg din enhet og bygg over den eksisterende BenKen Stage Pro-appen. Ikke slett appen. Samme appidentitet og datalager er beholdt. Ta backup med lyd før oppdatering.

BAKGRUNNSAVSPILLING
Velg Native under Settings > Audio & playback. Start en låt, bytt til Mixing Station, og kontroller at lyden fortsetter. Tilbake i BenKen skal tidsvisningen oppdateres.
Webdelen pauser ikke lenger den nye native motoren ved pagehide, og unødvendige meldinger om uendret lydrute ignoreres. Native lyd og MIDI Clock er uavhengige av nettleserens tidtakere.
Ved stopp i visningsprosessen fortsetter aktiv native avspilling. STOP AUDIO vises før RETRY kan brukes.
Reelt bytte/frakobling av lydutgang og lydavbrudd stopper fortsatt avspillingen. Tvangsavslutting av BenKen stopper lyden. Automatisk neste låt i bakgrunnen er ikke bekreftet.

MIDI CLOCK
Settings > MIDI & pedals > MIDI CLOCK OUTPUT.
Stopp musikken. Velg én tilkoblet MIDI-utgang, slå på Send MIDI Clock with playback og lagre. Innstillingen huskes lokalt på hver enhet.
Clock følger låtens avspillingstempo, også ved tempoendring, uavhengig av manuelt metronomtempo. Krever kjent BPM mellom 20 og 300 og Native-motoren.
Send Start / Stop er valgfritt og av som standard. START sendes på første musikkslag etter count-in ved start fra begynnelsen. Clock sendes også under count-in. Pause/stopp/lydavbrudd sender STOP når valget er på.
Seek eller resume flytter ikke looperens posisjon og sender ikke ny START. Begynn fra låtstart for felles start. Looperens lagrede looper må være satt opp for ekstern temposync.
Velg ekstern MIDI/USB-temposync på RC-600. Enheten må vises som MIDI-utgang; hvis direkte USB ikke fungerer, bruk kompatibelt USB–MIDI-interface til DIN MIDI IN.
Ved MIDI-frakobling eller klokkeavbrudd fortsetter lyden uten Clock. Stopp og start igjen for ny synkronisering.

KONTROLLERT
iOS Simulator og Mac Catalyst bygger. 35 Swift-tester, 2 hoppet over, ingen feil; inkludert virkelig CoreMIDI-kommunikasjon med virtuell testutgang og tidsstemplede Clock/Start/Stop-meldinger.
Web-regresjoner passerer, inklusive count-in, tempo, sveip, menyer og bakgrunnsvalg. MIDI-meny og lagring er kontrollert med simulert enhet.
Fysisk iPad/Mixing Station og RC-600 er IKKE testet her. Dette må prøves med ditt fulle lydoppsett før livebruk. Ha konserten tilgjengelig på reserveenheten.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026

## Web V26.86 / Native V27.18

Oppdater alle webfilene. Ingen ny Xcode-bygging med Native V27.18.

Controls settings > Playback and lyric options > Show sections ligger rett over Show waveform. De to valgene er uavhengige. Trykk SAVE CONTROLS.

Settings > Controls & fullscreen åpner samme komplette meny med alle Controls- og fullskjermvalg. Tilbakeknapp til Settings vises når du åpner derfra.

About og manual oppdatert. Test på fysisk enhet før livebruk.

## Web V26.85 / Native V27.18

Oppdater alle webfilene. Ingen ny Xcode-bygging når Native V27.18 er installert.

Appearance > COMPLETE COLOR PALETTES: Nord, Dracula, Solarized Dark/Light. Erstatter visnings- og Personalization-farger samlet. Beholder track colors og REAPER-farger når Personalization-overstyring er av.

Controls > Button order and labels: METRO FLASH (blink av/på), Capo & Key (toneart og K/B-capo), Tuner og Sections. Trykk SAVE CONTROLS.

Alle deler i seksjonslinjen viser regionfarge. About og manual oppdatert. Test på enhetene før livebruk.

## Web V26.84 / Native V27.18

Oppdater alle webfilene på GitHub. Ingen ny Xcode-bygging når Native V27.18 allerede er installert.

Settings > Lyrics > SHOW SECTION BAR: valgfri seksjonslinje med gjeldende del, neste del og fremdrift. Bruker REAPER-regioner eller Sync lyrics. Skjules uten tidsinformasjon.

Controls settings > Large buttons: store valgfrie knapper nederst. LIVE · PLAY & NEXT velger to store knapper. Trykk SAVE CONTROLS. Lokalt oppsett beholdes ved konsertsync.

About har siste oppdateringer. Endringene er kontrollert i nettleser og med regresjonstester; fysisk iPad/iPhone/Mac og ekte lyd må testes før livebruk.

Controls > Button order and labels > Sections: legg til knapp som viser/skjuler seksjonslinjen.
Show info har samme av/på-bryter som øvrige menyvalg.

## Web V26.83 / Native V27.18

Oppdater webfilene på GitHub. Ingen ny Xcode-bygging når Native V27.18 allerede er installert.

Settings > Audio & playback har nå Tempo & metronome, Mixer og Mixer settings.
I Tempo & metronome: Flash top frame on the beat slår på blink rundt topprammen. Top frame color velger fargen. Lagrede blinkvalg videreføres fra tidligere versjon.
Controls beholder utseendet uten ramme. Siste oppdateringer er oppdatert i About.

## BenKen Web V26.82 / Native V27.18

Kun weboppdatering. Native V27.18 beholdes, ingen ny Xcode-bygging.
Tomrommet på sidene av leseområdet er med i sveipeområdet. Menyer, knapper og setliste er fortsatt utenfor.
About > Sveipkontroll viser nå separate resultater for venstre/neste og høyre/forrige. Oppdater kontroll viser bekreftelse og avlesningstidspunkt.
Faktisk sveiping på dine enheter må bekreftes etter oppdatering.

Studio Black er mørkere bak sangteksten og i menyer/knapper. Eksisterende standard Studio Black-farger oppdateres; egne tekst-, akkord- og sporfarger beholdes.

## Web V26.81 + Native V27.18

Oppdater begge deler. Bygg App/BenKenStagePro.xcodeproj over eksisterende app uten å slette den.
Sveipkontroll finnes i Settings > About. Lukk About, sveip en gang i hver retning, åpne About og se resultatene.
Faktisk sveiping er fortsatt ikke bekreftet på enhetene dine.

## BenKen Web V26.80 + Native V27.17

Denne sveiperettingen krever begge deler:
1. Oppdater webfilene på GitHub.
2. Åpne App/BenKenStagePro.xcodeproj i BenKen_Stage_Pro_V27_17_Native_Swipe og bygg over eksisterende app på både iPad og iPhone. Ikke slett appen.
3. Kontroller Web V26.80 og at SWIPE LEFT / RIGHT TO CHANGE SONG er på under Lyrics.

Sveip mot venstre for NEXT, høyre for PREVIOUS inne i leseområdet. iOS gjenkjenner sveipet; nettleserens berøringshendelser brukes kun som reserve i nettleser/eldre native versjon.
Samme appidentitet, nettadresse og datalager er beholdt.

Settings > About viser nå Siste oppdateringer og tidligere endringer.

## BenKen Stage Pro Web V26.79 – iPhone/iPad Touch Swipe

Berøringsbasert sveiping også når WebKit avbryter pointer-hendelser.
Vannrett rulling i tekstlinjer skal ikke lenger stjele låtsveipet når SWIPE LEFT / RIGHT TO CHANGE SONG er aktivert.
Sveip går direkte til samme låtbyttefunksjon som Previous/Next, uten syntetiske knappetrykk.
Loddrett rulling og tofingerzoom beholdes.

Oppdater webfilene på GitHub og sjekk at V26.79 vises på begge enheter. Native V27.16 beholdes.
Må testes med faktisk berøring på iPad/iPhone etter installasjonen.

## BenKen Stage Pro Web V26.78 – mer pålitelig sveiping

Sveip i hele leseområdet for neste/forrige låt, også ved tittel og tom plass.
Kortere sideveis sveip på iPhone, separat håndtering av loddrett rulling, flerfingerbevegelser og avbrutte sveip.
Count-in fra V26.77 er med.

Oppdater webfilene på GitHub. Native V27.16 beholdes; ingen ny Xcode-bygging er nødvendig.

## BenKen Stage Pro Web V26.77 – Live count-in

Inntelling før låten virker også med Practice av, i både Native og Browser.
Controls: legg til Count-in off / 2 / 4 bars. Knappen slår på lyd når du aktiverer 2/4 takter.
Metronome: velg Audible count-in, 2/4 takter, SAVE CLICK SETTINGS. STOP og PLAY starter med inntelling.
Continue metronome with backing tracks lar klikket fortsette.
Stereo blander klikk til 1–2. Live / USB bruker valgt metronombuss.

Last opp innholdet i denne mappen til GitHub slik som før. Bruk eksisterende Native V27.16; ingen ny Xcode-bygging er nødvendig.

## BenKen Stage Pro – Web V26.76

Brukes med den vanlige Xcode-appen V27.16. Ingen ny native bygging er nødvendig for disse menyendringene.

- Tekstbakgrunnen følger valgt skin. Studio Black bruker mørkegrå bakgrunn.
- Controls settings har ruteikon, tydelig forskjellig fra Mixer.
- Controls settings > Position: Bottom / Left / Right.
- Sidevisning viser bare knapper, i samme størrelse som menyknappene. Rull i rekken ved behov.
- Plassering og knappoppsett lagres per enhet og beholdes ved synk/import.

Publiser alle webfilene samlet til det samme GitHub Pages-nettstedet og last appen på nytt. Denne pakken inneholder ikke et nytt testbibliotek og endrer ikke appidentiteten.

## BenKen Stage Pro – Web V26.75 / Native V27.16

- Felles menykort med samme bakgrunn, hjørner, brytere og mellomrom.
- Setlist View som egen ryddig innstillingsrad.
- Audio buffer med menyikon.
- Tuner uten Input, Start eller Stop. Automatisk start/lukking.
- Samme bryterstil for tuner-snarveien over Capo & Key.
- Litt raskere måling og mer direkte respons ved små toneendringer.
- Planning sist i Settings.
- Oppdatert About-liste med kreditering og copyright.

Denne pakken brukes med oppdateringen til den vanlige BenKen Stage Pro-appen.
Les OPPDATERING_TIL_VANLIG_APP.txt. Ta full backup med lyd først. Publiser webfilene samlet til samme GitHub-nettsted, og bygg App/BenKenStagePro.xcodeproj fra Native V27.16-pakken på ønsket enhet.
Pakken erstatter ikke biblioteket med testlåter. Ikke slett den vanlige appen før oppdatering.

## BenKen Web V26.74 – Calendar, venues, packing & tuner input fix

BRUK WEB V26.74 SAMMEN MED NATIVE V27.12
Bygg App/BenKenStagePro.xcodeproj fra Native V27.14-pakken på iPad/Mac.
Den gamle Native-appen får ikke den direkte mikrofonrettingen bare ved weboppdatering.
START TUNER skal nå be om mikrofontilgang direkte fra native-appen.
På iPad foretrekkes innebygd mikrofon. På Mac brukes systemets lydinngang.
Input level viser om det kommer signal. Stop / Done / bakgrunn stopper mikrofonen.
Mac-prosjektet har Audio Input-rettighet for hardened runtime.
Browser ber om mikrofon før den venter på AudioContext, og bruker en stille analyseutgang.
Virkelig mikrofon og avspilling etter tuning må prøves på fysisk enhet.

KALENDER
Kun i Settings → PLANNING: Calendar, Venues og Packing list. Ingen kalenderknapp i hovedbildet.
Calendar: legg til øving/konsert, dato, start/slutt, oppmøte, lydprøve, spillested, sett og låter.
Venues: Add venue med adresse, kontakt, telefon, e-post og scenenotater.
Packing list: mal kopieres til nye arrangementer. Legg til/fjern utstyr, juster antall,
og kryss av separat for Pack for the gig og Bring home.
Contract: egne arrangør-, honorar- og vilkårsfelt. CONTRACT DRAFT eksporterer et HTML-utkast
som kan åpnes og skrives ut / lagres som PDF. Ingen sending eller signering skjer automatisk.

Kalenderen lagres lokalt og følger med i bibliotekbackup. .ICS er manuell eksport,
ikke automatisk Apple/Google-synk. Google-import gjøres på datamaskin.
Felles bandkonto, invitasjoner og automatisk kalenderabonnement er ikke aktivert i denne versjonen.
Kontakter og kontraktsbeløp inkluderes ikke automatisk i .ics eller deling av låt/setliste.

MANUAL
Settings → Manual har nå 34 søkbare kapitler. manual.html er også inkludert for offline lesing/utskrift.

KONTROLL
133 automatiske kontroller (119 web / 14 native tuner-DSP og kommandohåndtering).
Native V27.14 bygger for Mac Catalyst og iPad-simulator. Mikrofonen er ikke fysisk testet.
UI testet med isolert bibliotek, testarrangement og simulert native-mikrofon.

REFERANSER
Apple mikrofontillatelse: https://support.apple.com/no-no/102213
Mac Audio Input: https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.security.device.audio-input
Google kalenderimport: https://support.google.com/calendar/answer/37118
Apple kalenderimport: https://support.apple.com/no-no/guide/calendar/icl1023/mac

V26.74 / Native V27.14
- Ny vannrett tuner i valgt skin. Grønn innenfor +/-2,5 cent.
- Overlappende native analyse og finmåling ved full samplingsfrekvens.
- Apple / iOS Calendar: Connect, velg skrivbar kalender, Sync now. Valgfri oppdatering etter lagring. Enveis BenKen til Kalender, ingen bandinvitasjoner.
- Venues: postnummer, by, nettside og native Apple Maps-søk.
- Pakkeliste: egen Edit list / Done editing.
- Kalendervisning Month / Day / Upcoming og flere kontraktfelt.
Bygg Native V27.14 og oppdater webfilene til V26.74. Faktisk mikrofonpresisjon og kalenderrettighet må testes på enheten.

V26.74 / Native V27.14
Tuner starter når du velger Tuner. Valgfri snarvei over Capo & Key i tuneren eller Settings > Controls.
Lavere signalterskel og kortere finmåling for varierende toner. Nivå vises i dBFS.
Native tuner bruker nå en begrenset buffer med bare nyeste lydvindu og en timer som ikke bygger opp analysekø. Innsamling og timer kanselleres når tuneren stoppes.
Controls har ikke ytre ramme. Knapper, rekkefølge og visning huskes på hver enhet og beholdes ved import/sync. Ved full gjenoppretting kan man fortsatt uttrykkelig velge å gjenopprette enhetsinnstillinger.

V26.74 / Native V27.15
Raskere tuner: halvparten så langt lydvindu, analyse av nyere lyd, raskere avlesning og mindre utjevning. Købegrensningen fra V27.14 beholdes.
Planning er siste kategori i Settings.
iPhone og iPad må få ny Xcode-app via Run for å oppdatere native mikrofonkode. Weboppdatering alene er ikke nok. Mikrofontillatelse gis separat på hver enhet. Ikke slett appen for å oppdatere.

## BenKen Web V26.73 – Calendar, venues, packing & tuner input fix

BRUK WEB V26.73 SAMMEN MED NATIVE V27.12
Bygg App/BenKenStagePro.xcodeproj fra Native V27.14-pakken på iPad/Mac.
Den gamle Native-appen får ikke den direkte mikrofonrettingen bare ved weboppdatering.
START TUNER skal nå be om mikrofontilgang direkte fra native-appen.
På iPad foretrekkes innebygd mikrofon. På Mac brukes systemets lydinngang.
Input level viser om det kommer signal. Stop / Done / bakgrunn stopper mikrofonen.
Mac-prosjektet har Audio Input-rettighet for hardened runtime.
Browser ber om mikrofon før den venter på AudioContext, og bruker en stille analyseutgang.
Virkelig mikrofon og avspilling etter tuning må prøves på fysisk enhet.

KALENDER
Kun i Settings → PLANNING: Calendar, Venues og Packing list. Ingen kalenderknapp i hovedbildet.
Calendar: legg til øving/konsert, dato, start/slutt, oppmøte, lydprøve, spillested, sett og låter.
Venues: Add venue med adresse, kontakt, telefon, e-post og scenenotater.
Packing list: mal kopieres til nye arrangementer. Legg til/fjern utstyr, juster antall,
og kryss av separat for Pack for the gig og Bring home.
Contract: egne arrangør-, honorar- og vilkårsfelt. CONTRACT DRAFT eksporterer et HTML-utkast
som kan åpnes og skrives ut / lagres som PDF. Ingen sending eller signering skjer automatisk.

Kalenderen lagres lokalt og følger med i bibliotekbackup. .ICS er manuell eksport,
ikke automatisk Apple/Google-synk. Google-import gjøres på datamaskin.
Felles bandkonto, invitasjoner og automatisk kalenderabonnement er ikke aktivert i denne versjonen.
Kontakter og kontraktsbeløp inkluderes ikke automatisk i .ics eller deling av låt/setliste.

MANUAL
Settings → Manual har nå 34 søkbare kapitler. manual.html er også inkludert for offline lesing/utskrift.

KONTROLL
133 automatiske kontroller (119 web / 14 native tuner-DSP og kommandohåndtering).
Native V27.14 bygger for Mac Catalyst og iPad-simulator. Mikrofonen er ikke fysisk testet.
UI testet med isolert bibliotek, testarrangement og simulert native-mikrofon.

REFERANSER
Apple mikrofontillatelse: https://support.apple.com/no-no/102213
Mac Audio Input: https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.security.device.audio-input
Google kalenderimport: https://support.google.com/calendar/answer/37118
Apple kalenderimport: https://support.apple.com/no-no/guide/calendar/icl1023/mac

V26.73 / Native V27.14
- Ny vannrett tuner i valgt skin. Grønn innenfor +/-2,5 cent.
- Overlappende native analyse og finmåling ved full samplingsfrekvens.
- Apple / iOS Calendar: Connect, velg skrivbar kalender, Sync now. Valgfri oppdatering etter lagring. Enveis BenKen til Kalender, ingen bandinvitasjoner.
- Venues: postnummer, by, nettside og native Apple Maps-søk.
- Pakkeliste: egen Edit list / Done editing.
- Kalendervisning Month / Day / Upcoming og flere kontraktfelt.
Bygg Native V27.14 og oppdater webfilene til V26.73. Faktisk mikrofonpresisjon og kalenderrettighet må testes på enheten.

V26.73 / Native V27.14
Tuner starter når du velger Tuner. Valgfri snarvei over Capo & Key i tuneren eller Settings > Controls.
Lavere signalterskel og kortere finmåling for varierende toner. Nivå vises i dBFS.
Native tuner bruker nå en begrenset buffer med bare nyeste lydvindu og en timer som ikke bygger opp analysekø. Innsamling og timer kanselleres når tuneren stoppes.
Controls har ikke ytre ramme. Knapper, rekkefølge og visning huskes på hver enhet og beholdes ved import/sync. Ved full gjenoppretting kan man fortsatt uttrykkelig velge å gjenopprette enhetsinnstillinger.

## BenKen Web V26.72 – Calendar, venues, packing & tuner input fix

BRUK WEB V26.72 SAMMEN MED NATIVE V27.12
Bygg App/BenKenStagePro.xcodeproj fra Native V27.13-pakken på iPad/Mac.
Den gamle Native-appen får ikke den direkte mikrofonrettingen bare ved weboppdatering.
START TUNER skal nå be om mikrofontilgang direkte fra native-appen.
På iPad foretrekkes innebygd mikrofon. På Mac brukes systemets lydinngang.
Input level viser om det kommer signal. Stop / Done / bakgrunn stopper mikrofonen.
Mac-prosjektet har Audio Input-rettighet for hardened runtime.
Browser ber om mikrofon før den venter på AudioContext, og bruker en stille analyseutgang.
Virkelig mikrofon og avspilling etter tuning må prøves på fysisk enhet.

KALENDER
Kun i Settings → PLANNING: Calendar, Venues og Packing list. Ingen kalenderknapp i hovedbildet.
Calendar: legg til øving/konsert, dato, start/slutt, oppmøte, lydprøve, spillested, sett og låter.
Venues: Add venue med adresse, kontakt, telefon, e-post og scenenotater.
Packing list: mal kopieres til nye arrangementer. Legg til/fjern utstyr, juster antall,
og kryss av separat for Pack for the gig og Bring home.
Contract: egne arrangør-, honorar- og vilkårsfelt. CONTRACT DRAFT eksporterer et HTML-utkast
som kan åpnes og skrives ut / lagres som PDF. Ingen sending eller signering skjer automatisk.

Kalenderen lagres lokalt og følger med i bibliotekbackup. .ICS er manuell eksport,
ikke automatisk Apple/Google-synk. Google-import gjøres på datamaskin.
Felles bandkonto, invitasjoner og automatisk kalenderabonnement er ikke aktivert i denne versjonen.
Kontakter og kontraktsbeløp inkluderes ikke automatisk i .ics eller deling av låt/setliste.

MANUAL
Settings → Manual har nå 34 søkbare kapitler. manual.html er også inkludert for offline lesing/utskrift.

KONTROLL
133 automatiske kontroller (119 web / 14 native tuner-DSP og kommandohåndtering).
Native V27.13 bygger for Mac Catalyst og iPad-simulator. Mikrofonen er ikke fysisk testet.
UI testet med isolert bibliotek, testarrangement og simulert native-mikrofon.

REFERANSER
Apple mikrofontillatelse: https://support.apple.com/no-no/102213
Mac Audio Input: https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.security.device.audio-input
Google kalenderimport: https://support.google.com/calendar/answer/37118
Apple kalenderimport: https://support.apple.com/no-no/guide/calendar/icl1023/mac

V26.72 / Native V27.13
- Ny vannrett tuner i valgt skin. Grønn innenfor +/-2,5 cent.
- Overlappende native analyse og finmåling ved full samplingsfrekvens.
- Apple / iOS Calendar: Connect, velg skrivbar kalender, Sync now. Valgfri oppdatering etter lagring. Enveis BenKen til Kalender, ingen bandinvitasjoner.
- Venues: postnummer, by, nettside og native Apple Maps-søk.
- Pakkeliste: egen Edit list / Done editing.
- Kalendervisning Month / Day / Upcoming og flere kontraktfelt.
Bygg Native V27.13 og oppdater webfilene til V26.72. Faktisk mikrofonpresisjon og kalenderrettighet må testes på enheten.

## BenKen Web V26.71 – Calendar, venues, packing & tuner input fix

BRUK WEB V26.71 SAMMEN MED NATIVE V27.12
Bygg App/BenKenStagePro.xcodeproj fra Native V27.12-pakken på iPad/Mac.
Den gamle Native-appen får ikke den direkte mikrofonrettingen bare ved weboppdatering.
START TUNER skal nå be om mikrofontilgang direkte fra native-appen.
På iPad foretrekkes innebygd mikrofon. På Mac brukes systemets lydinngang.
Input level viser om det kommer signal. Stop / Done / bakgrunn stopper mikrofonen.
Mac-prosjektet har Audio Input-rettighet for hardened runtime.
Browser ber om mikrofon før den venter på AudioContext, og bruker en stille analyseutgang.
Virkelig mikrofon og avspilling etter tuning må prøves på fysisk enhet.

KALENDER
Kun i Settings → PLANNING: Calendar, Venues og Packing list. Ingen kalenderknapp i hovedbildet.
Calendar: legg til øving/konsert, dato, start/slutt, oppmøte, lydprøve, spillested, sett og låter.
Venues: Add venue med adresse, kontakt, telefon, e-post og scenenotater.
Packing list: mal kopieres til nye arrangementer. Legg til/fjern utstyr, juster antall,
og kryss av separat for Pack for the gig og Bring home.
Contract: egne arrangør-, honorar- og vilkårsfelt. CONTRACT DRAFT eksporterer et HTML-utkast
som kan åpnes og skrives ut / lagres som PDF. Ingen sending eller signering skjer automatisk.

Kalenderen lagres lokalt og følger med i bibliotekbackup. .ICS er manuell eksport,
ikke automatisk Apple/Google-synk. Google-import gjøres på datamaskin.
Felles bandkonto, invitasjoner og automatisk kalenderabonnement er ikke aktivert i denne versjonen.
Kontakter og kontraktsbeløp inkluderes ikke automatisk i .ics eller deling av låt/setliste.

MANUAL
Settings → Manual har nå 34 søkbare kapitler. manual.html er også inkludert for offline lesing/utskrift.

KONTROLL
133 automatiske kontroller (119 web / 14 native tuner-DSP og kommandohåndtering).
Native V27.12 bygger for Mac Catalyst og iPad-simulator. Mikrofonen er ikke fysisk testet.
UI testet med isolert bibliotek, testarrangement og simulert native-mikrofon.

REFERANSER
Apple mikrofontillatelse: https://support.apple.com/no-no/102213
Mac Audio Input: https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.security.device.audio-input
Google kalenderimport: https://support.google.com/calendar/answer/37118
Apple kalenderimport: https://support.apple.com/no-no/guide/calendar/icl1023/mac

## BenKen Web V26.70 – Find duplicates

Åpne Setlist → Library → FIND DUPLICATES.
Søket sammenligner tittel og artist, uavhengig av store/små bokstaver og ekstra mellomrom.
Velg KEEP for låten du vil beholde. Sammenlign lyrics, lydkoblinger, capo og notater.
REMOVE THIS COPY ber om bekreftelse. Setlistenes oppføringer peker deretter til låten
som beholdes; rekkefølge og autoplay-valg bevares. Innhold og mixerinnstillinger slås ikke sammen.
Lydfiler slettes ikke. UNDO LAST REMOVAL kan angre siste fjerning i denne appøkten,
forutsatt at biblioteket ikke er endret etterpå. Sletting sperres under avspilling eller Live-lås.

Bruk Native V27.11 for mikrofontuneren. Publiser alle webfilene sammen.
Kalender, pakkeliste og tuner er ikke lagt til i denne pakken.

TUNER OG MANUAL
Settings → Tuner → OPEN TUNER. Velg Tuner i CUSTOMIZE CONTROLS for en egen knapp.
Referanse A4 400–480 Hz, normalt 440 Hz. YIN-deteksjon. Start mikrofonen eksplisitt;
Stop, Done, bakgrunn og sidenavigasjon stopper den. Ingen opptak eller opplasting.
Native mikrofon krever V27.11; Browser kan brukes i en nettleser med mikrofontilgang.
Settings → Manual har 28 søkbare kapitler. manual.html er en egen lesbar/utskrivbar fil
og inkluderes i appens offline-cache.

TESTING
101 automatiske kontroller bestått (66 tidligere funksjoner + 29 duplikat-/tunerkontroller + 6 mikrofon-livsløpstester).
Mac Catalyst og iPad-simulator bygger. UI testet med syntetisk tone og isolert testbibliotek.
Virkelig mikrofon, Ui24R-inngang og lyd etter tuning må testes på Mac/iPad.

TEKNISKE REFERANSER
YIN: https://iro.umontreal.ca/~pift6080/H09/documents/papers/yin_pitch_tracker.pdf
Mikrofontilgang: https://developer.apple.com/documentation/bundleresources/information-property-list/nsmicrophoneusagedescription

## BenKen Web V26.68 – Bente capo er kun en påminnelse

Bente capo påvirker bare tallet som vises for henne. Den endrer aldri song key,
akkorder i lyrics eller lyd. Bente-menyen viser kun bånd 0–12, ingen grep.

Eksempel: Song key Cm, Bente capo 3, Kenneth capo 0:
- Song key viser Cm.
- Lyrics viser Cm, Fm osv.
- Bente capo viser 3.

Kenneth capo styrer fremdeles grepene som vises i lyrics. Kenneth capo 3 gjør
for eksempel Cm til Am-grep, mens song key fortsatt viser Cm.

SAVE BENTE CAPO lagrer kun Bente-posisjonen og beholder Kenneth-capo og toneart.
Song key og Kenneth har fremdeles tonearthjulet. Bente bruker et båndnummerhjul.
Tidligere Bente-referanse er bevart i sikkerhetskopier, men styrer ikke tonearten.
Eksisterende Bente-capo-tall beholdes.

Bruk fortsatt Native V27.10. Publiser alle webfilene sammen.
Sidekanten og capo-snarveien fra V26.67 er også rettet i denne pakken.

SHOW INFO er flyttet inn i toppfeltet, utenfor det rullende innholdet.

## BenKen Web V26.67 – Capo & layout fixes

Nytt i denne versjonen
- Hjulmenyen har egne valg: Song key, Kenneth capo og Bente capo.
  Velg en person for å bruke hjulet eller +/− til capo 0–12 og lagre uten
  å transponere lyd. Bente bruker den eksisterende Bente-referansen.
- Samme mørkegrå bakgrunn bak lyrics og sideknappene i Studio Black.
- #-snarveien åpner Settings → Capo & Key direkte, med det samme hjulet.
- Kenneth og Bente bruker de eksisterende sangfeltene, ingen separate capo-kopier.
- Hjulet velger tonearten som grunnlag. Bente endrer i forhold til Bente-referansen,
  og Kenneth velger grepene ved å trekke fra sin capo. Disse justeringene brukes sist.
- SAVE CAPO lagrer Kenneth/Bente/referanse uten å bruke en ny toneart fra hjulet
  eller endre lydens tonehøyde. USE TRANSPOSE bruker hele forhåndsvisningen.
- Gjenoppretting av en tidligere akkordversjon beholder dagens capo-verdier.

Bruk fortsatt Native V27.10. Publiser alle webfilene sammen.

Capo & Key
Samme editor åpnes fra #-knappen over Setlist og Settings → Capo & Key.
Velg toneart på kromatisk hjul eller kvintsirkel, eller bruk − / +.
Forhåndsvisningen viser akkordgrep med Kenneth/Bente capo og Bente-referanse.
Velg Auto, ♭ eller ♯ for notenavn. Lyrics / Chords / Both er lokale visningsvalg.

View only endrer akkordvisningen og beholder lydens tonehøyde.
Chords & audio bruker lydmotorens område −2 til +2 halvtoner.
Stopp avspilling før lydens toneart endres. USE TRANSPOSE lagrer valgene.
SAVE CHORDS AS skriver om akkordene og lagrer inntil fem tidligere versjoner.
Previous chord version → RESTORE gjenoppretter forrige versjon.
Lydendringen regnes bare én gang når akkordene skrives om.

Utseende og Controls
Felles høyde på knapper/felt og lik avstand i Settings og tilhørende menyer.
Device volume og buffer følger samme grafikk som resten av Settings.
Studio Black har mørkegrå lyrics-bakgrunn (#242424); egen valgt
bakgrunn under Personalization har prioritet.
Controls settings har en egen snarvei under Settings nederst til høyre.
Show Controls settings shortcut i CUSTOMIZE CONTROLS viser/skjuler snarveien.
Den gamle faste innstillingsknappen i avspillingsfeltet er fjernet fra visningen.
Controls-knappen viser/skjuler fortsatt avspillingsfeltet.

Metronom
Velg Soft beep, Wood block eller Bell i Count-in & metronome og trykk SAVE CLICK
SETTINGS. De samme tre lydtypene finnes i Browser og Native V27.10.
Flash Controls frame on the beat og Flash color lagres for denne enheten.
Rammen kan blinke under count-in og avspilling, også uten hørbar metronom.

Device volume og buffer
Øverst i Settings og under Audio & playback finnes Device volume.
På iPad med Native V27.10 vises Apples virkelige systemslider. Prosenten følger
både slideren og iPad-volumknappene. Save reference level lagrer ønsket nivå
lokalt som en referanse; det endrer ikke volum automatisk ved konsertstart.
Eksterne lydutganger kan ha sitt eget volum. Mac bruker Mac-/lydkortets volumkontroll.
Buffer viser ønsket og faktisk størrelse, frekvens og millisekunder. iPad kan be
om 256, 512 eller 1024 samples; standarden er fortsatt 1024. Mac viser faktisk
buffer fra standardlydenheten, og lar lydkortet/Mac styre størrelsen.
Fysisk iPad-test av systemslider, volumknapper, referansenivå og buffer gjenstår.

Deling med lyd
Settings → Share songs & setlists → Open sharing. Prosjektadressen og den
offentlige nøkkelen er lagt inn. Trykk SEND SIGN-IN EMAIL. Kopier innloggings-/bekreftelseslenken fra e-posten
uten å åpne den først, lim den inn i Code or sign-in link og trykk SIGN IN.
Velg så Current song eller
en setliste, velg 1 eller 7 dagers varighet, og last opp. Appen viser lenke og QR.
Lenken gir nedlastingstilgang til de delte låtene frem til utløp. QR lages lokalt.
Mottaker velger Add songs & audio; eksisterende bibliotek beholdes. Navnekollisjon
på setlister gir en ny '(shared 2)'-liste. Buser og mute-grupper remappes til ledige
plasser; import avvises før endringer dersom det ikke er nok ledige plasser.
QR åpner nettsiden. Open in BenKen app videresender til Native V27.10 via
benkenstagepro://share. Alternativt lim lenken inn under Receive a share i appen.
Native-mottak krever at webpakken også er publisert.

Lagring og feil
Store overføringer deles i nettbiter på opptil 24 MiB. Mottak bruker midlertidig
lokal fillagring der dette støttes, og kopierer så original lyd til appbiblioteket.
Uten slik lagring begrenses mottak til 256 MiB. Fullført import fungerer offline.
En avbrutt opplasting forsøker å rydde opp sine egne nettbiter. Delte filer ligger
fortsatt i lagringen etter lenkeutløp og kan slettes fra Storage senere; lenkeutløp
er ikke automatisk sletting eller frigjøring av kvote. Ingen automatisk betaling.

Kontrollert
50 webkontroller består, inkludert deling/QR/import med testlagring, store biter,
feilopprydding og vern av eksisterende låter. UI: Bente/Kenneth, toneart, alle tre
visninger, lydvalg og faktisk blinkklasse er prøvd med testsetliste og simulert
native-avspilling. Mottak med midlertidig fillagring og innlasting av
12 syntetiske lydfiler er også prøvd i nettleseren med lokal testserver; både
opprinnelig og mottatt setliste ble beholdt. Native: 30 tester, 29 kjørt og bestått, én opt-in hardwaretest
hoppet over. Begge Xcode-bygg består. Tre metronomlyder er rendret i stereo.
Privat lagring og opplastingsrett for prosjekteier er aktivert i Supabase.
Standard e-postmal er beholdt fordi gratisoppsettet ikke tillater egen tallkodemal.
Virkelig innlogging og opplasting/nedlasting fra appen må fortsatt prøves.

## BenKen Web V26.66 – Share, Key, Click & Device Audio

Bruk Native V27.10 for systemvolum, buffervalg og de nye native-metronomlydene.
Webdelen må publiseres sammen med alle filene i ZIP-pakken.

Capo & Key
Samme editor åpnes fra #-knappen over Setlist og Settings → Capo & Key.
Velg toneart på kromatisk hjul eller kvintsirkel, eller bruk − / +.
Forhåndsvisningen viser akkordgrep med Kenneth/Bente capo og Bente-referanse.
Velg Auto, ♭ eller ♯ for notenavn. Lyrics / Chords / Both er lokale visningsvalg.

View only endrer akkordvisningen og beholder lydens tonehøyde.
Chords & audio bruker lydmotorens område −2 til +2 halvtoner.
Stopp avspilling før lydens toneart endres. USE TRANSPOSE lagrer valgene.
SAVE CHORDS AS skriver om akkordene og lagrer inntil fem tidligere versjoner.
Previous chord version → RESTORE gjenoppretter forrige versjon.
Lydendringen regnes bare én gang når akkordene skrives om.

Utseende og Controls
Felles høyde på knapper/felt og lik avstand i Settings og tilhørende menyer.
Device volume og buffer følger samme grafikk som resten av Settings.
Studio Black har mørkegrå lyrics-bakgrunn (#242424); egen valgt
bakgrunn under Personalization har prioritet.
Controls settings har en egen snarvei under Settings nederst til høyre.
Show Controls settings shortcut i CUSTOMIZE CONTROLS viser/skjuler snarveien.
Den gamle faste innstillingsknappen i avspillingsfeltet er fjernet fra visningen.
Controls-knappen viser/skjuler fortsatt avspillingsfeltet.

Metronom
Velg Soft beep, Wood block eller Bell i Count-in & metronome og trykk SAVE CLICK
SETTINGS. De samme tre lydtypene finnes i Browser og Native V27.10.
Flash Controls frame on the beat og Flash color lagres for denne enheten.
Rammen kan blinke under count-in og avspilling, også uten hørbar metronom.

Device volume og buffer
Øverst i Settings og under Audio & playback finnes Device volume.
På iPad med Native V27.10 vises Apples virkelige systemslider. Prosenten følger
både slideren og iPad-volumknappene. Save reference level lagrer ønsket nivå
lokalt som en referanse; det endrer ikke volum automatisk ved konsertstart.
Eksterne lydutganger kan ha sitt eget volum. Mac bruker Mac-/lydkortets volumkontroll.
Buffer viser ønsket og faktisk størrelse, frekvens og millisekunder. iPad kan be
om 256, 512 eller 1024 samples; standarden er fortsatt 1024. Mac viser faktisk
buffer fra standardlydenheten, og lar lydkortet/Mac styre størrelsen.
Fysisk iPad-test av systemslider, volumknapper, referansenivå og buffer gjenstår.

Deling med lyd
Settings → Share songs & setlists → Open sharing. Prosjektadressen og den
offentlige nøkkelen er lagt inn. Trykk SEND SIGN-IN EMAIL. Kopier innloggings-/bekreftelseslenken fra e-posten
uten å åpne den først, lim den inn i Code or sign-in link og trykk SIGN IN.
Velg så Current song eller
en setliste, velg 1 eller 7 dagers varighet, og last opp. Appen viser lenke og QR.
Lenken gir nedlastingstilgang til de delte låtene frem til utløp. QR lages lokalt.
Mottaker velger Add songs & audio; eksisterende bibliotek beholdes. Navnekollisjon
på setlister gir en ny '(shared 2)'-liste. Buser og mute-grupper remappes til ledige
plasser; import avvises før endringer dersom det ikke er nok ledige plasser.
QR åpner nettsiden. Open in BenKen app videresender til Native V27.10 via
benkenstagepro://share. Alternativt lim lenken inn under Receive a share i appen.
Native-mottak krever at webpakken også er publisert.

Lagring og feil
Store overføringer deles i nettbiter på opptil 24 MiB. Mottak bruker midlertidig
lokal fillagring der dette støttes, og kopierer så original lyd til appbiblioteket.
Uten slik lagring begrenses mottak til 256 MiB. Fullført import fungerer offline.
En avbrutt opplasting forsøker å rydde opp sine egne nettbiter. Delte filer ligger
fortsatt i lagringen etter lenkeutløp og kan slettes fra Storage senere; lenkeutløp
er ikke automatisk sletting eller frigjøring av kvote. Ingen automatisk betaling.

Kontrollert
50 webkontroller består, inkludert deling/QR/import med testlagring, store biter,
feilopprydding og vern av eksisterende låter. UI: Bente/Kenneth, toneart, alle tre
visninger, lydvalg og faktisk blinkklasse er prøvd med testsetliste og simulert
native-avspilling. Mottak med midlertidig fillagring og innlasting av
12 syntetiske lydfiler er også prøvd i nettleseren med lokal testserver; både
opprinnelig og mottatt setliste ble beholdt. Native: 30 tester, 29 kjørt og bestått, én opt-in hardwaretest
hoppet over. Begge Xcode-bygg består. Tre metronomlyder er rendret i stereo.
Privat lagring og opplastingsrett for prosjekteier er aktivert i Supabase.
Standard e-postmal er beholdt fordi gratisoppsettet ikke tillater egen tallkodemal.
Virkelig innlogging og opplasting/nedlasting fra appen må fortsatt prøves.

## BenKen Web V26.65 – Share, Key, Click & Device Audio

Bruk Native V27.10 for systemvolum, buffervalg og de nye native-metronomlydene.
Webdelen må publiseres sammen med alle filene i ZIP-pakken.

Song key & capo
En egen #-knapp ligger over Setlist nederst til venstre. Den åpner sangtoneart,
Kenneth capo, Bente capo og Bente-referanse med dagens eksisterende logikk.
Toneartsvalget bruker lydmotorens område −2 til +2 halvtoner. Stopp avspilling
før lydens toneart endres. Original key er sangens registrerte opprinnelige toneart.
Lyrics / Chords / Both er lokale visningsvalg og kan skiftes under avspilling.

Metronom
Velg Soft beep, Wood block eller Bell i Count-in & metronome og trykk SAVE CLICK
SETTINGS. De samme tre lydtypene finnes i Browser og Native V27.10.
Flash Controls frame on the beat og Flash color lagres for denne enheten.
Rammen kan blinke under count-in og avspilling, også uten hørbar metronom.

Device volume og buffer
Øverst i Settings og under Audio & playback finnes Device volume.
På iPad med Native V27.10 vises Apples virkelige systemslider. Prosenten følger
både slideren og iPad-volumknappene. Save reference level lagrer ønsket nivå
lokalt som en referanse; det endrer ikke volum automatisk ved konsertstart.
Eksterne lydutganger kan ha sitt eget volum. Mac bruker Mac-/lydkortets volumkontroll.
Buffer viser ønsket og faktisk størrelse, frekvens og millisekunder. iPad kan be
om 256, 512 eller 1024 samples; standarden er fortsatt 1024. Mac viser faktisk
buffer fra standardlydenheten, og lar lydkortet/Mac styre størrelsen.
Fysisk iPad-test av systemslider, volumknapper, referansenivå og buffer gjenstår.

Deling med lyd
Settings → Share songs & setlists → Open sharing. Prosjektadressen og den
offentlige nøkkelen er lagt inn. Trykk SEND SIGN-IN EMAIL. Kopier innloggings-/bekreftelseslenken fra e-posten
uten å åpne den først, lim den inn i Code or sign-in link og trykk SIGN IN.
Velg så Current song eller
en setliste, velg 1 eller 7 dagers varighet, og last opp. Appen viser lenke og QR.
Lenken gir nedlastingstilgang til de delte låtene frem til utløp. QR lages lokalt.
Mottaker velger Add songs & audio; eksisterende bibliotek beholdes. Navnekollisjon
på setlister gir en ny '(shared 2)'-liste. Buser og mute-grupper remappes til ledige
plasser; import avvises før endringer dersom det ikke er nok ledige plasser.
QR åpner nettsiden. Open in BenKen app videresender til Native V27.10 via
benkenstagepro://share. Alternativt lim lenken inn under Receive a share i appen.
Native-mottak krever at webpakken også er publisert.

Lagring og feil
Store overføringer deles i nettbiter på opptil 24 MiB. Mottak bruker midlertidig
lokal fillagring der dette støttes, og kopierer så original lyd til appbiblioteket.
Uten slik lagring begrenses mottak til 256 MiB. Fullført import fungerer offline.
En avbrutt opplasting forsøker å rydde opp sine egne nettbiter. Delte filer ligger
fortsatt i lagringen etter lenkeutløp og kan slettes fra Storage senere; lenkeutløp
er ikke automatisk sletting eller frigjøring av kvote. Ingen automatisk betaling.

Kontrollert
50 webkontroller består, inkludert deling/QR/import med testlagring, store biter,
feilopprydding og vern av eksisterende låter. UI: Bente/Kenneth, toneart, alle tre
visninger, lydvalg og faktisk blinkklasse er prøvd med testsetliste og simulert
native-avspilling. Mottak med midlertidig fillagring og innlasting av
12 syntetiske lydfiler er også prøvd i nettleseren med lokal testserver; både
opprinnelig og mottatt setliste ble beholdt. Native: 30 tester, 29 kjørt og bestått, én opt-in hardwaretest
hoppet over. Begge Xcode-bygg består. Tre metronomlyder er rendret i stereo.
Privat lagring og opplastingsrett for prosjekteier er aktivert i Supabase.
Standard e-postmal er beholdt fordi gratisoppsettet ikke tillater egen tallkodemal.
Virkelig innlogging og opplasting/nedlasting fra appen må fortsatt prøves.

## BenKen Web V26.64 – Consistent Skins

Menyer, mikser, knapper, dialoger, setlist og Controls bruker nå samme grunnstil
som Settings. Faste grå flater fra V26.63 følger nå fargene i valgt skin.

Skins og egne farger
Bytte av skin endrer appens flater, felt, knapper, rammer og menytekst.
Alle Personalization-farger beholdes, også bakgrunnen i selve leseområdet.
Track- og bus-farger er egne valg og beholdes. Menytekst følger skinets kontrast
uavhengig av valgt tekstfarge i sangen. Light gir lyse menyer og mørk menytekst.
RESET TO CLASSIC nullstiller Personalization-fargene når du selv velger knappen.

Back og Done er større, også i Mixer Settings.
Controls har en skin-farget bakgrunn med 84 prosent dekning og en svakere,
delvis gjennomsiktig ramme. Knappene og teksten er tydelige.

Bruk
Last opp alle filene i denne webpakken til GitHub. Vent på vellykket Pages-
publisering og åpne appen igjen. Appen skal vise Web V26.64.
Fortsett med Native V27.9 i Xcode.

Kontrollert
27 eksisterende webkontroller og 10 målrettede skin-kontroller består.
Alle sju synlige skins er prøvd i lokal nettleser. Settings-farger og
Controls-farger skifter med skin; Personalization-fargefeltene beholdes.
Controls-bakgrunnen og rammen har bekreftet gjennomsiktighet i alle sju skins.
Studio Black og Light er visuelt kontrollert. Ingen konsollfeil under kontrollen.
Ingen automatisk publisering er utført.

## BenKen Web V26.63 – Clean Menus

Ny menystruktur
Settings starter med en kategorioversikt. Hver kategori åpner en egen side med
Settings-tilbakeknapp og Done. Valgene er samlet under Live & library,
Audio & playback, Display & controls og Connections & tools.
Undersidene har mørke grupperte rader, enklere felt og tydelige av/på-brytere.

Mixer Settings bruker samme struktur: Tracks, Buses & outputs, Mute groups,
Audio & files og Playback mode & mixer display. Tilbake går til kategorioversikten.
Done går tilbake til mikseren. Mikserfanene og kontrollfeltet skjules mens
innstillingene er åpne. Navn og ruting lagres som før.

Hovednavigasjon
Setlist er et lite listeikon nederst til venstre.
Settings, Mixer og Controls er tre symbolknapper loddrett nederst til høyre.
De store knappene øverst er fjernet. Symbolene har tilgjengelige navn og verktøytips.
Fargene og menyflatene er roligere, med mindre gradient og skygge.

Bruk
Pakk ut og last opp alle filene i denne webpakken til GitHub, inkludert de fire
benken-*-v26-63-filene. Vent på vellykket Pages-publisering og åpne appen igjen.
Bruk fortsatt Native V27.9 i Xcode. Denne leveransen er en oppdatering av webdelen.
Appen skal vise Web V26.63 etter oppdateringen.

Kontrollert
10 hovedmotor-kontroller, 13 regresjonskontroller og 4 Ready-kontroller består.
Alle 14 Settings-kategorier er prøvd med tilbakeknapp i lokal nettleser.
Mixer Settings-oversikt, Buses & outputs og Audio & files er prøvd.
Design er kontrollert ved 1280 × 720 og iPad-format 768 × 1024.
Ingen konsollfeil under kategoritesten. Native V27.9 er tidligere bekreftet med
lyd av brukeren på Mac og iPad. Lydmotoren er ikke endret i denne weboppdateringen.
Ingen automatisk publisering er utført.

## BenKen Web V26.62 – ryddigere Controls

Settings → Controls viser nå to oversiktlige felt: Fullscreen og Control bar.
Customize controls har seks vanlige valg øverst. Playback/lyrics, knapperekkefølge
og mute group-navn ligger i tre sammenfoldede seksjoner. SAVE CONTROLS er synlig.
Eksisterende valg og lagring er beholdt.

PREPARING vises mens lyd klargjøres. READY forsvinner etter to sekunder.
NEXT kan vises i fullskjerm. Controls kan beholdes synlig og vise bare knapper.

Med Native V27.8 eller nyere finnes Playback → NATIVE AUDIO STATUS. V27.9
viser også signalet etter Mac-mikseren og retter stereo-kanaltypen på Mac.
For lydrettingen må Native V27.9 bygges; weboppdatering alene er ikke nok.

Bruk
Web: pakk ut og last opp innholdet til GitHub. Vent på vellykket Pages-publisering.
Native: åpne BenKen_Native_V27_9_Mac_Stereo/App/BenKenStagePro.xcodeproj.
Velg My Mac (Mac Catalyst) eller iPad. Prøv Native i Practice / Stereo på Mac.
Native V27.9 virker også med Web V26.61, så Mac-lyden kan testes før webpublisering.

Kontrollert
27 webkontroller består. Ny Controls-visning er kontrollert lokalt i grensesnittet
med testbibliotek og simulerte native-svar. 29 native-tester og begge bygg består.
Mac-stereorettingen ga signal etter Mac-mikseren i faktisk hardwaretest; hørbar
lyd på brukerens Catalyst-app må fortsatt bekreftes.

Hovedmotoren er fortsatt en testutgave. Konsertkopi og hovedbibliotek er ennå
ikke samlet. Bølgeform, peak-målere, selvstendig metronom, FX og looper gjenstår.
Ingen publisering eller installasjon utføres automatisk.

## BenKen Web V26.61 / Native Test V27.7

Nytt i webdelen
- PREPARING vises mens lyd klargjøres.
- READY vises i to sekunder og forsvinner deretter. Feil som NOT READY skjules ikke av dette.
- NEXT vises som standard også i fullskjerm.
- Settings → Controls har egne valg for SHOW NEXT SONG IN FULLSCREEN og
  KEEP CONTROLS VISIBLE IN FULLSCREEN, samt en knapp for å åpne/forlate fullskjerm.
- De samme valgene finnes i Customize controls, der de lagres med SAVE CONTROLS.
- Fullskjerm kan kombineres med Buttons only. Kontroller forblir synlige og brukbare
  når toppmenyen skjules; teksten får plass over kontrollfeltet.
- Valgene lagres på denne enheten og beholdes etter ny åpning.

Mac-lyd: Native V27.7
Den nye native-testen bruker hovedmikseren til AVAudioEngine i Practice / Stereo på Mac.
Den lar stereoutgangen følge maskinens lydformat, i stedet for å koble 48 kHz-miksen
rett til hardwareutgangen. Dette er en mulig retting for at tidslinjen gikk uten lyd
på Mac. Det er ikke bekreftet med lyd på din fysiske Mac ennå.
Kodegrunnlag: https://developer.apple.com/documentation/avfaudio/avaudioengine/mainmixernode
48 kHz til 44,1 kHz stereokonvertering er kontrollert med ekte lydrendring uten høyttalere.
Direkte multikanals USB bruker fortsatt egen diskret ruting.
Native-protokollen er kompatibel med V27.6; for Mac-rettingen må V27.7 bygges.

Installer
1. Web: pakk ut ZIP-filen og last opp innholdet til GitHub. Vent på vellykket Pages-publisering.
2. Xcode: åpne prosjektet i BenKen_Native_V27_7_Mac_Audio/App/BenKenStagePro.xcodeproj.
   Kjør My Mac (Mac Catalyst) for Mac, eller velg iPad-en.
3. På Mac: Settings → Playback → Practice / Stereo og Engine → Native · main interface test.
   Prøv samme testlåt igjen. Kontroller både lyd, Pause og Stop.
4. Fullskjerm: Settings → Controls, velg ønsket Next/Controls-visning og OPEN FULLSCREEN.

Motorstatus
Hovedgrensesnittets native-motor er fortsatt en testutgave. Synk oppdaterer den separate
native-konsertkopien; hovedbiblioteket og konsertkopien er ennå ikke samlet.
Bølgeform, peak-målere, selvstendig metronom, FX og looper er ikke ferdig i hovedmotoren.
Test av ekte Ui24R-/MIDI-ruting, lang avspilling og fysisk Mac/iPad-lyd gjenstår.
Kontrollene bygger videre på V26.59; lydfiler, tempo og toneart er lokale native-kopier.
Ingen publisering eller installasjon er utført i denne leveransen.

Kontrollert
Mac Catalyst og iPad Simulator bygger; 28 native-tester består.
23 automatiske web-/overføringskontroller består, i tillegg til målrettet Ready-timingkontroll.
Fullskjerm med Controls og Next er kontrollert i lokal UI-forhåndsvisning med testbibliotek
og simulerte native-svar. Buttons only, synlighet etter ny åpning, og av/på for Next er kontrollert.
Se Verification i Native-pakken for bygglogger og nærmere teststatus.

## BenKen Web V26.60 – kompakte kontroller

- READY / PLAYING / PAUSED / COUNT-IN står nå sammen med NEXT over låttittelen.
- Den ekstra READY/NEXT-statuslinjen er fjernet fra Controls.
- Buttons only skjuler alle informasjonsrader, lydvarsler, tidslinje og count-in-visning
  inne i kontrollfeltet, slik at bare knapper står igjen. Dette gjelder også Mixer-dokken.
- Vanlig kontrollvisning har fortsatt tidslinje og tider. Manglende lyd blokkerer fortsatt Play.

Åpne Controls-innstillingene, slå på BUTTONS ONLY, og trykk SAVE CONTROLS.
Motor og synk er uendret. Native Test V27.6 kan beholdes; bare webfilene oppdateres.
Pakk ut og last opp innholdet i ZIP-filen til GitHub, ikke selve ZIP-filen.

## BenKen Stage Pro Web V26.58 – ett synkvalg

Settings → Concert / Sync viser nå bare:
- Setlist
- Sync from / to: Mac → iPad eller iPad → Mac
- Folder in use (trykk for å velge en annen mappe)
- SYNC og resultat/status

Synk krever Native Test V27.5 på begge enheter. Oppdater både webfilene og Xcode-appen.
På avsenderen klargjør SYNC automatisk konsertkopien og sender den til valgt mappe.
Det gamle OPEN / UPDATE CONCERT-steget er fjernet fra denne siden.
Velg samme iCloud Drive-mappe på begge enheter og samme retning.
På mottakeren følger setlisten avsenderens konsert; lokale manglende filer hindrer ikke mottak.
Etter vellykket synk beholdes valget og automatisk oppdatering mens appene er åpne og ledige.
Det er fortsatt én konsert om gangen per synkmappe, med én avsender.

Den separate native testavspilleren åpnes under Settings → Playback → OPEN NATIVE TEST PLAYER.
På en avsender tar den med gjeldende setliste uten å kreve en synkmappe. På en mottaker
åpnes den nedlastede konserten. Mottak er foreløpig til native-konsertkopien, ikke en
sammenslåing med hovedappens webbibliotek.

Fra V26.57 er Delete all tracks, valg for skjuling av manglende filer og samlet
oppstartsvarsel videreført. Skjuling gjør ikke manglende lyd avspillbar.

Last opp til GitHub
Pakk ut ZIP-filen og last opp innholdet, ikke selve ZIP-filen. Vent på grønn Pages-publisering.
Ingen publisering er utført her.

Kontrollert: 13 automatiske web-/overføringskontroller og lokal visuell forhåndsvisning
med testdata. Fysisk iPad/Ui24R og iCloud mellom to enheter gjenstår.

## BenKen Stage Pro – Web V26.57

Nytt under Mixer → Audio & Files
- DELETE ALL TRACKS fjerner alle lydspor fra den valgte låten etter bekreftelse.
  Tekst, regioner, låten og setlistene beholdes. Originalfiler i dine egne mapper
  endres ikke. Lyd som brukes av andre låter eller en lokal gjenopprettingskopi beholdes.
- SHOW MISSING FILES & WARNINGS kan slås av for å skjule manglende spor og
  gjentatte meldinger. Avspilling forblir sperret dersom nødvendige filer mangler.
- WARN ON STARTUP viser én samlet oversikt med låt, spor og filnavn ved oppstart.
  Begge visningsvalgene lagres på denne enheten.

Enklere konsert og synk
Settings → Concert / Sync samler valgene. Velg setlisten øverst.
I Native Test V27.4 vises OPEN / UPDATE CONCERT og SYNC WITH MAC / IPAD direkte.
Detaljert konsertkontroll og manuell eksport finnes under More options.
Webutgaven alene kan lagre en konsert med lyd. Mappesynk mellom Mac og iPad
krever den separate Native Test-appen V27.4 på begge enheter.

Last opp webutgaven
1. Pakk ut ZIP-filen.
2. Last opp innholdet (index.html, sw.js og de andre filene/mappen) til samme
   plass i GitHub som forrige webutgave. Ikke last opp selve ZIP-filen.
3. Vent til GitHub Pages-publiseringen er grønn før du åpner appen på nytt.
Dette er webdelen. Xcode-prosjektet ligger i den separate Native V27.4-pakken.
Ingen publisering er utført som del av denne leveransen.

Kontrollert
8 automatiske kontroller av filfjerning, manglende lyd og native-overføring bestått.
Skjuling av manglende spor, oppstartsvarsel og plassering over Controls er kontrollert
i nettleser. Fysisk iPad, Ui24R og synk mellom to enheter må testes av deg.

## BenKen Stage Pro V26.56

Ny webpakke med rettingene fra V26.55 og nye versjonsnavn for webfiler og mellomlager. Ingen endring av låter, lydfiler eller native-avspilleren.

Pakk ut ZIP-filen. Last opp alt innholdet, inkludert index.html og sw.js, i roten av det eksisterende GitHub-prosjektet. Velg Commit changes. Den nye opplastingen starter et nytt publiseringsforsøk; den kan ikke garantere at GitHubs publiseringstjeneste fullfører.

Appoverskriften viser V26.56 når publiseringen er ferdig og den nye siden er lastet.

## BenKen Stage Pro V26.55

Missing audio now reports song title, track and original filename in concert export, full backup, project export and Concert Check. All missing assets are checked before a backup is offered. Shared files list every affected song (up to 200 references in a report). Failed preparation says NOT READY instead of PREPARING.

Upload all web files together as usual. This web update also improves the hosted web part of BenKen Native Test.

Your original audio can remain in named song folders. A separate BenKen Sync folder is used by the native player for managed concert copies; do not manually move its internal assets or revision files. Source folder names alone do not reconnect missing local audio: use REAPER import or REPLACE FILE for the listed song. A disconnected Ui24R is a separate output check.

## BenKen Stage Pro V26.54

Practice settings now opens a dedicated Practice view.
Count-in & metronome is at the top; Tempo / Key remains collapsible below.
Controls is temporarily hidden while Settings is open and returns when Settings closes.
Flat lyric section labels from V26.53 are preserved.

Upload all contents to the existing app location as usual.

## BENKEN STAGE PRO V26.53 — PRACTICE AV/PÅ / REN TEKSTFLATE

PRACTICE SOM VALGFRI KNAPP
I Controls-oppsettet finnes nå «Practice mode on / off (count-in and
regions)». Knappen vises som PRACTICE når den legges til i kontrollfeltet.
Den legges ikke automatisk til i ditt oppsett.
1. Trykk CONTROLS-knappen i kontrollfeltet, eller Settings > Controls.
2. Velg Practice mode on / off i en ledig knapp-plass.
3. Trykk SAVE CONTROLS.

PRACTICE PÅ aktiverer regiontrykk og bruker de lagrede count-in-verdiene.
PRACTICE AV deaktiverer både låt-count-in, region-count-in og regionstart.
En aktiv øvingsrepetisjon eller pågående count-in avbrytes ved avslåing.
Vanlig musikkavspilling fortsetter hvis den allerede er i gang.
Verdier for count-in og regiontiming slettes ikke. Et lagret OFF-valg for
count-in forblir OFF også når Practice slås på.
Practice er avslått som standard på en enhet uten et tidligere lagret valg.
Dette er uavhengig av stereo/USB-utgangen og det separate metronomvalget.
Den eldre knappehandlingen for stereo/USB finnes fortsatt med tydeligere
navn, Output mode: Stereo / USB.

RYDDIGE MENYER
Concert og Practice er separate kategorier under Settings.
- Settings > Concert åpner konsertsjekk, konsertlås og reservepakke.
- Settings > Practice har ENABLE PRACTICE og åpner øvingsinnstillingene.
Den faste CONCERT / PRACTICE-knappen er fjernet fra kontrollfeltet.
Bare den valgfrie PRACTICE-knappen vises der når du har valgt den.
Knappen som åpner tilpassing av kontrollfeltet heter nå CONTROLS.
LIVE LOCK-indikatoren og opplåsing er fortsatt tilgjengelige når låsen er på.
Aktivering av LIVE LOCK slår Practice av. Practice kan ikke slås på mens
konsertlåsen er aktiv.

REN TEKSTFLATE
Bakgrunnsgradient, kanter og skygger er fjernet fra seksjonsnavnene i
sangteksten, også når de er klikkbare regionknapper. Dette fjerner stripene
bak for eksempel Verse, Bridge og Solo. Seksjonsfarger og tekstjustering
beholdes. Vanlige knapper, menyer og mikser beholder sin visuelle dybde.

INSTALLASJON
Ta sikkerhetskopi først. Pakk ut og last opp hele innholdet til roten av
kenhje/BenKenStagePro på GitHub, som tidligere. Ta med demo-mappen, ikke
selve ZIP-filen. Vent på publisering, åpne med internett og kontroller
V26.53. Ingen Xcode- eller REAPER-scriptendring kreves. Ikke slett appdata.

KONTROLL
67 automatiserte kontroller bestått: 57 for tidligere lyd/import/backup/
konsertfunksjoner og 10 for Practice-standard, count-in av/på, regionlås,
bevaring av count-in-verdier, avslutting av øving, lagringsfeil, konsertlås,
valgfrie knapper og menyoppbygging.
I nettleser er PRACTICE lagt til som valgfri knapp og beholdt etter ny
åpning. Practice på ga count-in og klikkbare regionnavn; Practice av fjernet
regiontrykk og startet vanlig avspilling uten count-in. Concert og Practice
vises under Settings. CONTROLS-teksten og fravær av fast kombinert knapp er
kontrollert. I Studio Black er seksjonsknappens faktiske bakgrunn, skygge
og tekstskygge kontrollert som «none», og kantbredden som 0.
Ingen fysisk iPad/Ui24R-test er utført her. Stabilitetsmodus fra tidligere
versjoner er beholdt: sømløs looping, EQ og masterkompressor er midlertidig
forbikoblet. Konsertpakker, lokal backup og øvrige V26.52-funksjoner beholdes.
Pakken er ikke publisert til GitHub av Codex.

## BENKEN STAGE PRO V26.52 — CONCERT / PRACTICE / BACKUP DEVICE

ÅPNE VERKTØYENE
Trykk CONCERT / PRACTICE i kontrollfeltet, eller Settings > Concert.
De fire hovedknappene øverst er beholdt. Studio Black og øvrige skins,
region-count-in og tidligere import-/backuprettinger er videreført.

1. CONCERT CHECK
Velg setlisten du skal bruke og trykk CHECK CONCERT.
Uten valgt setliste sjekkes hele biblioteket.
- Kontrollerer at alle refererte originalfiler finnes lokalt, uten å
  laste inn/dekode alle låtene samtidig.
- Sammenligner nødvendige USB-kanaler med kanalene lydsystemet eksponerer.
  Practice / Stereo vises som et punkt å kontrollere, ikke som bekreftet
  separat USB-ruting.
- Kontrollerer tilstedeværelse av MIDI-innganger hvis mappings er satt opp.
- Viser alder på lokal backup og kontrollerer hurtiglager for appfilene.
- Viser eksplisitt at fysisk patching, lydnivå, click/cue-isolasjon og
  pedalrespons må prøves med utstyret. En grønn filkontroll bekrefter ikke
  riktig fysisk mikserinngang eller avbruddsfri konsertdrift.
Kjør kontrollen på nytt etter endringer og på reserveenheten.

2. LIVE LOCK
ENABLE LIVE LOCK beskytter import, sletting, tekst-/sporredigering og
endring av lydutganger. Playback, låtvalg, nivåer, panorering og mute-
kontroller er tilgjengelige. Åpne redigeringsvinduer og aktive importer/
øving må avsluttes før låsen aktiveres.
Låsen vises tydelig i kontrollfeltet og huskes etter ny åpning.
LIVE LOCK · UNLOCK eller UNLOCK EDITING åpner for redigering igjen etter
bekreftelse. Opplåsing stopper ikke avspillingen.

4. STATUS OG OVERGANGER
Kontrollfeltet viser klargjøring, klar, opptelling, avspilling eller pause,
samt neste låt og AUTO/MANUAL. Ved autoplay vises klargjøring og nedtelling.
Concert Check-panelet har en valgfri ekstra autoplay-pause på 0/3/5/10 s.
Pausen starter etter at neste låt er klargjort. Deretter gjelder eventuell
vanlig count-in før låten. Den samlede overgangen kan altså ta lengre tid
enn den valgte pausen. Manuell stopp eller nytt låtvalg avbryter ventingen.
Dette er ikke sømløs/gapless avspilling.

6. PRACTICE
Velg en tidsfestet region fra REAPER eller SYNC LYRICS. Klargjør lyden først.
Velg én, to, tre eller fem gjennomspillinger og pause på 0/2/5/10 s.
PLAY SELECTED REGION bruker den lagrede region-count-in fra Tempo.
Hver gjennomspilling stopper ved slutten av regionen. Den neste starter
etter valgt pause og en ny opptelling. Første start følger eventuell
Double-tap Play-beskyttelse; de bestilte repetisjonene krever ikke nye trykk.
STOP PRACTICE avbryter øvelsen. Vanlig manuell transport eller låtbytte
avslutter også repetisjonsplanen. Avsluttet øving starter ikke autoplay.
Under TEMPO / KEY / COUNT-IN finnes de samme tempo-, tonearts- og klikk-
kontrollene som i mikseren. Det er ett felles sett kontroller og verdier.
Øvingsvisningen har kontrollerte pauser mellom runder, ikke sømløs looping.

5. BACKUP DEVICE — KONsertpakke MED LYD
1. Velg ønsket setliste før du åpner verktøyet.
2. Velg BACKUP DEVICE > EXPORT CONCERT WITH AUDIO.
3. Trykk PREPARE PART og DOWNLOAD PART. Lagre alle nummererte deler sammen.
   Store konserter får flere deler. Filnavnet begynner med BenKen_Concert.
4. På Mac: åpne samme publiserte BenKen-versjon i nettleseren/appen. Bruk
   Backup > Restore full backup og velg alle delene fra denne eksporten.
5. Kontroller mottakerens utgangsmodus, MIDI og klikkutgang, kjør Concert
   Check og prøv hele oppsettet med det faktiske reserveutstyret.
Pakken tar med valgt setliste, alle dens låter, tekster, original lyd,
sporruting, nivåer og innstillinger. Gjentatte oppføringer av samme låt og
AUTO-valgene per oppføring bevares. Ubrukte låter utelates. Uten valgt
setliste eksporteres hele biblioteket.
Standard gjenoppretting beholder mottakerens enhetsvalg som utgang/MIDI/
Controls. Bruk eksisterende valg for gjenoppretting av enhetsinnstillinger
hvis du bevisst vil erstatte dem. Kontroller alltid rutingen på mottakeren.
Pakken inneholder konsertdata, ikke et nytt native Mac-program. Det er ingen
automatisk overtakelse eller automatisk synkronisering mellom enhetene.

INSTALLASJON AV V26.52
Ta full sikkerhetskopi av dagens oppsett først. Pakk ut og last opp hele
innholdet til roten av eksisterende kenhje/BenKenStagePro på GitHub, som
før. Ta med demo-mappen, ikke selve ZIP-filen. Vent på publisering og
kontroller V26.52 ved åpning med internett. La offline-oppdateringen fullføres.
Ingen Xcode- eller REAPER-scriptendring kreves. Ikke slett appdata.
Eksisterende Web Audio-motor brukes fortsatt. Stabilitetsmodus er beholdt:
sømløs regionlooping, spor-EQ og masterkompressor er fortsatt forbikoblet.
Denne øvingsfunksjonen bruker planlagt stopp/start i den eksisterende motoren.

VERIFIKASJON OG VIDERE PRØVE
57 automatiserte kontroller bestått: 19 for tidligere lyd/import/count-in,
18 for lokal backup og 20 for konsertsjekk, pakkeutvalg, setlistrekkefølge,
MIDI-/USB-krav, autoplay-forsinkelse og avbrudd, planlagt regionstopp,
normal avspilling uten regionstopp, låst import/gjenoppretting, første
Play-bekreftelse og komplett/ufullstendig flerparts-gjenoppretting.
I nettleser fullførte en stille testlåt tre runder med to takters count-in
og to sekunders pause. Sletting og mikserredigering ble blokkert under
LIVE LOCK, mens Play og Stop fungerte. En faktisk konsertfil med to lydfiler
ble lastet ned og kontrollert. Tempo ble flyttet inn i øvingspanelet og
returnerte riktig til mikseren etter lukking. Layout er kontrollert i
1024x768 og 768x1024. Appskallet/offline-beredskap ble ikke bekreftet av den
lokale testnettleseren, og ble vist som et kontrollpunkt i sjekken.
Ingen fysisk iPad/Ui24R-/MIDI-prøve, full reserve-Mac-oppsetting eller lang
konsertprøve er utført her. Test dette før livebruk. Ingen ny garanti om
stabilitet eller årsak til det tidligere iPad-stoppet er dokumentert.
Pakken er ikke publisert til GitHub av Codex.

## BENKEN STAGE PRO V26.51 — STUDIO BLACK

Nytt app-skin inspirert av mørke fotoredigeringsprogrammer:
nesten svart bakgrunn, nøytrale mørkegrå paneler og knapper, lysegrå
aktive valg og lys tekst. Svake gradienter, lyskanter og skygger beholdes.
Seksjonsfargene har dempede toner. Spor-, buss- og låtfarger er separate.

Velg SETTINGS > PERSONALIZATION > APP SKIN > Studio Black.
Dette er et ekstra valg; eksisterende skin byttes ikke ved oppdatering.
Valget er kontrollert i nettleser og beholdes etter ny åpning.

INSTALLASJON
Pakk ut og last opp innholdet til roten av eksisterende
kenhje/BenKenStagePro på GitHub, som tidligere. Ta med demo-mappen,
ikke selve ZIP-filen. Vent på publisering og kontroller V26.51.
Ingen Xcode- eller REAPER-scriptendring kreves. Ikke slett appdata.

Kun nytt skin og versjonsreferanser er endret fra V26.50.
Lydfunksjoner, region-count-in, backup og menyoppsett videreføres.
Stabilitetsmodus er fortsatt aktiv: regionlooping, EQ og masterkompressor
er midlertidig forbikoblet. Ingen fysisk iPad/Ui24R-test er utført her.
Pakken er ikke publisert til GitHub av Codex.

## BENKEN STAGE PRO V26.50 — CONTROLS / CENTERED MENU

- De fire hovedknappene øverst er midtstilt på skjermen.
- Settings-knappen i Controls har samme høyde, ikonstil, tekststil,
  gradient og skygge som de andre kontrollknappene.
- Knappen åpner fortsatt Customize controls. Icons Only skjuler teksten.

Kontrollert i nettleser: midtpunkt ved 1280 og 1024 pikslers bredde,
lik knapphøyde og åpning av kontrollinnstillinger. Dette er en visuell
oppdatering; runtime-logikken er identisk med V26.49 bortsett fra versjon.
Ingen fysisk iPad/Ui24R-test er utført for denne pakken.

INSTALLASJON
Pakk ut og last opp innholdet til roten av eksisterende
kenhje/BenKenStagePro på GitHub, som tidligere. Ta med demo-mappen og
ikke selve ZIP-filen. Vent på publisering, åpne appen med internett og
kontroller V26.50. Ingen Xcode- eller REAPER-scriptendring kreves.
Ikke slett appen eller tøm nettsteddata.

Ukentlig lokal backup, tre gjenopprettingskopier og beskyttelse av deres
lydfiler fra V26.49 videreføres. Lokale kopier blir på samme enhet; bruk
FULL BACKUP for Mac/iCloud. Region-count-in og øvrige endringer beholdes.
Stabilitetsmodus er fortsatt aktiv: regionlooping, EQ og masterkompressor
er midlertidig forbikoblet. Pakken er ikke publisert til GitHub av Codex.

## BENKEN STAGE PRO V26.49 — SETTINGS / LOCAL AUTO BACKUP

INNSTILLINGER
- Live sync er fjernet fra Tools-menyen.
- Lyrics starter med EDIT SONG, EDIT LYRICS og SYNC LYRICS, over akkordvalg.
- Sets, New Set og Add Songs ligger øverst i Setlist.
- Network heter SHARE LYRICS. Inne i panelet brukes fortsatt Host / Follow.
- Playback mode ligger først under Playback.
- Backup er delt i full backup med lyd, automatisk lokal backup og en
  sammenleggbar gruppe for prosjekter og tekstimport/-eksport.
- Lyrics-valget TAP SECTION TO PLAY er kontrollert og tilkoblet korrekt.
- Utseendet, region count-in og importrettingene fra tidligere versjoner
  er videreført.

AUTOMATISK LOKAL BACKUP
Ukentlig lokal backup er standard, slik brukeren valgte. Kan slås av med
Schedule > OFF. Første kopi tas når det finnes låter og appen er åpen og
i ro. Deretter kontrolleres om det har gått en uke. Hvis appen har vært
lukket eller opptatt, tas neste kopi når appen igjen er åpen og i ro.
Det er ikke en garantert bakgrunnsjobb når iPad-appen er lukket.

Tre gjenopprettingskopier beholdes med bibliotek, setlister og innstillinger.
Originale lydfiler beholdes lokalt så lenge en av kopiene trenger dem.
REAPER-erstatningsimport og filopprydding får derfor ikke slette lyd som
brukes av en bevart kopi. Når eldste kopi utgår, kan dens lydfiler ryddes
bort dersom de heller ikke brukes av biblioteket eller andre kopier.
Det lages ingen nye dekodede lydkopier under denne sikkerhetskopieringen.

BACK UP NOW lager en kopi med en gang mens avspillingen er stoppet.
Velg en kopi og RESTORE SELECTED COPY for å gjenopprette bibliotek og
setlister. Lydfilene kontrolleres først. Appen ber om bekreftelse og tilbyr
tekstbackup av nåværende bibliotek før gjenoppretting. Enhetens gjeldende
utgang/MIDI/Controls og innstilling for autobackup beholdes.

Kopiene og lyden ligger på samme enhet. De er ikke eksportert til Mac,
iCloud eller Files og følger ikke med hvis appdata slettes. Bruk CREATE
FULL BACKUP øverst for uavhengige filer som kan overføres til Mac/iCloud.
Vanlig automatisk lagring og recovery-drafts finnes fortsatt separat.

INSTALLASJON
Ta full sikkerhetskopi først. Pakk ut ZIP-filen og last opp innholdet til
roten av eksisterende kenhje/BenKenStagePro på GitHub. Erstatt filer med
samme navn, og ta med demo-mappen. Ikke last opp selve ZIP-filen.
Vent på publisering, åpne appen med internett og kontroller V26.49.
La offline-oppdateringen fullføres før du bytter til miksernettverket.
Ingen Xcode- eller REAPER-scriptendring kreves. Ikke slett appen eller
tøm nettsteddata. Eksisterende lyd-database og dens skjema beholdes.
Gjenopprettingspunktene bruker en egen lokal database.

KONTROLL
37 automatiserte kontroller bestått: 19 for tidligere lyd/import/count-in
og 18 for lokale kopier, ukeintervall, lydfilbeskyttelse, tre kopier,
opprydding, feil, samtidige forespørsler og gjenoppretting.
I nettleser ble en kopi med to lydfiler lagret. Testlåtens navn ble endret
og gjenopprettet fra kopien. Kopien var fortsatt tilgjengelig etter ny
åpning. Lyrics-redigering og regiontrykkvalget ble prøvd. Rekkefølgen i
Playback og Setlist, nytt navn og fravær av Live sync ble kontrollert.
Backup ble visuelt kontrollert i 768x1024 og nederste gjenopprettingsknapp
ble kontrollert over Controls ved 1024x768. Ingen fysisk iPad/Ui24R-test
eller lang konsertprøve er utført her. Stabilitetsmodus er fortsatt aktiv:
regionlooping, spor-EQ og masterkompressor er midlertidig forbikoblet.
Pakken er ikke publisert til GitHub av Codex.

## BENKEN STAGE PRO V26.48 — VISUAL POLISH

UTSEENDE
- Svak gradient, lyskant øverst og liten skygge på knapper.
- Egen trykket tilstand og roligere skygge på deaktiverte knapper.
- Svak gradient bak menyer, Settings og kontrollfeltet.
- Diskret dybde på valg og tekstfelt i Settings.
- Svakt sidelys på mikserstriper og lyskant rundt mikservinduet.
- Aktive valg beholder profilfargen. Fargeprøver beholder sine farger.
- Tastaturfokus har en tydelig markering.

Dette er en visuell oppdatering av V26.47. Knappeplassering, størrelser,
lydlogikk, count-in, import og lagring er beholdt. Region count-in og
SHOW INFO fra V26.47 er med. Ingen ny lydprosessering eller animasjon.

INSTALLASJON
Ta sikkerhetskopi først. Pakk ut ZIP-filen og last opp innholdet til roten
av eksisterende kenhje/BenKenStagePro på GitHub. Erstatt matching filer og
ta med demo-mappen. Ikke last opp selve ZIP-filen. Vent på publisering,
åpne appen med internett og kontroller V26.48. La offline-oppdateringen
fullføres før du bytter til miksernettverket.
Ingen Xcode- eller REAPER-scriptendring kreves. Ikke slett appen eller
tøm nettsteddata. Pakken er ikke publisert til GitHub av Codex.

KONTROLL
Visuelt gjennomgått i nettleser med Classic og Light, Settings og mikser
med importert testlåt. Knappens faktiske gradient og skygge er kontrollert,
samt aktiv profilfarge og avstand over Controls ved 1024x768.
JavaScript, HTML og offline-filreferanser er kontrollert. Koden for
avspilling er identisk med V26.47 bortsett fra versjonsnummer og filnavn.
Ingen fysisk iPad/Ui24R-test eller lang konsertprøve er utført her.
Stabilitetsmodus er fortsatt aktiv: regionlooping, spor-EQ og master-
kompressor er midlertidig forbikoblet; lagrede FX-verdier beholdes.

## BENKEN STAGE PRO V26.47 — REGION COUNT-IN / SHOW INFO

NYTT UNDER MIXER > TEMPO
- TAP REGIONS TO PLAY kan slås av og på direkte under Tempo.
- Count-in before tapped region: OFF / 2 BARS / 4 BARS.
  Valget lagres umiddelbart for den valgte låten.
- Trykk på en tidsfestet region i teksten eller regionfeltet for å starte
  ved regionens start etter opptellingen. Et nytt regiontrykk starter en
  ny opptelling hvis hopping under avspilling er tillatt.
- Bruker samme BPM, beats per bar, klikkvolum og utgang som metronomen.
  Slå på Audible count-in og trykk SAVE CLICK SETTINGS for hørbar telling.
  Uten dette valget får du visuell opptelling og tilsvarende ventetid.
- Count-in before song er fortsatt et separat valg. Vanlig søking og
  fortsettelse etter pause får ikke automatisk regionopptelling.
- Krever tidsfestede regioner fra REAPER eller SYNC LYRICS.

MINDRE HJELPETEKST
Øverst i Settings finnes SHOW INFO. Uten hake skjules ekstra hjelpetekst
fra Settings, Tempo og enkelte oppsettsflater. Status, feil og kontroller
beholdes. Kompakt visning er standard. Valget lagres på enheten.

PLASS TIL KONTROLLER
Tempo-innholdet kan rulles over det separate kontrollfeltet. Kontrollfeltet
har begrenset høyde, og nederste innstillinger/lagreknapper kan rulles frem.
Visuelt kontrollert i nettleser ved 1024x768, 768x1024 og smal Settings-
visning ved 390x844. Dette er skjermstørrelser, ikke en fysisk iPad-test.

INSTALLASJON
1. Ta sikkerhetskopi med dagens app først.
2. Pakk ut og last opp innholdet i ZIP-filen til roten av eksisterende
   kenhje/BenKenStagePro på GitHub. Erstatt filer med samme navn, og ta
   med demo-mappen. Ikke last opp selve ZIP-filen.
3. Vent til GitHub har publisert. Åpne BenKen med internett, og kontroller
   V26.47. Lukk og åpne appen på nytt ved behov.
4. La offline-oppdateringen fullføres før du bytter til miksernettverket.
Ingen Xcode- eller REAPER-scriptendring er nødvendig. Ikke slett appen
eller tøm nettsteddata. Lagringsnøkler og databaseskjema er beholdt.

BEHOLDT
Importrettingene fra V26.46 er videreført: gammel lyd slippes før REAPER-
kopiering, kontrollert lyd gjenbrukes etter import, og pågående dekoding
får avslutte før neste låt dekodes. Stabilitetsmodus fra V26.45 er fortsatt
aktiv: regionlooping, EQ og masterkompressor er midlertidig forbikoblet.
Regiontrykk med opptelling krever ikke regionlooping eller nye lydeffekter.

VERIFIKASJON
19 automatiserte kontroller bestått, inkludert tidligere import/dekoding,
regionopptelling OFF/2/4, oppstart fra valgt region, vanlig søking uten
opptelling, hoppsperre, hørbare taktslag, ugyldig klikkutgang og pakkefiler.
I nettleser ble en stille testlåt importert og CHORUS ved 00:05 startet
med COUNT-IN 1 / 2. Innstillinger ble kontrollert etter ny åpning.
SHOW INFO ble slått av/på. Rulling og avstand over kontrollfeltet ble
kontrollert i stående/liggende visning, inkludert nederste lagreknapp.
Hørbar klikkplanlegging ble kontrollert med modeller, ikke fysisk lydkort.
Ingen fysisk iPad/Ui24R-, MIDI- eller langvarig konsertprøve er utført her.
Pakken er ikke publisert til GitHub av Codex. Stoppet på brukerens iPad
er fortsatt ikke gjenskapt eller bekreftet løst.

## BENKEN STAGE PRO V26.46 — REAPER IMPORT / SONG SWITCHING

Dette er en oppdatering av webfilene i V26.45.

ENDRINGER
- Gammel avspillingslyd slippes før nye REAPER-stems kopieres inn.
- REAPER-import kontrollerer fortsatt lyden før låten lagres. Ferdig
  klargjort lyd gjenbrukes etter lagring hvis spor, tempo og toneendring
  fortsatt er identiske. Dermed unngås en ekstra full lydklargjøring.
- Ved avbrutt innlasting venter neste låt på at WebKits pågående
  lyddekoding faktisk avsluttes. En avbrutt JavaScript-operasjon kan ikke
  i seg selv stoppe denne dekodingen. Mellomliggende låtvalg droppes.
- Ny versjon på webfiler og offline-cache hindrer blanding med V26.45.

Dette er tiltak mot bekreftet unødvendig arbeid og overlappende dekoding.
Årsaken til det rapporterte iPad-stoppet er ikke bevist. Denne pakken er
ikke en overgang til AVAudioEngine og garanterer ikke avbruddsfri lyd.

INSTALLASJON
1. Ta sikkerhetskopi av bibliotek og lokale lydfiler med dagens app først.
2. Pakk ut ZIP-filen og last opp innholdet til roten av ditt eksisterende
   kenhje/BenKenStagePro-repository. Erstatt index.html, sw.js og andre
   filer med samme navn. Behold demo-mappen. Ikke last opp selve ZIP-filen.
3. Vent til GitHub-siden er publisert. Åpne appen med internett, og lukk
   og åpne appen på nytt om nødvendig. Kontroller at den viser V26.46.
4. La oppdateringen for frakoblet bruk fullføres før du bytter til
   mikserens nettverk.

Ingen Xcode-, Swift- eller REAPER-scriptendring kreves for denne pakken.
Ikke slett appen eller tøm nettsteddata. Lagringsnøkler og databaseskjema
er beholdt. Gamle versjonerte webfiler kan ligge igjen på GitHub.

BEHOLDT FRA V26.45
Stabilitetsmodus er fortsatt aktiv: regionlooping, spor-EQ og master-
kompressor er midlertidig forbikoblet. Lagrede FX-verdier beholdes.
Vanlig avspilling, lokale lydfiler, ruting, nivåer, mutegrupper, MIDI,
REAPER-import, tempo/toneendring og Host/Follow videreføres.

TEST PÅ IPAD
1. Spill en låt og stopp den. Importer en ny REAPER-versjon av samme låt,
   og velg å oppdatere eksisterende låt.
2. Kontroller at nye lydfiler og regioner er riktige, og at tekst, nivåer
   og ruting er som forventet.
3. Spill låten og bytt flere ganger mellom ulike låter. Prøv også å velge
   neste låt før klargjøringen av den forrige er ferdig. Bare siste valg
   skal bli klart for avspilling.
4. Gjenta erstatningsimporten noen ganger. Test deretter en hel settliste
   med det faktiske lydkortet og MIDI-utstyret, også uten internett.
5. Hvis feilen kommer igjen, noter låt, antall stems, omtrent når stoppet
   kom, og om det skjedde ved import, klargjøring eller avspilling.

VERIFIKASJON
11 automatiserte kontroller bestått: dekodingsrekkefølge ved raske bytter,
feil fra pågående dekoder, gjenbruk av lyd etter transportreset, endrede
spor/tempo, manglende lyd, uferdig klargjøring, REAPER-importrekkefølge,
tilbakerulling ved lagringsfeil/lydfeil og pakkens JavaScript/offline-filer.
Kontrollene bruker modeller av lyddekoder, lagring og importens UI-grenser.
Dette er ikke en fysisk minnemåling, full nettlesertest eller iPad/Ui24R-test.
Pakken er ikke publisert til GitHub av Codex.

## BENKEN STAGE PRO V26.45 — AUDIO STABILITY

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

## BENKEN STAGE PRO V26.44 — LOOP PLAY AND GRAPHIC AUDIO FX

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

## BENKEN STAGE PRO V26.43 — REGION LOOP, TRACK EQ AND MASTER COMPRESSOR

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

## BENKEN STAGE PRO V26.42 — SEKSJONSKNAPPER FOR BERØRING

OPPDATERING
Pakk ut ZIP-filen. Last opp innholdet til rotmappen i ditt eksisterende
kenhje/BenKenStagePro-repository på GitHub, og erstatt filer med samme navn.
Ta også med demo/. Ikke last opp ZIP-filen eller slett gamle prosjektfiler.
Åpne BenKen med internett etter at GitHub-publiseringen er ferdig. Mixeren
skal vise V26.42. Lukk og åpne appen igjen hvis forrige versjon fortsatt vises.
Ingen Xcode-, Swift- eller REAPER Lua-oppdatering trengs.
Ikke slett appen eller nullstill lagringen.

TEST SEKSJONSAVSPILLING
1. Kontroller V26.42 i mixeren.
2. Slå på TAP SECTION TO PLAY i SETTINGS > LYRICS eller under CONTROLS.
3. Velg en sang med klargjort lyd og regioner fra REAPER eller SYNC LYRICS.
4. Trykk på seksjonsoverskriften i teksten, for eksempel Chorus.
5. Med WAVEFORM synlig: trykk på seksjonsnavnet i den fargede raden øverst.
   Feltet under navneraden brukes fortsatt til å dra avspillingsmarkøren.

Har du DOUBLE-TAP PLAY på, trykker du to ganger på samme seksjon for å
starte fra stopp. ALLOW SEEKING DURING PLAYBACK må være på for å hoppe
mens musikken spiller. Seksjonshopp starter uten en ny count-in.

ENDRET
Tekstoverskrifter og waveform-seksjoner har nå egne, vanlige knapper.
Navneraden har 44 px trykkhøyde og ligger atskilt fra waveform-skyveren.
Et kort trykk starter ved slipp og trenger ikke et ekstra klikk etterpå.
Et etterfølgende klikk starter ikke lyden på nytt. Gammelt tekstvalg andre
steder på siden blokkerer ikke et bevisst trykk på en seksjonsknapp.

Scroll, avbrutt berøring og lange trykk starter ikke musikk. En seksjonsknapp
kan brukes direkte i fullscreen. Vanlige trykk andre steder viser fortsatt
kontrollene. Manglende seksjonstid, avslått funksjon og seek-sperre gir nå
beskjed i kontrollfeltet, i stedet for å ignorere trykket uten forklaring.

BEHOLDT
REAPER-import med avhuking av spor, regionfarger fra Personalization eller
REAPER, kompakte Tracks/Buses, like filknapper, Autoplay, multitrack,
USB-ruting, mono-standard, mute groups, MIDI, backup, offline og Host/Follow.
Samme lokale lagring og native LAN-protokoll 26.37 / følgerside 26.37.1.

KONTROLL
To interaksjoner som ble blokkert i V26.41 er gjenskapt i modelltester:
berøring uten etterfølgende klikk og et gammelt tekstvalg. De samme
interaksjonene starter riktig seksjon i V26.42. Nye kontroller dekker
scroll, kansellering, langt trykk, dobbeltrykk og sangbytte under berøring.
Fysiske iPad-/Safari-trykk er ikke testet her og må bekreftes på enheten.

VERIFICATION
349 JavaScript/model checks and 1 dedicated CSS layout check passed (350 total).
Two blocked V26.41 interactions were reproduced and passed with V26.42.
Native source, audio processing and storage schema are unchanged.
A browser binary could not be downloaded in this environment; no physical
iPad/Safari or full browser interaction testing is claimed. Not deployed.

## BENKEN STAGE PRO V26.41 — REAPER, REGIONFARGER OG SEKSJONSSTART

OPPDATERING
Pakk ut ZIP-filen. Last opp innholdet til rotmappen i ditt eksisterende
kenhje/BenKenStagePro-repository på GitHub, og erstatt filer med samme navn.
Ta også med demo/. Ikke last opp ZIP-filen eller slett gamle prosjektfiler.
Åpne BenKen med internett etter at GitHub-publiseringen er ferdig. Mixeren
skal vise V26.41. Lukk og åpne appen igjen hvis forrige versjon fortsatt vises.
Ingen Xcode-, Swift- eller REAPER Lua-oppdatering trengs denne gangen.
Ikke slett appen eller nullstill lagringen.

VELG SPOR
1. Åpne MIXER > MIXER SETTINGS > AUDIO & FILES.
2. Trykk IMPORT / UPDATE FROM REAPER og velg den eksporterte .benken-filen.
3. Alle spor er avhuket som standard, hver gang du åpner en eksport.
4. Fjern avhukingen ved spor du ikke vil importere. All stems velger alle
   eller ingen. Telleren viser hvor mange som er valgt.
5. Velg eksisterende sang og UPDATE SONG, eller ADD AS NEW SONG.

Bare valgte spor kopieres til lokal lydlagring og legges til eller erstattes.
Ved UPDATE SONG beholdes lydfiler, navn, farge, ruting, nivå og mute groups
for spor som ikke er valgt. Koblingen til deres REAPER-spor beholdes også,
slik at de kan oppdateres automatisk ved en senere import.
Ved ADD AS NEW SONG får den nye sangen bare de valgte sporene.
Avhukingen beholdes hvis du bytter målsang i samme importvindu.
Neste gang du åpner importvinduet, er alle spor valgt igjen.

REGIONER OG TEKST
Use REAPER regions og Sync lyric section headings fungerer uavhengig av
sporvalget. Velg ingen spor hvis du bare vil oppdatere regioner og tekst.
En eksisterende sang beholder da alle sine lokale lydfiler.
Regionvalg, tekstinnhold og seksjonskoblinger følger samme regler som før.

REGIONFARGER
SETTINGS > PERSONALIZATION har valget
OVERRIDE REAPER REGION COLORS WITH PERSONALIZATION.
Det er slått på som standard: Chorus, Verse, Intro osv. bruker de samme
seksjonsfargene i waveform og teksten. Endre fargene i Personalization.
Valget og dine egne farger beholdes når du oppdaterer en låt fra REAPER.

Slå av overstyringen for å bruke de eksporterte REAPER-regionfargene.
Da følger både waveform og tilkoblede tekstoverskrifter fargene fra REAPER,
og en senere REAPER-oppdatering henter nye farger fra prosjektet.
Originale regionfarger beholdes i låtdataene også mens overstyringen er på.
Dette velger visningsfarger i BenKen; det endrer ikke REAPER-prosjektet.

SPILL FRA EN SEKSJON
Slå på TAP SECTION TO PLAY i SETTINGS > LYRICS eller under CONTROLS.
Da kan du trykke på en tidskoblet tekstoverskrift eller på seksjonsnavnet
øverst i waveform for å starte avspilling fra seksjonens begynnelse.
Under avspilling hopper lyden til den valgte seksjonen og fortsetter.
Vanlig draing i bølgeformen fungerer fortsatt under navnefeltet.

Lyden må være klargjort, og seksjonen må ha en starttid fra REAPER-regioner
eller SYNC LYRICS. Lagret tempo tas med i starttidene. Seksjonshopp starter
musikken direkte fra delen, uten en ny count-in. Alle spor følger hoppet.
Valget er av som standard og lagres på enheten. Sperren for seeking under
avspilling gjelder også her. Double-tap Play krever to trykk på samme del
for å starte fra stopp. En scroll-bevegelse eller markert tekst starter ikke lyd.

BEHOLDT
REAPER Export V5, kompakte Tracks/Buses, filrader med like knapper,
Autoplay-bryter, redigering av valgt sang, multitrack, mono-standard,
USB-ruting, MIDI, backup, offline og Host/Follow.
Samme lagring, lydbehandling og native LAN-protokoll 26.37 / følgerside 26.37.1.

KONTROLL
Automatiske JavaScript-/modellsjekker dekker import med alle, noen eller
ingen spor, senere full oppdatering, avbrudd og feil under kopiering eller
klargjøring. Eksportfilene kommer fra den eksisterende REAPER-eksportøren.
Nye sjekker dekker fargevalg og REAPER-oppdatering, seksjonsstart fra tekst
og waveform, tempo, omstart, double-tap, seek-sperre, scroll og Stop.
Fysisk iPad-/nettleservisning må bekreftes på enheten.

VERIFICATION
340 JavaScript/model checks passed, including nine REAPER track-selection and eleven section-play/color checks.
Responsive CSS constraints passed targeted selection-layout smoke checks. Native source,
audio processing and storage schema unchanged. Physical iPad/browser rendering
was not tested here. This archive has not been deployed to GitHub.

## BENKEN STAGE PRO V26.40 — RYDDIGERE FILRADER OG SETTLISTE

OPPDATERING
Pakk ut ZIP-filen. Last opp innholdet til rotmappen i ditt eksisterende
kenhje/BenKenStagePro-repository på GitHub, og erstatt filer med samme navn.
Ta også med demo/. Ikke last opp ZIP-filen eller slett gamle prosjektfiler.
Åpne BenKen med internett etter at GitHub-publiseringen er ferdig. Mixeren
skal vise V26.40. Lukk og åpne appen igjen hvis forrige versjon fortsatt vises.

Ingen Xcode- eller Swift-oppdatering trengs denne gangen. Den fungerende
native appen med LAN 26.37 / følgerside 26.37.1 er fortsatt kompatibel.
Ikke slett appen eller nullstill lagringen.

AUDIO & FILES
Spornavn, FILE DETAILS, REPLACE FILE og DELETE står nå på samme linje
og har samme høyde. De tre knappene har lik bredde, mens navnefeltet
får resten av plassen. På smale telefoner kan sporradene rulles sidelengs.
FILE DETAILS åpner fortsatt filinformasjon under det aktuelle sporet.

AUTOPLAY
Gå til SETTINGS > SETLIST eller SETTINGS > PLAYBACK og slå av
ENABLE AUTOPLAY. Da skjules AUTO-knappene bak sangene i settlisten,
og automatisk overgang stopper, også for sanger som tidligere var satt
til On. Vanlig PLAY og NEXT fungerer fortsatt.

Valgene per sang og standardvalget for automatisk overgang beholdes.
Slår du ENABLE AUTOPLAY på igjen, kommer AUTO-knappene og valgene tilbake.
Bryteren lagres automatisk på enheten. Eksisterende biblioteker beholder
tidligere oppførsel inntil du selv slår funksjonen av.

EDIT SONG
I LIBRARY vises redigeringsknappen bare ved valgt sang. Trykk på en annen
sang for å velge den og vise dens redigeringsknapp. De øvrige radene
viser bare sangnavnet. EDIT SONG i TAGS redigerer fortsatt valgt sang.

BEHOLDT
Kompakte Tracks og Buses, importknapper øverst i Audio & Files,
standardbusser, REAPER V5-oppdatering, tekstseksjoner, flersporsavspilling,
mute groups, backup, MIDI og lokal Host/Follow. Samme lagring og
nettverksprotokoll. Ingen endring i lydbehandling eller originale lydfiler.

KONTROLL
Automatiske JavaScript- og modellsjekker dekker blant annet avspilling,
ruting, filbytte, REAPER-oppdatering, offline, Host/Follow og lagring.
Nye sjekker dekker Autoplay av/på, omstart, lagringsfeil, avbrutt overgang
og redigering av valgt sang. CSS-mål er kontrollert for telefon, iPad og Mac.
Fysisk iPad-/nettleservisning må bekreftes på enheten.

VERIFICATION
320 JavaScript/model checks passed, including seven new Autoplay/edit checks.
Responsive CSS constraints passed targeted alignment smoke checks. Native source,
audio processing and storage schema unchanged. Physical iPad/browser rendering
was not tested here. This archive has not been deployed to GitHub.

## BENKEN STAGE PRO V26.39 — INLINE FILE DETAILS / COMPACT BUSES

OPPDATERING
Pakk ut ZIP-filen. Last opp innholdet til rotmappen i ditt eksisterende
kenhje/BenKenStagePro-repository på GitHub, og erstatt filer med samme navn.
Ta også med demo/. Ikke last opp ZIP-filen eller slett gamle prosjektfiler.
Åpne BenKen med internett etter at publiseringen er ferdig. Mixeren skal
vise V26.39. Lukk og åpne appen igjen hvis den fortsatt viser forrige versjon.

Ingen Xcode- eller Swift-oppdatering trengs denne gangen. Den fungerende
native appen med LAN 26.37 / følgerside 26.37.1 er fortsatt kompatibel.
Ikke slett appen eller nullstill lagringen.

AUDIO & FILES
Hvert spor har nå FILE DETAILS som en knapp ved siden av spornavn,
REPLACE FILE og DELETE. Når knappen er lukket, brukes ingen ekstra rad
på detaljer. Åpner du den, vises originalfil, lagringsstatus, format,
lengde, filstørrelse og ruting under det aktuelle sporet.

På smale telefonskjermer kan knappene legge seg på neste linje, slik at
navn og knapper forblir lesbare. På iPad og større skjermer ligger de ved
siden av hverandre. Navn lagres automatisk og filbytte beholder øvrige
sporinnstillinger. FILE DETAILS kan også leses mens avspilling pågår.

MIXER SETTINGS > BUSES
Bussene har samme kompakte stil som Tracks: navn, farge og USB-utgang.
Trykk på USB-feltet for å åpne bussens valg for mono/stereo, USB-utgang,
AUTO COLOR og oversikt over tilkoblede spor. Radene starter lukket;
trykker du på en bestemt buss fra mikseren, åpnes innstillingene for den.

Bussinnstillinger er fortsatt globale og brukes av alle sanger. Endringer
lagres automatisk. Det åpne panelet blir stående åpent når format endres.
Du kan se innstillingene under avspilling, men redigering er låst til stopp.

BEHOLDT
Kompakte Tracks, importknapper øverst i Audio & Files, standardbusser,
REAPER V5-oppdatering, tekstseksjoner, flersporsavspilling, mute groups,
backup, MIDI og lokal Host/Follow. Samme lagring og nettverksprotokoll.
Ingen endring i lydbehandling eller lydfiler.

KONTROLL
313 eksisterende automatiske JavaScript/modellsjekker bestått.
Funksjonssjekker bekrefter at File Details er skrivebeskyttet, viser riktig
fil etter navneendring/bytte, og at bussnavn, farge, format og USB-utgang
lagres ved omstart. CSS-oppsettet er kontrollert for telefon, iPad og Mac.
Fysisk nettleser-/iPad-visning er ikke testet her.

VERIFICATION
313 existing JavaScript/model checks passed. Inline file details, bus persistence
and responsive CSS constraints also passed targeted smoke checks. No native
source changed. Physical iPad/browser rendering still needs confirmation.

## BENKEN STAGE PRO V26.38 — COMPACT TRACKS / AUDIO & FILES

OPPDATERING
Pakk ut ZIP-filen. Last opp innholdet i rotmappen til den eksisterende
kenhje/BenKenStagePro på GitHub, og erstatt filer med samme navn.
Last opp innholdet i demo/ også. Ikke last opp ZIP-filen eller slett andre
prosjektfiler. Åpne BenKen med internett etter publisering. Mixeren viser V26.38.

Dette er en nettoppdatering. Behold Xcode-appen som allerede fungerer.
Native LAN 26.37 og oppdateringen av følgersiden 26.37.1 er kompatible.
Du trenger ingen ny Swift-fil eller ny installasjon for denne endringen.
Ikke slett appen eller nullstill lokal lagring.

MIXER SETTINGS > TRACKS
Hver kompakte rad viser navn, farge og valgt output bus.
Trykk på bussfeltet for å åpne samlet innstilling for sporet:
- Output bus og mono/stereo
- Direkte USB-utgang hvis sporet ikke bruker buss
- Follow song key og mute groups
- AUTO COLOR og originalt filnavn

Endringer lagres automatisk. Panelet blir værende åpent når buss eller
format endres, slik at du kan gjøre flere valg. Når du åpner innstillingene
på nytt, er radene lukket. Det finnes fortsatt en egen MUTE GROUPS-fane.

MIXER SETTINGS > AUDIO & FILES
IMPORT / UPDATE FROM REAPER og + AUDIO FILES står øverst.
Sporlisten kommer rett under, med navn, REPLACE FILE og DELETE synlig.
FILE DETAILS under hvert spor viser originalfil, lagringsstatus, format,
lengde, størrelse og ruting.

Under listen finner du:
- Status og PREPARE AUDIO når lyd må klargjøres
- AUDIO OPTIONS: standardformat og standardbusser for nye spor
- FILE INFORMATION: filoppsummering og hjelpetekst

Ingen lydfiler, busser, mute groups eller spillelister flyttes av denne
oppdateringen. REAPER V5-import, tekstseksjoner, tempo/transpose, backup,
MIDI og lokal Host/Follow bruker samme lagring og protokoller som før.

KONTROLL
Eksisterende automatiske kontroller dekker filimport, REPLACE FILE, ruting,
lagring, mikserhandlinger, REAPER-oppdateringer, offline filer og LAN-broen.
En ekstra funksjonssjekk bekrefter åpning/lukking av kompakte sporvalg og
lagring av buss, stereo og mute group. Utseendet må kontrolleres på iPad;
ingen fysisk nettleser- eller enhetstest er kjørt her.

VERIFICATION
313 existing JavaScript/model checks passed. Compact control persistence
and responsive CSS constraints also passed targeted smoke checks. No native
source changed. Physical iPad/browser rendering still needs confirmation.

## BENKEN STAGE PRO V26.37 — LOCAL HOST / FOLLOW

WEB UPDATE
Unzip this archive. Upload the web files from its root (including demo/)
to the root of the existing kenhje/BenKenStagePro GitHub repository,
replacing matching files. Do not upload the ZIP itself or remove old songs.
The iPad_update folder is for your local Xcode project; it is not needed
by GitHub Pages. After publication, open the app with internet once and
check V26.37 in Mixer. Do not delete the app or clear its local data.

NATIVE HOST UPDATE
Read iPad_update/READ_ME_IPAD.txt. The app's existing Swift source must be
updated and run from Xcode once. No account or app installation is needed
for followers. Old native apps continue to play audio but cannot START HOST.

USE ON THE SAME NETWORK
1. Put host and followers on the same Wi-Fi/router.
2. In the native host app choose SETTINGS > NETWORK > START HOST.
3. On each follower scan the host's QR code or open its complete local link.
4. Keep BenKen open on the host. Select and play songs normally.

The follower link points to the host device, not the public GitHub website.
The host serves the entire reading page, text and position locally, so no
internet or separate server is required during rehearsal. Followers do not
import songs or audio. They hear the host's audio through the rehearsal
speakers or Ui24R/monitor system. No audio is streamed to follower devices.
They can choose text size, chord visibility or manual scrolling independently.

Song selection, play/pause, seeking, next title, transposed chords and lyric
section timings are shared. If exact section timing exists, followers lay
out and scroll using their own screen size. Otherwise scrolling uses overall
song position or the host's reading progress; it is not word-level alignment.
Replies update about twice per second with short position extrapolation.
This is a lyric display link, not MIDI clock or sample-accurate audio sync.

Keep the host screen awake and the app in front. Locked-screen/background
hosting is not guaranteed in this initial test version. Guest-network
isolation may block communication. If the host's IP changes, use the new
QR/link. STOP HOST ends the session; the next session has a fresh link.
Connection loss leaves the last lyrics visible and stops following until
updates resume. The session is read-only and shares only the current song.

PRESERVED
REAPER V5 import/update and V26.36 lyric-section sync, six-stem playback,
local songs, setlists, mixer settings, Ui24R, MIDI, backup and offline shell
use the same storage formats. No new Lua exporter or audio DSP is included.
The previous internet-based song-title sync remains in Tools as Cloud Song
Sync. It is separate from this local NETWORK feature.

TESTING
Automated JavaScript/model checks cover the host bridge, standalone browser
viewer, reading options, reconnect behavior, count-in, existing playback,
REAPER imports, persistence, backup and the embedded startup/MIDI/Ui24R bridge.
Swift compilation and real two-device Wi-Fi operation have not been verified
in this environment. This is a test build for your iPad, not a public release.

VERIFICATION
Full regression suite: 339 passing JavaScript/model checks. Final focused
host/viewer/native-bridge suite after text-budget handling: 28 passing checks
(27 repeated checks plus one additional UTF-8 size case). These are not
Swift build, device Wi-Fi, browser rendering or live performance tests.

## BENKEN STAGE PRO V26.36 — REAPER REGIONS AND LYRIC SECTIONS

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

## BENKEN STAGE PRO V26.35 — REAPER OG NETTVERKTEST

NETTVERSJONEN
Pakk ut ZIP-filen. Last opp filene rett i rotmappen til eksisterende
kenhje/BenKenStagePro på GitHub, og erstatt samme filnavn. Ikke slett andre
filer eller last opp selve ZIP-filen. Åpne BenKen med internett etter
publisering. Mixeren skal vise V26.35.

REAPER-OPPDATERING
REAPER/READ_ME_REAPER.txt forklarer installasjonen av Export_to_BenKen.lua.
Bruk ett prosjekt per låt. Velg normalt inntil seks spor/mappebusser og
kjør scriptet. Én .benken-fil inneholder lyd, spornavn, farger og regioner.
BenKen > Mixer > Settings > Audio & Files > IMPORT / UPDATE FROM REAPER.
Første gang kobler du til eksisterende spor eller oppretter en ny låt.
Ved neste eksport kjenner BenKen igjen sporene. Du kan eksportere bare
endret gitar; andre lydspor, sangtekst, ruting, fader og mute groups beholdes.
Nye spor bruker reglene for standardbusser i Audio & Files.
Vanlig Save i REAPER eller endringer i en skymappe oppdaterer ikke BenKen
automatisk i denne versjonen. Det er en eksport-/importflyt med en knapp.

IPAD OG LOKALT NETTVERK
iPad_update/READ_ME_IPAD.txt forklarer hvordan hele Swift-koden erstattes
i din eksisterende BenKenMIDIApp 2.swift i Xcode. Lagre og kjør Run på iPad.
Ikke legg til duplisert Swift-fil eller slett appen. GitHub-oppdateringen
alene legger ikke til den nye native TEST LOCAL NETWORK-knappen.
Knappen leser mikserens private IP direkte, uten CDN-bibliotek, og viser
konkret HTTP-svar eller iPad-feil. Den sender ingen cue-/showkommandoer.
Nettverksfeilens årsak er ennå ikke påvist på fysisk enhet.

BEHOLDT
Standardbusser etter filnavn, tryggere REPLACE FILE, filstatus per spor,
skjulte mute group-valg, Save øverst og skjulte controls ved skjermtastatur.
Samme lokale databaser og 256 MiB minnegrense. Safari og native app har
separate lokale lydfiler/data. Ikke slett appen eller nullstill lagring.

FØRSTE TEST
Test en låt. REAPERs tempoendringer blir en del av renderte lydfiler, men
BenKens genererte metronom følger ennå ikke hele tempokartet. Eksporter
Click for låter med tempoendringer. Kontroller eksportens sluttid; et
click-klipp som fortsetter etter Outro kan ellers bruke mye unødvendig minne.

Automatiske kontroller dekker import, delvis oppdatering, tilbakeføring ved
feil, lagring, backup, mikser, offline skall og JavaScript-broen. Lua er kjørt
mot en REAPER-modell med metadata fra innsendt prosjekt. Ingen ekte lyd er
rendret i disse kontrollene. Swift/Xcode, Ui24R-forbindelse, REAPER-rendering
og iCloud/Drive-filvalg må testes på dine enheter. Ikke publisert av oss.

VERIFICATION
299 automated JavaScript/model checks passed. Lua 5.4 exporter contract
checks also passed. Native Swift and real REAPER rendering are untested.

## BENKEN STAGE PRO V26.34 — IMPORT BUS DEFAULTS AND SAFER FILE REPLACEMENT

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

## BENKEN STAGE PRO V26.33 — KEYBOARD AND MIXER SAVE

WHAT CHANGED
When a text field is being edited and the on-screen keyboard reduces the
visible page height, the bottom controls and waveform are temporarily hidden.
They return when the keyboard closes, including when the text field keeps
focus. A previously hidden control bar stays hidden. This does not change the
saved control-bar or waveform preferences. Hardware-keyboard focus and zoom
alone do not hide the bar.

SAVE MIXER SETTINGS is now in the mixer's fixed top heading, beside the close
button. It sits outside the scrolling area and remains above all editable
fields. It appears only while Mixer Settings is open. In Audio & Files, the
same action says SAVE NAMES.

The V26.32 changes are included: Mute Groups in Tracks is collapsed behind
a button for each track, showing the number of assigned groups. Closing the
section keeps its assignments. The editor uses two columns on wider screens.

UPDATE FROM V26.31 OR V26.32
This ZIP contains a web update only. Upload the contents to the root of the
existing kenhje/BenKenStagePro GitHub repository, replacing matching filenames.
Do not upload the ZIP itself or put its contents inside an extra subfolder.
Keep existing files and GitHub Pages settings. Wait for publishing to finish,
then close and reopen BenKen with internet and verify V26.33 in the mixer.
No Xcode source change or deletion of the installed app is required.

DATA AND PLAYBACK
Storage keys, audio databases, project formats and memory limits are unchanged.
The keyboard behavior changes the display only; it does not pause audio.
Automatic saving and track names, buses, routing and mute groups keep their
existing behavior.

IPAD CHECK
1. Open Mixer Settings > Tracks and tap a track-name field.
2. With the docked on-screen keyboard open, the control bar should disappear.
3. Scroll the tracks. SAVE MIXER SETTINGS should remain in the fixed top row.
4. Save a name and verify it after closing and reopening Mixer Settings.
5. Dismiss the keyboard and verify that the original controls return.
6. Test the same behavior in Audio & Files, notes and other text fields.
7. Check opening and closing per-track MUTE GROUPS and retained assignments.
8. After updating, verify a fresh start and song playback on the Ui24R network
   without internet. Physical keyboard/layout, offline and cue behavior still
   require iPad checks; the automated checks use models.

VERIFICATION
259 existing mixer integration, CSS layout and offline-cache checks passed.
Application smoke checks also cover software-keyboard opening and dismissal,
focus and name retention, hardware-keyboard focus, zoom, saved controls
preferences and the top save action outside the mixer scroll area. CSS
constraints were checked at 320, 375, 768, 1024 and 1366 pixels. These are DOM/audio models and CSS constraints;
actual iPad layout and native offline/cue operation still need device testing.

## BenKen Stage Pro V26.31 — Ui24R cue links and native local network bridge

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

## BenKen Stage Pro V26.30 — Next song preview and optional pinned setlist

GITHUB UPDATE
Upload the web files and demo folder from this ZIP to the ROOT of the existing
BenKenStagePro repository. Wait for GitHub Pages publishing and reload until
V26.30 appears. Files: index.html, sw.js, benken-runtime-v26-30.js,
benken-ui-v26-30.css, manifest.webmanifest, icon-192.png, icon-512.png,
SUPABASE_SETUP.sql and demo/. This package has not been uploaded automatically.
The iPad_MIDI folder is an optional Xcode source project, not a web asset.
Your existing songs, setlists, original audio, routing and settings use their
existing stores. No clearing of browser storage or re-import is required.

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
V26.30 keeps successfully prepared key audio in a separate local IndexedDB
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
395 automated checks pass in the complete regression run, plus the separate
chord-display check. New checks cover next-song previews with repeated entries,
end-of-set and sorted library order; compact mixer docking; pinned setlist
save/reopen/failure handling; device preferences on import; phone hide/fullscreen
behavior; independent scrolling bounds; visible-viewport and footer resizing.
CSS checks cover bounded sticky layout and adjacent, ellipsized footer titles
at phone, iPad and desktop widths. Existing playback, routing, key/tempo,
original audio/project/backups, notes, skins, MIDI and offline checks also pass.
The audio engine/DSP, working-memory limit and storage formats are unchanged.
These are automated/model checks: physical iPad scrolling/rendering, Ui24R
listening tests and Xcode compilation are not claimed for this release.

## BenKen Stage Pro V26.29 — Responsive Settings and consistent skins

GITHUB UPDATE
Upload the web files and demo folder from this ZIP to the ROOT of the existing
BenKenStagePro repository. Wait for GitHub Pages publishing and reload until
V26.29 appears. Files: index.html, sw.js, benken-runtime-v26-29.js,
benken-ui-v26-29.css, manifest.webmanifest, icon-192.png, icon-512.png,
SUPABASE_SETUP.sql and demo/. This package has not been uploaded automatically.
The iPad_MIDI folder is an optional Xcode source project, not a web asset.
Your existing songs, setlists, original audio, routing and settings use their
existing stores. No clearing of browser storage or re-import is required.

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
V26.29 keeps successfully prepared key audio in a separate local IndexedDB
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
386 unique automated checks pass across completed functional, native scrolling
layout, geometry and targeted regression runs, plus the chord-display check.
Settings checks cover phone/iPad/desktop and keyboard viewport geometry,
category scroll reset, edit-position retention, Close/Escape/fullscreen, resting
and resuming lyric scroll, and continued audio playback. CSS cascade checks
cover normal and active button foregrounds across all supplied skins and Custom,
including Classic, dialogs, fields and nested mixer actions. Progress indicators,
track labels and lyric colors retain their separate roles. The remaining tests
cover existing notes, key/tempo, original audio/project/backups, routing, MIDI,
controls, lyrics and offline storage behavior. Audio engine/DSP, original audio
and storage formats are unchanged. Exact sources/provenance are in delivery
metadata. These are automated/model checks: physical iPad scrolling/rendering,
Ui24R listening tests and Xcode compilation are not claimed for this release.

## BenKen Stage Pro V26.28 — Direct notes, independent title size and Dark/Light

GITHUB UPDATE
Upload the web files and demo folder from this ZIP to the ROOT of the existing
BenKenStagePro repository. Wait for GitHub Pages publishing and reload until
V26.28 appears. Files: index.html, sw.js, benken-runtime-v26-28.js,
benken-ui-v26-28.css, manifest.webmanifest, icon-192.png, icon-512.png,
SUPABASE_SETUP.sql and demo/. This package has not been uploaded automatically.
The iPad_MIDI folder is an optional Xcode source project, not a web asset.
Your existing songs, setlists, original audio, routing and settings use their
existing stores. No clearing of browser storage or re-import is required.

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
V26.28 keeps successfully prepared key audio in a separate local IndexedDB
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
Automated checks cover direct Notes editing, song changes, failed saves,
recovery/reopen, Escape, safe text, and edits while the mixer plays without
stopping its source or changing audio/routing. Typography checks cover title
size independence, persisted alignment, bounded values and rollback. Theme
checks cover Dark/Light, complementary/legacy/custom palettes, contrast,
and CSS cascade across active button families, nested dialogs and fields.
The full regression suite also checks original audio/project transfers,
prepared transpose cache, cancellation/retry, backups, USB routing, MIDI,
count-in/metronome, DSP, lyrics, scrolling and offline assets. Exact passing
count is recorded in delivery metadata. Tests are automated/model checks:
physical Safari/iPad visual rendering, power-cycle tests, live listening,
Ui24R/FCB1010 and Xcode compilation still require Apple hardware. No physical
or browser-engine screenshot test is claimed here.

## BenKen Stage Pro V26.27 — Text buttons, Notes, skins and prepared keys

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

## BenKen Stage Pro V26.26 — Lyric colors, cleaner navigation and external display

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

## BenKen Stage Pro V26.25 — Files, setlists and general settings

UPDATE THE EXISTING GITHUB VERSION
Upload the web files and demo folder from this ZIP to the ROOT of the existing
BenKenStagePro repository. Wait for GitHub Pages publishing, then reload until
V26.25 appears. The web files are index.html, sw.js,
benken-runtime-v26-25.js, benken-ui-v26-25.css, manifest.webmanifest,
icon-192.png, icon-512.png and SUPABASE_SETUP.sql. Your existing local songs,
settings and imported audio use the same stores. There is no database reset.
The iPad_MIDI folder is an optional Xcode source project, not a web asset.
This package has not been uploaded to GitHub automatically.

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
319 automated tests passed, plus the chord-display regression. Checks cover
the deployed runtime, modeled DOM/Web Audio,
file replacement and rollback, missing/shared files, setlist search/order/
repeated entries and autoplay, mute-group save/reopen, backup/project transfers,
MIDI commands, transpose/tempo DSP, cached offline assets, lyric scroll and
CSS layout constraints. 
Physical iPad power cycles, Mac M1 + TH-U/Ui24R, touch rendering and the Xcode
build still require Apple hardware. The optional companion's MIDI bridge only
handles the active app. Background multitrack/metronome/MIDI and switching to
Mixing Station have not been physically validated. No native audio engine or
increase of the web memory guard is included.

## BenKen Stage Pro V26.24 — Automatic mixer saves and smaller key preparation

GITHUB WEB UPDATE
Upload these files to the ROOT of the existing GitHub repository:
index.html, sw.js, benken-runtime-v26-24.js, benken-ui-v26-24.css,
manifest.webmanifest, icon-192.png, icon-512.png, SUPABASE_SETUP.sql,
and the demo folder. Wait for GitHub Pages publishing, then reload until
V26.24 appears. Keep a .benken backup before updating.
The iPad_MIDI folder is a separate Xcode project, not a web asset.
This package has not been uploaded to your GitHub repository automatically.

WHAT CHANGED IN V26.24
- Mixer track-to-bus assignments, output-bus settings, names, colors, playback
  format, Follow song key and mute-group membership save automatically as you
  edit. Closing/back no longer discards valid edits. The editor shows
  "Saved on this device." A failed/invalid save keeps the previous setting and
  an editable draft for retry. Name saving keeps the focused field/caret.
- Each song keeps its own track-to-bus assignments. Bus names, colors and
  hardware USB outputs remain shared by all songs. Changing a bus's USB output
  intentionally changes that bus throughout the library. Song changes and
  reopening do not assign tracks back to the default bus.
- The last mixer view and Show all buses filter are remembered as well.
- Active mute groups and overall mute now save on this device and restore
  after reopening. These device choices stay on the receiving device when
  importing a song project; full backups can restore them with device settings.
- Valid mixer fields are flushed on pagehide/visibility changes as well as
  during ordinary edits. Original audio stays in the existing local audio
  database; no re-import or clearing of Safari data is needed.
- Main Setlist, Settings gear, Mixer and Controls buttons have equal width
  and height. Mixer Settings is beside Tempo in the same five-column row,
  with the same button size. That row remains available inside Settings.
- Transpose -/+ now applies and saves the key directly while stopped. Numeric
  input applies on change; APPLY KEY remains available for pending/recovered
  edits. Progress includes the current file and percentage. A failed key change
  is also visible beside the shared controls, with a TRANSPOSE shortcut.
- Audio for a key change is decoded/prepared one asset at a time. Prepared
  outputs from earlier files are counted against the same 256 MiB guard; the
  old full-song originals plus full-song outputs are no longer retained.
  Shared assets are decoded once, with separate shifted/unshifted variants
  only when their track settings require it. Cancellation exposes no partial
  song. Original duration, stored audio bytes, saved tempo and USB routes stay.

MIDI KEYBOARD TEST
On Mac, connect a USB MIDI keyboard, open BenKen over HTTPS in Chrome, then
Settings > MIDI > OPEN MIDI SETTINGS > CONNECT. Choose the input, select START,
press LEARN and press a key. Learning assigns it without starting playback.
Release and press again to start. Assign another key to STOP or NEXT.
Note-off and Note On velocity 0 do not trigger a button. Assignments save on
this device. MIDI commands control BenKen; this does not add a piano/synth.
Safari on iPad does not provide Web MIDI. A connected keyboard alone does not
enable it; use the optional native-MIDI companion app for iPad input.
Keyboard/controller events pass modeled MIDI tests, not physical USB testing.

FEATURES RETAINED FROM V26.23
- Mixer > TEMPO > TRANSPOSE provides −2, −1, 0, +1 or +2 semitones.
  Two semitones are one whole tone. Stop playback and use the -/+ buttons or
  numeric field to apply the value. The setting is saved per song.
  ORIGINAL KEY resets only transposition; the saved playback BPM is retained.
- Backing audio, chord roots, slash bass notes, diagrams and the displayed key
  follow the same saved offset. Existing capo display offsets still apply.
  Original ChordPro text and source-key metadata are kept, so resetting does
  not accumulate edits or require importing the song again.
- Pitch changes keep the saved BPM and song duration. Existing tempo changes,
  count-in, seek positions, waveform and lyric markers keep their timeline.
  Processing is prepared before playback; switching keys is disabled while
  backing or the standalone metronome is playing.
- Mixer Settings > TRACKS > Follow song key controls each track. Click, drums,
  trommer and percussion named in filenames/track names default to off;
  other tracks default to on. Review these choices for your own files.
  Explicit choices override the name-based default and are saved/exported.
  Generated metronome/count-in is not pitch shifted.
- A key change is saved only after audio preparation succeeds. A failed
  preparation or save reloads the saved key and retains playable original
  audio where it was previously ready. Navigating away cancels the pending
  key change. Live song-level edits made during preparation are retained.
- New .benken projects use format 6 and full backups use format 3. These keep
  song transpose and each track's Follow song key value together. V26.24
  reads older projects 1–5 and full backups 1–2. Releases before V26.23 reject
  formats 6/3 rather than silently playing the wrong key.

TRANSPOSE MEMORY AND SOUND QUALITY
The 256 MiB web working-memory guard is unchanged. V26.24 prepares one asset
at a time and budgets earlier prepared outputs plus the current source/output
and FFT workspace. In the modeled six-mono-stem case (170 seconds at 48 kHz),
retained PCM is 186.8 MiB and pitch-preparation peak is about 218.1 MiB instead
of 373.5 MiB. Decoding a stereo source for mono playback can temporarily reach
about 249 MiB in that case. Actual browser/decoder memory can differ.
Longer/stereo songs or tempo changes can still exceed the guard. MP3 does not
itself reduce decoded PCM. A newer iPad does not raise the software limit.
Failed key preparation keeps the saved key. Prepared PCM is rebuilt after
reopening from the original local files and saved settings, so this can take
time on an older iPad; watch the progress. No cloud audio fetch is required.

The local pitch processor uses a phase vocoder with spectral peak phase
locking and virtual cubic resampling. Stereo channels share their phase
reference and all stems use the same analysis clock. No extra full-size
resampled PCM or real-time pitch processor is allocated. Originals are never
rewritten or re-encoded. This is not a formant-preserving vocal processor.
Automated checks cover measured notes, polyphonic intervals, opposite
polarity, stereo phase, sample rates, duration, memory guards and cancellation.
Listen to your own vocals, guitars and full mix before live use: listening
quality and processing time have not been validated on your iPad/Ui24R.

FEATURES RETAINED FROM V26.22
- The waveform/button bar is positioned against the visible screen rectangle,
  including Safari toolbar changes, viewport panning/zoom and keyboard resize.
  Its coordinates do not include the lyrics' document scroll position or
  fractional transform. It remains outside the moving lyrics layer.
- Mixer controls keep their existing dialog dock. Closing the mixer returns
  the shared controls to the current screen bottom. Fullscreen hiding and
  measured reading space are retained. No audio engine or file format changed.
  These cases pass modeled DOM/CSS checks; the reported Safari/iPad placement
  still needs visual confirmation on the physical device.

OFFLINE USE AND MIXER CONTROL
The web app caches its own interface using a service worker, and imported
audio is copied into local storage. After a complete online load and local
audio import, normal song playback does not fetch audio from iCloud or Drive.
Open/reopen BenKen and test every required song without internet before use.
An uncached page, an update or downloading a new cloud file needs internet.
Do not clear Safari website data: it contains the local songs/audio and cache.

The Ui24R Wi-Fi network provides a local mixer-control connection; internet is
not required for that control. BenKen's USB audio cable is a separate path.
The iPad can remain on that local network while BenKen uses local files.

Background playback while opening Mixing Station is NOT validated for this
web engine. AudioContext interruption stops playback and requires restarting.
Generated continuous click and autoplay also depend on JavaScript scheduling.
Keep BenKen visible during the first live tests. The optional MIDI companion
still uses Web Audio in WKWebView, not a native playback engine. Its MIDI
bridge currently forwards pedal messages only while the app is active.
Its background-audio entitlement/session setting does not constitute a tested
background multitrack/MIDI solution. That remains work for the native app.

FEATURES RETAINED FROM V26.21
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
- Per-entry autoplay and click settings remain included in full backups.
  V26.21 introduced project format 5 and full-backup format 2. V26.24 reads
  those formats and exports the newer transpose-aware formats described above.

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
and BPM/click/transpose fields save their pending recovery draft automatically.
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
Existing .benken projects (formats 1-6) and JSON text backups remain supported
in their existing import locations. .benkenbackup is a separate full-backup
format; newly created format-3 backups need V26.24 or later. It is not an
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
A new .benken export uses project format 6 to prevent older app versions from
silently ignoring pitch settings. V26.24 reads project formats 1 through 6.
Song tempo, transpose, click settings and SONG level travel with projects; device MASTER and MIDI
assignments stay on the receiving device. Safari and the iPad companion app
have separate local storage: export a .benken project in Safari and import
that copy in the companion app. Original cloud files stay untouched.

VERIFICATION
302 automated tests passed across the complete suite, plus the chord-display
regression checks. These cover per-entry autoplay, count-in timing/cancellation,
metronome routing and seek phase, footer viewport/docking, offline cached
assets/local playback, modeled DOM/Web Audio, project transfers,
MIDI keyboard commands, automatic saves/reopening, sequential preparation,
tempo/pitch DSP, key/chord/capo changes, rollback, BPM detection,
fractional scroll motion and CSS width
constraints. Actual Safari/iPad touch layout,
FCB1010/Ui24R, Bluetooth pairing and the Xcode build require testing on Apple
hardware. This package is source code, not a signed app or TestFlight release.
Continuous click uses the browser audio clock with scheduling ahead, but
background execution and simultaneous use with Mixing Station have not been
physically validated. Keep BenKen visible for the first hardware test.

## BenKen Stage Pro V26.23 — Song transpose with matching audio and chords

GITHUB WEB UPDATE
Upload these files to the ROOT of the existing GitHub repository:
index.html, sw.js, benken-runtime-v26-23.js, benken-ui-v26-23.css,
manifest.webmanifest, icon-192.png, icon-512.png, SUPABASE_SETUP.sql,
and the demo folder. Wait for GitHub Pages publishing, then reload until
V26.23 appears. Keep a .benken backup before updating.
The iPad_MIDI folder is a separate Xcode project, not a web asset.
This package has not been uploaded to your GitHub repository automatically.

WHAT CHANGED IN V26.23
- Mixer > TEMPO > TRANSPOSE provides −2, −1, 0, +1 or +2 semitones.
  Two semitones are one whole tone. Stop playback, choose the value with the
  -/+ buttons or field, then press APPLY KEY. The setting is saved per song.
  ORIGINAL KEY resets only transposition; the saved playback BPM is retained.
- Backing audio, chord roots, slash bass notes, diagrams and the displayed key
  follow the same saved offset. Existing capo display offsets still apply.
  Original ChordPro text and source-key metadata are kept, so resetting does
  not accumulate edits or require importing the song again.
- Pitch changes keep the saved BPM and song duration. Existing tempo changes,
  count-in, seek positions, waveform and lyric markers keep their timeline.
  Processing is prepared before playback; switching keys is disabled while
  backing or the standalone metronome is playing.
- Mixer Settings > TRACKS > Follow song key controls each track. Click, drums,
  trommer and percussion named in filenames/track names default to off;
  other tracks default to on. Review these choices for your own files.
  Explicit choices override the name-based default and are saved/exported.
  Generated metronome/count-in is not pitch shifted.
- A key change is saved only after audio preparation succeeds. A failed
  preparation or save reloads the saved key and retains playable original
  audio where it was previously ready. Navigating away cancels the pending
  key change. Live song-level edits made during preparation are retained.
- New .benken projects use format 6 and full backups use format 3. These keep
  song transpose and each track's Follow song key value together. V26.23
  reads older projects 1–5 and full backups 1–2. Earlier releases reject the
  new formats rather than silently playing the wrong key.

TRANSPOSE MEMORY AND SOUND QUALITY
The 256 MiB web working-memory guard is unchanged. Transpose needs the decoded
originals, prepared output and a small FFT workspace at the same time. A song
using about 187 MiB with every track following the key needs about 374 MiB
temporarily and cannot be transposed within this limit. Fewer, shorter or mono
tracks can fit; unshifted tracks at original tempo can reuse their buffers.
MP3 does not itself reduce decoded PCM. A newer iPad does not automatically
raise this software limit. Failed key preparation keeps the saved key.

The local pitch processor uses a phase vocoder with spectral peak phase
locking and virtual cubic resampling. Stereo channels share their phase
reference and all stems use the same analysis clock. No extra full-size
resampled PCM or real-time pitch processor is allocated. Originals are never
rewritten or re-encoded. This is not a formant-preserving vocal processor.
Automated checks cover measured notes, polyphonic intervals, opposite
polarity, stereo phase, sample rates, duration, memory guards and cancellation.
Listen to your own vocals, guitars and full mix before live use: listening
quality and processing time have not been validated on your iPad/Ui24R.

FEATURES RETAINED FROM V26.22
- The waveform/button bar is positioned against the visible screen rectangle,
  including Safari toolbar changes, viewport panning/zoom and keyboard resize.
  Its coordinates do not include the lyrics' document scroll position or
  fractional transform. It remains outside the moving lyrics layer.
- Mixer controls keep their existing dialog dock. Closing the mixer returns
  the shared controls to the current screen bottom. Fullscreen hiding and
  measured reading space are retained. No audio engine or file format changed.
  These cases pass modeled DOM/CSS checks; the reported Safari/iPad placement
  still needs visual confirmation on the physical device.

OFFLINE USE AND MIXER CONTROL
The web app caches its own interface using a service worker, and imported
audio is copied into local storage. After a complete online load and local
audio import, normal song playback does not fetch audio from iCloud or Drive.
Open/reopen BenKen and test every required song without internet before use.
An uncached page, an update or downloading a new cloud file needs internet.
Do not clear Safari website data: it contains the local songs/audio and cache.

The Ui24R Wi-Fi network provides a local mixer-control connection; internet is
not required for that control. BenKen's USB audio cable is a separate path.
The iPad can remain on that local network while BenKen uses local files.

Background playback while opening Mixing Station is NOT validated for this
web engine. AudioContext interruption stops playback and requires restarting.
Generated continuous click and autoplay also depend on JavaScript scheduling.
Keep BenKen visible during the first live tests. The optional MIDI companion
still uses Web Audio in WKWebView, not a native playback engine. Its MIDI
bridge currently forwards pedal messages only while the app is active.
Its background-audio entitlement/session setting does not constitute a tested
background multitrack/MIDI solution. That remains work for the native app.

FEATURES RETAINED FROM V26.21
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
- Per-entry autoplay and click settings remain included in full backups.
  V26.21 introduced project format 5 and full-backup format 2. V26.23 reads
  those formats and exports the newer transpose-aware formats described above.

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
and BPM/click/transpose fields save their pending recovery draft automatically.
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
Existing .benken projects (formats 1-6) and JSON text backups remain supported
in their existing import locations. .benkenbackup is a separate full-backup
format; newly created format-3 backups need V26.23 or later. It is not an
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
A new .benken export uses project format 6 to prevent older app versions from
silently ignoring pitch settings. V26.23 reads project formats 1 through 6.
Song tempo, transpose, click settings and SONG level travel with projects; device MASTER and MIDI
assignments stay on the receiving device. Safari and the iPad companion app
have separate local storage: export a .benken project in Safari and import
that copy in the companion app. Original cloud files stay untouched.

VERIFICATION
285 automated tests passed across the complete suite, plus the chord-display
regression checks. These cover per-entry autoplay, count-in timing/cancellation,
metronome routing and seek phase, footer viewport/docking, offline cached
assets/local playback, modeled DOM/Web Audio, project transfers,
MIDI, tempo/pitch DSP, key/chord/capo changes, rollback, BPM detection,
fractional scroll motion and CSS width
constraints. Actual Safari/iPad touch layout,
FCB1010/Ui24R, Bluetooth pairing and the Xcode build require testing on Apple
hardware. This package is source code, not a signed app or TestFlight release.
Continuous click uses the browser audio clock with scheduling ahead, but
background execution and simultaneous use with Mixing Station have not been
physically validated. Keep BenKen visible for the first hardware test.

## BenKen Stage Pro V26.22 — Visible-screen footer positioning

GITHUB WEB UPDATE
Upload these files to the ROOT of the existing GitHub repository:
index.html, sw.js, benken-runtime-v26-22.js, benken-ui-v26-22.css,
manifest.webmanifest, icon-192.png, icon-512.png, SUPABASE_SETUP.sql,
and the demo folder. Wait for GitHub Pages publishing, then reload until
V26.22 appears. Keep a .benken backup before updating.
The iPad_MIDI folder is a separate Xcode project, not a web asset.
This package has not been uploaded to your GitHub repository automatically.

WHAT CHANGED IN V26.22
- The waveform/button bar is positioned against the visible screen rectangle,
  including Safari toolbar changes, viewport panning/zoom and keyboard resize.
  Its coordinates do not include the lyrics' document scroll position or
  fractional transform. It remains outside the moving lyrics layer.
- Mixer controls keep their existing dialog dock. Closing the mixer returns
  the shared controls to the current screen bottom. Fullscreen hiding and
  measured reading space are retained. No audio engine or file format changed.
  These cases pass modeled DOM/CSS checks; the reported Safari/iPad placement
  still needs visual confirmation on the physical device.

OFFLINE USE AND MIXER CONTROL
The web app caches its own interface using a service worker, and imported
audio is copied into local storage. After a complete online load and local
audio import, normal song playback does not fetch audio from iCloud or Drive.
Open/reopen BenKen and test every required song without internet before use.
An uncached page, an update or downloading a new cloud file needs internet.
Do not clear Safari website data: it contains the local songs/audio and cache.

The Ui24R Wi-Fi network provides a local mixer-control connection; internet is
not required for that control. BenKen's USB audio cable is a separate path.
The iPad can remain on that local network while BenKen uses local files.

Background playback while opening Mixing Station is NOT validated for this
web engine. AudioContext interruption stops playback and requires restarting.
Generated continuous click and autoplay also depend on JavaScript scheduling.
Keep BenKen visible during the first live tests. The optional MIDI companion
still uses Web Audio in WKWebView, not a native playback engine. Its MIDI
bridge currently forwards pedal messages only while the app is active.
Its background-audio entitlement/session setting does not constitute a tested
background multitrack/MIDI solution. That remains work for the native app.

FEATURES RETAINED FROM V26.21
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
  .benken projects use format 5; new full backups use format 2. V26.21 and
  V26.22 read older projects (1–4) and full backups (1). Releases before
  V26.21 reject these new formats rather than silently losing settings.

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
silently ignoring click settings. V26.22 reads project formats 1 through 5.
Song tempo, click settings and SONG level travel with projects; device MASTER and MIDI
assignments stay on the receiving device. Safari and the iPad companion app
have separate local storage: export a .benken project in Safari and import
that copy in the companion app. Original cloud files stay untouched.

VERIFICATION
264 automated tests passed across the complete suite, plus the chord-display
regression checks. These cover per-entry autoplay, count-in timing/cancellation,
metronome routing and seek phase, footer viewport/docking, offline cached
assets/local playback, modeled DOM/Web Audio, project transfers,
MIDI, tempo DSP, pitch, BPM detection, fractional scroll motion and CSS width
constraints. Actual Safari/iPad touch layout,
FCB1010/Ui24R, Bluetooth pairing and the Xcode build require testing on Apple
hardware. This package is source code, not a signed app or TestFlight release.
Continuous click uses the browser audio clock with scheduling ahead, but
background execution and simultaneous use with Mixing Station have not been
physically validated. Keep BenKen visible for the first hardware test.

## BenKen Stage Pro V26.21 — Setlist autoplay, count-in and routed metronome

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

## BenKen Stage Pro V26.20 — Practice / Live, playback protection and full backup

GITHUB WEB UPDATE
Upload these files to the ROOT of the existing GitHub repository:
index.html, sw.js, benken-runtime-v26-20.js, benken-ui-v26-20.css,
manifest.webmanifest, icon-192.png, icon-512.png, SUPABASE_SETUP.sql,
and the demo folder. Wait for GitHub Pages publishing, then reload until
V26.20 appears. Keep a .benken backup before updating.
The iPad_MIDI folder is a separate Xcode project, not a web asset.
This package has not been uploaded to your GitHub repository automatically.

WHAT CHANGED IN V26.20
- Settings now opens on PLAYBACK. PRACTICE / STEREO and LIVE / USB are large,
  explicit choices. They are also at the top of Mixer Settings, and the mixer
  header shows the current mode. Output routing is preserved in Practice.
  Click is included in the stereo mix; mute its track/group when not wanted.
  Stop playback before switching. A failed save restores the previous mode.
- DOUBLE-TAP PLAY and DOUBLE-TAP STOP / PAUSE are optional in Settings >
  PLAYBACK. First press arms the action; a second press within one second
  confirms it. Applies to screen controls and MIDI commands. Both default off.
  A third immediate toggle after a confirmed Play does not pause playback.
- AUTOPLAY NEXT SONG IN SETLIST is optional, default off. It uses the selected
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
and BPM fields now save their latest pending recovery draft automatically.
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
Existing .benken projects (formats 1-4) and JSON text backups remain supported
in their existing import locations. .benkenbackup is a separate full-backup
format and needs V26.20 or later; it is not an audio-file import.

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
A new .benken export uses project format 4 to prevent older app versions from
silently ignoring playback tempo. V26.20 reads project formats 1, 2, 3 and 4.
Song tempo and SONG level travel with projects; device MASTER and MIDI
assignments stay on the receiving device. Safari and the iPad companion app
have separate local storage: export a .benken project in Safari and import
that copy in the companion app. Original cloud files stay untouched.

VERIFICATION
228 unique automated tests passed across the complete suite and targeted reruns, plus the chord-display regression checks. These
cover modeled DOM/Web Audio, project transfers, MIDI, tempo DSP, pitch, BPM
detection, fractional scroll motion and CSS width constraints. Actual Safari/iPad touch layout,
FCB1010/Ui24R, Bluetooth pairing and the Xcode build require testing on Apple
hardware. This package is source code, not a signed app or TestFlight release.

## BenKen Stage Pro V26.19 — mono playback and clear Play status

GITHUB WEB UPDATE
Upload these files to the ROOT of the existing GitHub repository:
index.html, sw.js, benken-runtime-v26-19.js, benken-ui-v26-19.css,
manifest.webmanifest, icon-192.png, icon-512.png, SUPABASE_SETUP.sql,
and the demo folder. Wait for GitHub Pages publishing, then reload until
V26.19 appears. Keep a .benken backup before updating.
The iPad_MIDI folder is a separate Xcode project, not a web asset.
This package has not been uploaded to your GitHub repository automatically.

WHAT CHANGED IN V26.19
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
A new .benken export uses project format 4 to prevent older app versions from
silently ignoring playback tempo. V26.19 reads project formats 1, 2, 3 and 4.
Song tempo and SONG level travel with projects; device MASTER and MIDI
assignments stay on the receiving device. Safari and the iPad companion app
have separate local storage: export a .benken project in Safari and import
that copy in the companion app. Original cloud files stay untouched.

VERIFICATION
198 automated tests passed, plus the chord-display regression checks. These
cover modeled DOM/Web Audio, project transfers, MIDI, tempo DSP, pitch, BPM
detection, fractional scroll motion and CSS width constraints. Actual Safari/iPad touch layout,
FCB1010/Ui24R, Bluetooth pairing and the Xcode build require testing on Apple
hardware. This package is source code, not a signed app or TestFlight release.

## BenKen Stage Pro V26.18 — clean mixer navigation and settings

GITHUB WEB UPDATE
Upload these files to the ROOT of the existing GitHub repository:
index.html, sw.js, benken-runtime-v26-18.js, benken-ui-v26-18.css,
manifest.webmanifest, icon-192.png, icon-512.png, SUPABASE_SETUP.sql,
and the demo folder. Wait for GitHub Pages publishing, then reload until
V26.18 appears. Keep a .benken backup before updating.
The iPad_MIDI folder is a separate Xcode project, not a web asset.
This package has not been uploaded to your GitHub repository automatically.

WHAT CHANGED IN V26.18
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
A new .benken export uses project format 4 to prevent older app versions from
silently ignoring playback tempo. V26.18 reads project formats 1, 2, 3 and 4.
Song tempo and SONG level travel with projects; device MASTER and MIDI
assignments stay on the receiving device. Safari and the iPad companion app
have separate local storage: export a .benken project in Safari and import
that copy in the companion app. Original cloud files stay untouched.

VERIFICATION
188 automated tests passed, plus the chord-display regression checks. These
cover modeled DOM/Web Audio, project transfers, MIDI, tempo DSP, pitch, BPM
detection, fractional scroll motion and CSS width constraints. Actual Safari/iPad touch layout,
FCB1010/Ui24R, Bluetooth pairing and the Xcode build require testing on Apple
hardware. This package is source code, not a signed app or TestFlight release.

## BenKen Stage Pro V26.17 — mixer fit, slow scrolling and BPM controls

GITHUB WEB UPDATE
Upload these files to the ROOT of the existing GitHub repository:
index.html, sw.js, benken-runtime-v26-17.js, benken-ui-v26-17.css,
manifest.webmanifest, icon-192.png, icon-512.png, SUPABASE_SETUP.sql,
and the demo folder. Wait for GitHub Pages publishing, then reload until
V26.17 appears. Keep a .benken backup before updating.
The iPad_MIDI folder is a separate Xcode project, not a web asset.
This package has not been uploaded to your GitHub repository automatically.

WHAT CHANGED IN V26.17
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
  Hide it under Mixer Settings > AUDIO & FILES > Audio output and more
  options > Show master fader. Hiding it keeps its current level and mute.
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
Settings (gear) > SCENE > MIDI / FOOT CONTROLLER.
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
A new .benken export uses project format 4 to prevent older app versions from
silently ignoring playback tempo. V26.17 reads project formats 1, 2, 3 and 4.
Song tempo and SONG level travel with projects; device MASTER and MIDI
assignments stay on the receiving device. Safari and the iPad companion app
have separate local storage: export a .benken project in Safari and import
that copy in the companion app. Original cloud files stay untouched.

VERIFICATION
183 automated tests passed, plus the chord-display regression checks. These
cover modeled DOM/Web Audio, project transfers, MIDI, tempo DSP, pitch, BPM
detection, fractional scroll motion and CSS width constraints. Actual Safari/iPad touch layout,
FCB1010/Ui24R, Bluetooth pairing and the Xcode build require testing on Apple
hardware. This package is source code, not a signed app or TestFlight release.

## BenKen Stage Pro V26.16 — MIDI, continuous lyrics and song tempo

GITHUB WEB UPDATE
Upload these files to the ROOT of the existing GitHub repository:
index.html, sw.js, benken-runtime-v26-16.js, benken-ui-v26-16.css,
manifest.webmanifest, icon-192.png, icon-512.png, SUPABASE_SETUP.sql,
and the demo folder. Wait for GitHub Pages publishing, then reload until
V26.16 appears. Keep a .benken backup before updating.
The iPad_MIDI folder is a separate Xcode project, not a web asset.
This package has not been uploaded to your GitHub repository automatically.

WHAT CHANGED
- Duration-synced lyrics move continuously through marked sections instead
  of holding a section and then jumping. Mark each section start using
  SYNC LYRICS. Without markers the existing duration-based scroll remains.
  Timing is estimated within each section, rather than word-level karaoke.
- SONG controls all stems for the current song and remembers its level.
  Your previous per-song master level becomes this SONG level automatically.
- MASTER is now a separate overall level, shared by all songs on this device.
  Hide it under Mixer Settings > AUDIO & FILES > Audio output and more
  options > Show master fader. Hiding it keeps its current level and mute.
  Both faders support double-tap / double-click to return to 0 dB.
- MUTE GROUPS is a mixer tab next to OUTPUTS / BUSES. It shows the six mute
  buttons, membership summaries and a shortcut to edit assignments.

TEMPO IN BPM
In the mixer, open TEMPO. Enter the original BPM and the desired playback
BPM, then APPLY while playback is stopped. Both values are saved per song.
Example: Original 120, Playback 108 = 90% speed, same pitch.
ORIGINAL TEMPO resets Playback BPM to the stored Original BPM.
The supported range is 75–125% of the original (BPM inputs 20–300).
The original BPM must be entered accurately; this is not automatic beat detection.
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
Settings (gear) > SCENE > MIDI / FOOT CONTROLLER.
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
A new .benken export uses project format 4 to prevent older app versions from
silently ignoring playback tempo. V26.16 reads project formats 1, 2, 3 and 4.
Song tempo and SONG level travel with projects; device MASTER and MIDI
assignments stay on the receiving device. Safari and the iPad companion app
have separate local storage: export a .benken project in Safari and import
that copy in the companion app. Original cloud files stay untouched.

VERIFICATION
Automated DOM, Web Audio, project-transfer, MIDI message, tempo DSP, pitch,
scrolling and regression checks were run. Actual Safari/iPad touch layout,
FCB1010/Ui24R, Bluetooth pairing and the Xcode build require testing on Apple
hardware. This package is source code, not a signed app or TestFlight release.

## BenKen Stage Pro V26.15 – smooth scrolling, English UI, song colors and Melody

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

# Older notes (LES_MEG)

## LES_MEG.txt

BENKEN FØLGERSIDE 26.37.1

Tidtelleren er fjernet fra følgersiden. Rekkefølgen øverst er nå:
knapper, låttittel, NEXT. Artist/toneart og forbindelsesstatus står under.

Denne lille oppdateringen gjøres bare i Xcode. Mixeren viser fortsatt V26.37.

1. Pakk ut ZIP-filen. Høyreklikk BenKenMIDIApp.swift og velg Åpne med > TextEdit.
2. Inne i tekstvinduet: trykk Cmd+A og Cmd+C for å kopiere hele koden.
3. I ditt eksisterende Xcode-prosjekt: åpne BenKenMIDIApp 2.swift, trykk Cmd+A
   og Cmd+V for å erstatte innholdet. Første linje skal være import SwiftUI.
   Bruk den eksisterende filen, slik at det bare er én kopi av appkoden.
4. Lagre med Cmd+S og trykk Run med iPaden valgt.
5. Velg SETTINGS > NETWORK > START HOST igjen. Følgerne åpner den nye lenken
   eller skanner den nye QR-koden.

Ingen endring i filhåndtering, lyd, MIDI, Ui24R eller nettverksprotokoll.
19 eksisterende JavaScript/modellsjekker bestått med den nye følgersiden.
Swift-bygget og den nye utformingen er ikke testet fysisk her.

## LES_MEG_IKON.txt

BenKen Stage Pro - nytt appikon. Kun icon-192.png, icon-512.png og cacheversjon i sw.js er endret. Samme GitHub Pages-adresse og samme lokale lagringsnokler beholdes. Sangene blir ikke slettet av denne oppdateringen. Ta likevel JSON-sikkerhetskopi. iOS kan kreve at hjemskjermikonet fjernes og legges til pa nytt for a vise nytt bilde; dette kan opprette separat lokal lagring. Ikke slett eksisterende hjemskjermapp for du har eksportert sangene.

## LES_MEG_V20.txt

BenKen Stage Pro V20
- Artist kan fylles ut per sang under LIBRARY > ADD SONG eller blyantikon ved sang.
- Eksisterende ChordPro {artist: ...} og {a: ...} leses automatisk inn i artistfeltet.
- ARTISTS i LIBRARY grupperer etter artistfeltet.
- Intro, Solo og Outro i editor og egne farger under PERSONALIZATION.
- PLAY bruker SVG-ikon som forblir hvitt paa moerkeblaa knapp; viser pause under avspilling.
- Beholder samme lokale lagringsnoekkel som V19.
- Test paa iPad/iPhone foer livebruk; ta JSON-backup foerst.

## LES_MEG_V26.txt

BenKen Stage Pro V26 - testversjon

NYTT:
- Egne farger for INTRO, VERSE, CHORUS, BRIDGE, SOLO og OUTRO.
- Scroll Speed med +/- per sang (100 % tilsvarer tidligere 18 px/s).
- Valgfri scrolling som følger posisjonen i den valgte lydfilen.
- Valgfritt sveip til venstre/hoyre i sangteksten for neste/forrige sang.

Publiser filene i GitHub-repositoryets rotmappe. Ta JSON-backup forst.
Merk: Test pa iPad/iPhone for livebruk. Lagring i Safari er ikke garantert permanent.

## LES_MEG_V26_1.txt

BenKen Stage Pro V26.1 – GitHub-utgaven

NYTT
Settings → Lyrics → SKJUL AKKORDER viser bare sangtekst.
Knappen blir VIS AKKORDER når akkordene er skjult.
Valget gjelder alle sanger og lagres på denne enheten.
Akkorddiagrammer skjules samtidig. Sangtekst og akkorder i biblioteket beholdes.

OPPDATER GITHUB
1. Pakk ut ZIP-filen.
2. Åpne https://github.com/kenhje/BenKenStagePro
3. Velg Add file → Upload files. Last opp index.html og sw.js fra denne mappen.
4. Velg Commit changes.
5. Når GitHub Pages har publisert, åpne https://kenhje.github.io/BenKenStagePro/ og last siden på nytt. V26.1 vises øverst.

Ingen Terminal-kommando er nødvendig for denne oppdateringen.
Oppdateringen bruker de samme lagringsnøklene som V26.
Kontrollert med automatisert test av den faktiske appkoden i en DOM-modell.
Visuell kontroll på fysisk iPad er ikke utført her.

## LES_MEG_V26_10.txt

BenKen Stage Pro V26.10 – ren visning og samlet mikseroppsett

OPPDATER GITHUB
Pakk ut ZIP-filen og last opp ALLE filene, inkludert demo-mappen, til roten i
GitHub-repositoriet. Erstatt eksisterende filer med samme navn.
V26.10 bruker benken-runtime-v26-10.js og benken-ui-v26-10.css. Last også opp
index.html og sw.js fra pakken. Eldre programfiler kan bli liggende; de brukes
ikke av denne versjonen. Denne ZIP-filen er ikke publisert automatisk.
Vent til GitHub Pages er ferdig publisert, og åpne appen på nytt.
Kontroller V26.10 øverst i appen og inne i mikseren.
Bruk samme nettadresse og nettleserprofil som før. Sanger, setlister og lydfiler
beholder samme lagringsnøkler. Du trenger ikke slette nettleserdata.

FIRE KNAPPER ØVERST
SETLIST: viser eller skjuler låtlisten. I listen velger du SETLIST eller BIBLIOTEK.
På iPhone åpnes listen over teksten, og den lukkes etter valg av låt.
SETTINGS: åpner appens innstillinger.
MIXER: åpner mikseren.
CONTROLS: viser eller skjuler kontrollfeltet nederst. Valget huskes på enheten.
Å vise/skjule kontrollfeltet eller låtlisten stopper ikke avspillingen.
Fullskjerm velges fra kontrollfeltet, eller fra Settings som tidligere.

ALLE KNAPPER I KONTROLLFELTET
Trykk TILPASS i kontrollfeltet, eller Settings → SCENE.
Du kan velge inntil 32 knapper, egen tekst og rekkefølge.
ALLE KNAPPER fyller inn alle de tilgjengelige handlingene, inkludert Settings,
Setlist, Bibliotek, Mikserinnstillinger, bølgeform og de seks mutegruppene.
+ KNAPP legger til en plass. Skjul i en plass fjerner knappen fra visningen.
STANDARDKNAPPER henter standardoppsettet. Endringene i skjemaet lagres først
når du trykker LAGRE KONTROLLER.
Velg VIS KNAPPENE I FLERE RADER hvis du vil ha knappene fordelt over flere rader.
Ellers ligger de på én rad som kan rulles sidelengs.
Kontrollfeltets layout og visning gjelder denne enheten.
Settings, Setlist og Mixer i kontrollfeltet bruker de samme funksjonene som øverst.
Fullskjerm skjuler begge kontrollfeltene. Trykk på tekstflaten for å vise dem.

MIKSERINNSTILLINGER
Åpne Mixer → MIKSERINNSTILLINGER. Stopp avspillingen før du endrer oppsettet.
Du kan også trykke på bussruten, gruppeoversikten eller KANALOPPSETT på en
kanalstripe. Da åpnes oppsettet for den aktuelle kanalen.

SPOR
Hver rad viser kanalnavn, farge, lydfil, utgangsbuss, mono/stereo og mutegrupper.
En buss samler flere spor til samme utgang. Velg Direkte USB for direkte routing.
Velg én eller flere av de seks mutegruppene på sporets rad.
Farge velges per kanal. AUTO bruker bussens farge, eller standardfarge ved direkte USB.
Spornavn, egne farger, routing og gruppemedlemskap lagres per låt.

BUSSER
Her endrer du navn, farge, mono/stereo og USB-utgang for de 16 bussene.
Du ser hvilke spor fra denne låten som er koblet til hver buss, og hvor mange
spor fra andre låter som også bruker den.
Bussoppsettet er FELLES FOR ALLE LÅTER. En endring av en buss gjelder derfor
også andre låter som bruker bussen. Kanaler med AUTO-farge følger bussfargen.
En kanal med egen farge beholder denne til du velger AUTO på den kanalen.

MUTEGRUPPER
Gi hver gruppe et navn og kryss av sporene som skal tilhøre gruppen.
Dette er det samme medlemskapet som vises under SPOR, sett fra gruppenes side.
Gruppenavnene gjelder alle låter, mens medlemskap velges per låt.
De samme navnene vises over mikseren og på gruppeknappene i kontrollfeltet.
Et spor kan være i flere grupper. Minst én aktiv gruppe er nok til å mute sporet.
Gruppeknappene kan fortsatt brukes under avspilling.

LAGRE MIKSEROPPSETT lagrer alle de tre fanene samlet. AVBRYT forkaster skjemaet.
Navn, farger og gruppeoversikt oppdateres på kanalstripene og i kontrollfeltet.
Feilet lagring beholder det forrige oppsettet. Et skjema for en annen låt kan
ikke lagres etter et låtskifte. Oppsettet kan ikke endre ruting under avspilling.
Hovedmikseren har nå fader, meter, pan, mute/solo og lesbar buss-/gruppeoversikt.
De detaljerte routingsvalgene og gruppevalgene ligger i mikserinnstillingene.
Du kan fremdeles skrive spornavn direkte i fargefeltet nederst på kanalstripen.

LYDFILER OG PROSJEKTFILER
Vanlig avspilling: velg låt → MIXER → + LYDFILER → vent til klar → SPILL.
Appen kopierer filene lokalt; du trenger ikke lage eller importere en prosjektfil
for å spille sporene. KLARGJØR LYD ligger synlig ved statusfeltet.
Lydsporene må være eksportert fra samme startpunkt for å ligge i synk.
Prosjektfiler er til backup og flytting. LYDFILER FOR DENNE LÅTEN → Aktuell låt
med lyd → LAG PROSJEKTFIL → DEL / LAGRE I FILER eller LAST NED.
På en annen enhet: IMPORTER PROSJEKT. En låtfil legges til som en ny låt.
Prosjektfilen tar med tekst, lydfiler, navn, farger, busser og mutegrupper.
Import tilpasser busser og grupper og beholder oppsettet til eksisterende låter.
Layout/visning av kontrollfeltet og låtlisten følger ikke med til andre enheter.
Hele biblioteket med lyd inkluderer også setlister og erstatter biblioteket etter
bekreftelse. JSON-backup inneholder ikke lyden.
Organiser gjerne originaler og .benken-backup i én mappe per låt i iCloud Drive
eller Google Drive. Importerte lydfiler spilles av lokalt. Det er ikke automatisk
synkronisering med skymappene.

BEHOLDT FRA V26.9
Samme lydmotor og lagring. Synkron multitrack, 32-kanals USB-ruting, 16 busser,
master, mutegrupper, bølgeform, hopping i låten og scrollfunksjoner er beholdt.
Ingen EQ er lagt til.
Grensen er fortsatt 256 MiB DEKODET lyd for aktiv låt, 160 MiB per lagret lydfil
og 256 MiB lagrede lydfiler i én prosjektfil. MP3 sparer filplass, men ikke dekodet
arbeidsminne ved samme lengde, samplingsfrekvens og kanaltall.
Bruk prosjektformat 3 mellom nyere versjoner. Format 1 og 2 kan fortsatt importeres.
V26.10 på begge enheter anbefales for å beholde de nye kanalfargene.

VERIFISERING
100 automatiske tester består, i tillegg til akkord-/innstillingsregresjonen.
Testene bruker modellert DOM, Web Audio og IndexedDB og kontrollerer faktiske
rutingkoblinger, faderverdier, filbytes, lagring, prosjektimport og gruppevalg i modellen.
Ingen ekte Safari-layout eller fysisk iPad/Ui24R-test er gjort her.
Den nye visningen og innstillingsdialogen må fortsatt prøves på iPad.

## LES_MEG_V26_11.txt

BenKen Stage Pro V26.11 – enkel visning og ryddigere mikser

OPPDATER GITHUB
Pakk ut ZIP-filen og last opp ALLE filene, inkludert demo-mappen, til roten i
GitHub-repositoriet. Erstatt filer med samme navn.
V26.11 bruker benken-runtime-v26-11.js og benken-ui-v26-11.css. Last også opp
index.html og sw.js. Gamle programfiler kan bli liggende; de brukes ikke av V26.11.
ZIP-filen er ikke publisert automatisk.
Vent til GitHub Pages er ferdig publisert, og åpne appen på nytt.
Kontroller V26.11 øverst i appen og i mikseren.
Bruk samme nettadresse og nettleserprofil som før. Lagringsnøklene for låter,
setlister og lokale lydfiler er uendret. Du trenger ikke slette nettleserdata.

ENKLERE HOVEDVISNING
Settings vises nå som bare et tannhjul. Setlist, Mixer og Controls er beholdt.
CONTROLS viser/skjuler kontrollfeltet nederst. Trykk på tannhjulet i kontrollfeltet
for å tilpasse det. Innstillingene finnes også under Settings → SCENE.

I kontrollfeltets innstillinger:
- BARE KNAPPER skjuler låtnavn, tidslinje/bølgeform og tidsvisning.
- BARE IKONER PÅ KNAPPENE skjuler knappetekstene.
Valgene kan kombineres. Knappenes tilgjengelighetsnavn beholdes.
Kontrollfeltets tannhjul er fremdeles tilgjengelig når BARE KNAPPER er valgt.
Settings-handlingen i kontrollfeltet vises også som et tannhjul.
Trykker du BØLGEFORM mens bare knapper vises, åpnes tidslinjen igjen.
Du kan fremdeles velge inntil 32 knapper, ALLE KNAPPER, egen tekst/rekkefølge
og visning på én eller flere rader. Trykk LAGRE KONTROLLER for å lagre.
Valgene huskes på denne enheten.

MIKSERINNSTILLINGER I SAMME VINDU
Trykk MIXER og tannhjulet ved siden av lukkeknappen.
Innstillingene vises nå som en egen side inne i mikservinduet.
De bruker ikke et ekstra dialogvindu over mikseren. Redigeringsfeltene ligger
på en vanlig, rullbar side, med tydelige tekstfelt og fargevelgere.

SPOR: kanalnavn, egen farge/AUTO, buss, mono/stereo og mutegrupper per låt.
BUSSER: bussnavn, farge, mono/stereo, USB-utgang og oversikt over tilkoblede spor.
MUTEGRUPPER: gruppenavn og avkryssing av hvilke spor som skal tilhøre gruppene.
LYD OG FILER: import, lydutganger, klargjøring, prosjektfiler, lydtest og visning.

Trykk LAGRE MIKSEROPPSETT for å lagre navn, farger, ruting og gruppemedlemskap.
De siste feltverdiene leses også ved lagring og fanebytte.
FORKAST ENDRINGER / TILBAKE TIL MIKSER lukker innstillingssiden.
Busser og gruppenavn er FELLES FOR ALLE LÅTER. Spornavn, egne kanalfarger,
ruting og gruppemedlemskap lagres per låt. AUTO følger bussens farge.
Å åpne/lukke et skjema gjør ikke AUTO-farger om til egne farger.

UNDER AVSPILLING
Innstillingene kan vises mens lyden spiller. Kanal- og rutingsfeltene er da låst,
og en tydelig melding forklarer hvorfor. Trykk STOPP øverst i samme vindu for
å gjøre navn, farger og ruting redigerbare.
En mislykket lagring beholder det forrige oppsettet. Et foreldet skjema kan
ikke skrive innstillinger til feil låt etter et låtskifte.

SMAL ELLER VANLIG MIKSER
Åpne Mixer → tannhjul → LYD OG FILER → Kanalbredde.
Velg Vanlig mikser eller Smal mikser. Smal viser flere kanaler ved siden av
hverandre, med de samme faderne og nivåmålerne.
Knappen TILBAKE TIL MIKSER viser faderne igjen.
Bredden huskes på denne enheten og kan endres uten å stoppe lyden.

LYDVERKTØYENE ER SAMLET
Under LYD OG FILER finner du:
- + LYDFILER og IMPORTER PROSJEKT.
- Lydutgang, LES UTGANGER og KLARGJØR LYD.
- Oversikt over ruting og hjelp for direkte spor/busser.
- Minneoversikt og lydfiler for gjeldende låt.
- LAG PROSJEKTFIL, deling/nedlasting og testlåten.
Tekniske valg er flyttet ut av selve faderoversikten.
Feilmeldinger som blokkerer avspilling vises også i hovedmikseren.
En tom mikser har en snarvei rett til LYD OG FILER.

IMPORT OG BACKUP
Vanlig avspilling: velg låt → Mixer → tannhjul → LYD OG FILER → + LYDFILER.
Vent til sporene er klare, gå tilbake til mikseren og trykk SPILL.
Appen kopierer lydfilene lokalt. Du trenger ikke eksportere/importere prosjektet
igjen for å spille. Prosjektfiler er til backup eller flytting til andre enheter.
Alle spor skal være eksportert fra samme startpunkt for å ligge i synk.
En .benken-fil med én låt legges til som en ny låt ved import.
Hele biblioteket med lyd inkluderer setlister og erstatter biblioteket etter bekreftelse.
JSON-backup inkluderer ikke lydfilene.
Kanalfarger, navn, busser og mutegrupper er med i prosjektfilen.
Kontrollfeltets visning, ikonvalg og mikserbredde er enhetsvalg og beholdes på
mottakeren ved prosjektimport.
Skymapper i iCloud/Google Drive er til originalfiler og backup. Det er ikke
automatisk synkronisering av senere endringer i disse mappene.

LYDMOTOR OG GRENSER
Samme avspilling, USB-ruting, faderstyring, mute/solo, mutegrupper og tidslinje
som tidligere versjoner. Ingen EQ er lagt til.
Arbeidsminnegrensen er fortsatt 256 MiB dekodet lyd per aktiv låt.
Filgrensen for avspilling er 160 MiB per lydfil. Prosjektfilen har grense
256 MiB lagrede lydfiler. MP3 sparer filplass, men ikke dekodet minne ved
samme lengde, samplingsfrekvens og kanaltall.
Nye prosjektfiler bruker format 3. Format 1 og 2 kan fortsatt importeres.

VERIFISERING
107 automatiske tester består, i tillegg til akkord-/innstillingsregresjonen.
Testene bruker modellert DOM, Web Audio og IndexedDB.
De kontrollerer redigering og lagring, ett mikservindu, nye visningsvalg,
prosjektimport, kanalrouting, filbytes, nivåer, gruppevalg og videre avspilling.
Ingen ekte Safari-layout eller fysisk iPad/Ui24R-test er gjort her.
Den nye innstillingssiden og fargevelgerne må fortsatt prøves på iPad.

## LES_MEG_V26_12.txt

BenKen Stage Pro V26.12 – kontroller i mikseren og enklere lydfiler

OPPDATER GITHUB
Pakk ut ZIP-filen og last opp ALLE filene, inkludert demo-mappen, til roten i
GitHub-repositoriet. Erstatt filer med samme navn.
Last opp index.html, sw.js, benken-runtime-v26-12.js og benken-ui-v26-12.css
sammen med resten av pakken. Gamle versjonerte programfiler kan bli liggende.
Denne ZIP-filen publiserer ikke endringene automatisk.
Vent til GitHub Pages er ferdig publisert og åpne appen på nytt.
Kontroller at det står V26.12 øverst og i mikseren.
Bruk samme nettadresse og nettleserprofil som før. Lagringsnøkler for låter,
setlister og lokale lydfiler er beholdt. Du trenger ikke slette nettleserdata.

KONTROLLER MENS MIKSEREN ER ÅPEN
Kontrollfeltet vises nederst inne i mikservinduet, med knappene du har valgt.
Play/pause, Stopp, forrige/neste låt, mutegrupper og hopping i låten virker
mens mikseren er åpen. Tidslinje og valgfri bølgeform følger samme avspilling.
CONTROLS øverst i mikseren viser/skjuler feltet. Når du lukker mikseren,
flyttes det samme kontrollfeltet tilbake under sangteksten.
Det er ett kontrollfelt med samme innstillinger og tilstand begge steder.
Trykk tannhjulet i kontrollfeltet for å velge knapper, rekkefølge og visning.
BARE KNAPPER og BARE IKONER er fortsatt tilgjengelige.
MIKSER-knappen i kontrollfeltet åpner/lukker mikseren.
Settings, Setlist, Bibliotek, Kolonner og Fullskjerm lukker mikseren når de
trenger hovedvisningen. LYDFILER og MIKSEROPPSETT åpner siden i mikseren.

DOBBELTTRYKK PÅ FADER
Dobbelttrykk på en fader på iPad, eller dobbeltklikk med mus, for 0 dB.
Dette gjelder spor, busser og master, også under avspilling.
Et vanlig drag justerer nivået som før. Pan-kontroller omfattes ikke.
Knappene 0 / 0 dB er beholdt. Å nullstille nivået opphever ikke mute.

RYDDIGERE LYD OG FILER
Åpne MIXER → tannhjul → LYD OG FILER.
Fillisten for den valgte låten vises med en gang:
- Navn i appen, som også er spornavnet i mikseren.
- Originalfilnavnet under, slik at originalen kan gjenkjennes.
- Filtype, filstørrelse og USB-ruting.
- Mono/stereo og lengde når filen er lest av lydmotoren.
Skriv ønsket navn og trykk LAGRE NAVN nederst. Navnet følger også SPOR-fanen.
Originalfilen og lydinnholdet endres ikke. Navnene følger med i prosjektfiler.
FORKAST ENDRINGER lar deg gå tilbake uten å lagre navneendringer.
Ved ny filimport, klargjøring eller oppretting av prosjektfil lagres eventuelle
ventende navneendringer først. En mislykket lagring beholder tidligere data.
Stopp avspillingen for å redigere navn og ruting.

+ LYDFILER legger til vanlige WAV, MP3, M4A, AIFF eller CAF i gjeldende låt.
Appen kopierer filene lokalt og klargjør dem. Du trenger ikke lage og importere
en prosjektfil for å spille. Sporene skal være eksportert fra samme startpunkt.
IMPORTER PROSJEKT åpner en eksisterende .benken-fil med lyd og oppsett.
En låtfil legges til som en ny låt. Et helt bibliotek erstatter biblioteket etter
bekreftelse. JSON-backup inkluderer ikke lydfilene.

BACKUP OG PROSJEKTFIL
Åpne det foldbare feltet Backup og prosjektfil under fillisten.
Velg aktuell låt eller hele biblioteket → LAG PROSJEKTFIL → DEL / LAGRE I FILER
eller LAST NED. Prosjektfilen inkluderer lydfiler, tekst, navn og mikseroppsett.
Bruk iCloud/Google Drive til originalfiler og backup. Appen spiller de lokale
kopiene og synkroniserer ikke senere endringer i skymappene automatisk.

LYDUTGANG OG FLERE VALG
Åpne dette foldbare feltet for lydutgang, LES UTGANGER, minneoversikt,
rutingshjelp, smal/vanlig kanalbredde og testlåten.
KLARGJØR LYD vises ved fillisten når spor trenger ny klargjøring.
Feil som blokkerer avspilling vises også i selve mikseren.
Navn, farger, busser og mutegrupper kan fortsatt endres i mikserinnstillingene.
Busser og gruppenavn er felles; sporoppsett gjelder den enkelte låten.
Kontrollfeltets visning og mikserbredde er enhetsvalg og beholdes ved import.

LYDMOTOR OG GRENSER
Avspilling og USB-ruting er videreført. Ingen EQ er lagt til.
Arbeidsminnegrensen er fortsatt 256 MiB dekodet lyd per aktiv låt.
Filgrensen for avspilling er 160 MiB per lydfil. Prosjektfiler har grense
256 MiB lagrede lydfiler. MP3 sparer filplass, men ikke dekodet minne ved
samme lengde, samplingsfrekvens og kanaltall.
Nye prosjektfiler bruker format 3. Format 1 og 2 kan fortsatt importeres.

VERIFISERING
117 automatiske tester består, i tillegg til akkord-/innstillingsregresjonen.
Testene bruker modellert DOM, Web Audio og IndexedDB. De sjekker blant annet
kontroller i mikseren, låtskifte, fullskjerm, faderbevegelser, lagringsfeil,
filnavn, eksakte lydbytes, prosjektimport og eksisterende lydfunksjoner.
Ingen ekte Safari-layout eller fysisk iPad/Ui24R-test er gjort her.
Prøv kontrollfeltet, dobbelttrykk og filoversikten på iPad etter oppdatering.

## LES_MEG_V26_13.txt

BenKen Stage Pro V26.13 – enklere mikser, tekstfarger og seksjonssynk

OPPDATER GITHUB
Pakk ut ZIP-filen og last opp ALLE filene, inkludert demo-mappen, til roten av
GitHub-repositoriet. Erstatt filer med samme navn.
Last opp index.html, sw.js, benken-runtime-v26-13.js og benken-ui-v26-13.css
sammen med resten av pakken. Gamle versjonerte programfiler kan bli liggende.
Denne ZIP-filen publiserer ikke oppdateringen automatisk.
Vent til GitHub Pages er ferdig publisert, og åpne appen på nytt.
Kontroller at det står V26.13 øverst og i mikseren.
Bruk samme nettadresse og nettleserprofil som før. Lagringsnøklene for låter,
setlister og lokale lydfiler er beholdt. Du trenger ikke slette nettleserdata.

MIKSER OG KONTROLLER
Når mikseren åpnes, viser kontrollfeltet automatisk bare knappene.
Bølgeformen/tidslinjen kommer tilbake når du lukker mikseren, dersom den er
valgt i hovedvisningen. Dette endrer ikke ditt lagrede valg av BARE KNAPPER.
SPILL og STOPP er fjernet fra toppen av mikseren. Bruk kontrollfeltet nederst.
Play blir grønn under avspilling, Stop rød når avspillingen er stoppet.
Ved pause er begge nøytrale. Tilstanden er den samme i og utenfor mikseren.
CONTROLS viser/skjuler feltet. Tannhjulet i feltet velger knapper/rekkefølge.
Spor-, buss- og masterfadere kan fortsatt dobbelttrykkes til 0 dB.

SLETTE LYDFILER
MIXER → tannhjul → LYD OG FILER viser sporene i gjeldende låt.
Trykk SLETT, eller sveip mot høyre på kortet utenfor navnefeltet.
Du får bekrefte eller avbryte. Avspillingen må være stoppet.
Sporet fjernes fra låten. Den lokale lydkopien slettes bare dersom ingen andre
spor eller låter bruker den. Originalfilen i Filer/iCloud/Drive beholdes.
En mislykket lagring fjerner ingen lydfil. Hvis sletting av selve lydkopien
feiler, blir sporet fjernet og den ubrukte kopien liggende; en melding vises.
Navn i appen kan fortsatt endres, med originalfilnavnet synlig under.
Trykk LAGRE NAVN for navneendringer. Ved ny import, klargjøring, prosjektbackup
eller sletting lagres eventuelle ventende navneendringer først.

AUTOSCROLL FØLGER LÅTLENGDEN
Ved denne oppgraderingen slås synk til låtlengde på som standard én gang.
Du kan slå det av igjen, og det valget huskes.
Kontrollfelt → tannhjul:
- AUTOSCROLL FØLGER LÅTLENGDE bruker lydens varighet, eller lagret låtlengde.
- START / PAUSE AUTOSCROLL MED LYDEN kobler start/pause til avspillingen.
Det siste valget er fortsatt valgfritt. AUTO SCROLL kan også startes uten lyd;
da brukes en egen klokke med samme låtlengde.
Valgene finnes også under Settings → LYRICS.
Uten låtlengde brukes manuell scrollhastighet frem til en varighet er kjent.
Med fullstendig seksjonssynk følger scrollingen tidspunktene for seksjonene.
Mellom markørene glir teksten gradvis mot neste overskrift. Dette er ikke
ord-for-ord-synk. Uten seksjonsmarkører fordeles scrollingen over låtlengden.

FARGE PÅ DELER AV TEKSTEN – FOR EKSEMPEL KORING
Settings → LYRICS → EDIT CURRENT SONG.
Marker ordene som skal ha farge i tekstfeltet.
Velg farge ved TEKSTFARGE → FARG MARKERT TEKST, eller trykk KOR for rosa.
Trykk SAVE for sangteksten. Akkordene beholder sine egne farger/plasseringer.
Dette finnes også i tekstfeltet når du legger til/redigerer en sang i Bibliotek.
Fargemarkeringen lagres i sangteksten som {color: #rrggbb}tekst{/color}.
{kor}tekst{/kor} kan også skrives manuelt og vises rosa.
Farger følger JSON- og .benken-backup, og virker også med skjulte akkorder.

INTRO / VERSE / CHORUS I BØLGEFORMEN
Låtlengde alene forteller ikke når vers eller refreng starter.
Seksjonsvisningen bruker derfor starttider du setter for tekstoverskriftene.
1. Legg til seksjoner i sangteksten med INTRO, VERSE, CHORUS osv.
2. Velg BØLGEFORM og SYNK TEKST i kontrollfeltet. SYNK TEKST finnes også
   under Settings → LYRICS og som en valgbar knapp i kontrollfeltet.
3. Trykk SETT NÅ ved første seksjon før avspilling hvis den starter ved 00:00.
4. Spill låten i synkvinduet. Trykk SETT NÅ ved starten av hver ny seksjon.
   Du kan også skrive mm:ss eller sekunder, og hoppe med tidslinjen.
5. Trykk LAGRE SYNK.
Når ALLE starttidene er satt, vises fargede felt med seksjonsnavn i bølgeformen.
Hvert felt varer til neste markør. Siste seksjon varer til låtens slutt.
Starttidene må stå i tekstens rekkefølge, være forskjellige og før låtens slutt.
Du kan lagre ufullstendig synk og fortsette senere. Ingen seksjonslengder
tegnes før alle markørene er klare. Avbryt beholder forrige lagrede synk.
Ved endring av navn/rekkefølge/antall overskrifter må synken settes på nytt.
Vanlige endringer i teksten mellom overskriftene beholder tidspunktene.
Synken følger med i .benken- og JSON-backup sammen med teksten.

LYDFILER, BACKUP OG GRENSER
Vanlig bruk: velg låt → MIXER → tannhjul → LYD OG FILER → + LYDFILER.
Du trenger ikke lage/importere en prosjektfil for å spille lokale spor.
Sporene må være eksportert fra samme startpunkt for å ligge i synk.
Backup og prosjektfil samt Lydutgang og flere valg ligger i foldbare felt.
Arbeidsminnegrensen er fortsatt 256 MiB dekodet lyd per aktiv låt.
Filgrensen for avspilling er 160 MiB per lydfil. Prosjektfiler har grense
256 MiB lagrede lydfiler. MP3 sparer filplass, men ikke dekodet minne ved
samme lengde, samplingsfrekvens og kanaltall. Ingen EQ er lagt til.
Nye prosjektfiler bruker format 3. Format 1 og 2 kan fortsatt importeres.

VERIFISERING
134 automatiske tester består, i tillegg til akkord-/innstillingsregresjonen.
Testene bruker modellert DOM, Web Audio og IndexedDB. De omfatter sletting,
delte lydkopier, lagringsfeil, eksakte lydbytes, tekstfarger, seksjonstider,
autoscroll, kontroller i mikseren og eksisterende lyd- og setlistfunksjoner.
Ingen ekte Safari-layout eller fysisk iPad/Ui24R-test er gjort her.
Prøv særlig sveip, tekstmarkering/fargevalg og synkvinduet på iPad.

## LES_MEG_V26_14.txt

BenKen Stage Pro V26.14 – lesbar seksjonssynk og tekststørrelse i Controls

OPPDATER GITHUB
Pakk ut ZIP-filen og last opp ALLE filene, inkludert demo-mappen, til roten av
GitHub-repositoriet. Erstatt filer med samme navn.
Last opp index.html, sw.js, benken-runtime-v26-14.js og benken-ui-v26-14.css
sammen med resten av pakken. Gamle versjonerte programfiler kan bli liggende.
Denne ZIP-filen publiserer ikke oppdateringen automatisk.
Vent til GitHub Pages er ferdig publisert og åpne appen på nytt.
Kontroller at det står V26.14 øverst og i mikseren.
Bruk samme nettadresse og nettleserprofil som før. Lagringsnøklene for låter,
setlister og lokale lydfiler er beholdt. Du trenger ikke slette nettleserdata.

TEKSTEN HOLDER SEG BEDRE INNENFOR SKJERMEN
Synken bruker fortsatt starttidene du allerede har satt for seksjonene.
Tidligere ble teksten flyttet gradvis mot neste overskrift gjennom hele verset.
Nå brukes den faktiske høyden på teksten i den aktive seksjonen:
- Et vers/refreng som får plass, står i ro og plasseres innenfor leseområdet.
- Lengre seksjoner scroller bare høyden som ikke får plass på skjermen.
- Det er marg over og under teksten, med plass til header og kontrollfelt.
- Siste seksjon får nok plass under seg til å kunne flyttes inn i leseområdet.
Kontrollfeltets plass reserveres også når fullskjermkontrollene skjules, slik
at det aktive verset ikke flyttes eller dekkes når kontrollene vises igjen.
Ved seksjonsbytte flyttes visningen til den nye tekstdelen.
Synken følger seksjoner, ikke tidspunkter for hvert enkelt ord eller hver linje.
Dersom en lang seksjon har ulik sanghastighet underveis, er bevegelsen innenfor
seksjonen fortsatt et anslag ut fra seksjonens varighet.
Sanger uten seksjonstider bruker fortsatt låtlengde/manuell scroll som før.
Tidspunktet beholdes ved pause/gjenopptak og endring av tekststørrelse.

A− / A+ I CONTROLS
1. Trykk tannhjulet i kontrollfeltet.
2. Velg ledige knappeplasser og handlingene:
   Tekststørrelse − (A−) og Tekststørrelse + (A+).
3. Trykk LAGRE KONTROLLER.
ALLE KNAPPER inkluderer også de to nye handlingene.
Eksisterende knapperekke og egne knappetekster blir ikke endret automatisk.
A− og A+ endrer skriften med 2 px per trykk, fra 14 til 52 px.
Størrelsen lagres som appens tekststørrelse og brukes også etter ny åpning.
Knappene fungerer også inne i mikserens kontrollfelt og med BARE IKONER.
Å endre tekststørrelse stopper eller starter ikke lydavspillingen på nytt.
Når autoscroll er synkronisert, beregnes plasseringen på nytt ved samme tidspunkt.
Når synken ikke er aktiv, forsøker visningen å beholde samme synlige tekstlinje.
En mislykket lagring beholder den forrige tekststørrelsen.
FONT SIZE under Settings → LYRICS bruker samme endring og grenser.

SYNK TEKST OG ANDRE FUNKSJONER
SYNK TEKST → SETT NÅ for hver seksjon → LAGRE SYNK er beholdt.
Du trenger ikke sette markørene på nytt ved denne oppdateringen.
Endres navn, rekkefølge eller antall seksjonsoverskrifter, må synken fortsatt
settes på nytt. Vanlig endring av tekst mellom overskriftene beholder tidene.
Tekstfarger/KOR, bølgeform, navn og sletting i lydfillisten er videreført.
Mikseren viser bare kontrollknappene. Bølgeformen kommer tilbake når du lukker den.
Play er grønn under avspilling, Stop rød når avspillingen er stoppet.
Fil- og prosjektformat, USB-ruting, busser og mutegrupper er videreført.
Arbeidsminnegrensen er fortsatt 256 MiB dekodet lyd per aktiv låt.
Filgrensen for avspilling er 160 MiB per lydfil. Prosjektfiler har grense
256 MiB lagrede lydfiler. MP3 sparer filplass, men ikke dekodet minne ved
samme lengde, samplingsfrekvens og kanaltall. Ingen EQ er lagt til.

VERIFISERING
142 automatiske tester består, i tillegg til akkord-/innstillingsregresjonen.
Testene bruker modellert DOM, skjermmål, Web Audio og IndexedDB. De sjekker
lesemarger, korte/lange vers, kontrollfeltets plass, pause/gjenopptak,
tekststørrelse under avspilling, lagring og eksisterende lyd-/setlistfunksjoner.
Ingen ekte Safari-layout eller fysisk iPad/Ui24R-test er gjort her.
Prøv særlig korte og lange vers med ønsket skriftstørrelse på iPad.

## LES_MEG_V26_2.txt

BenKen Stage Pro V26.2 – GitHub-utgaven

NYTT
- Settings → Lyrics: Scroll Speed justeres med ett prosentpoeng per trykk på +/−. Du kan også skrive inn prosentverdien direkte.
- Hastigheten lagres separat for hver sang. 100 % tilsvarer fortsatt 18 piksler per sekund.
- Små scrollbevegelser summeres, også når nettleseren avrunder posisjonen til hele piksler.
- SYNC SCROLL TO SONG DURATION kan bruke låtlengden uten å spille av lydfilen.
- Velg lydfilen som vanlig. Slå på SYNC SCROLL TO SONG DURATION og trykk AUTO SCROLL for å starte timeren.
- Mens synkronisering er på, bestemmer låtlengden hastigheten. Slå av synkronisering for å bruke den manuelle prosentverdien.
- Når lyden spilles av, følger scroll avspillingsposisjonen. Uten avspilling brukes egen timer.
- AUTO SCROLL kan pauses og fortsettes. Synkronisert scroll stopper ved slutten av låtlengden.
- Under Lyrics vises den registrerte låtlengden. Mangler den, velg lydfil på nytt eller angi DURATION under Tools.
- SKJUL AKKORDER fra V26.1 er med.

OPPDATER GITHUB
1. Pakk ut ZIP-filen.
2. Åpne https://github.com/kenhje/BenKenStagePro
3. Velg Add file → Upload files. Last opp index.html og sw.js til repositoryets rotmappe.
4. Velg Commit changes.
5. Når GitHub Pages har publisert, last siden på nytt: https://kenhje.github.io/BenKenStagePro/
   V26.2 skal vises øverst.

Oppdateringen bruker de samme lagringsnøklene som V26/V26.1.
Sanger, settlister og lydlagring beholdes på samme nettadresse/enhet.
Sju automatiserte tester av scroll, hastighet, metadata, opplasting, pause, gjenåpning og avspilling består.
Eksisterende test av skjul/vis akkorder består også.
Testene kjører faktisk appkode i en DOM-modell med simulerte lydmetadata og skjermbilderammer.
Visuell kontroll og lydmetadata på fysisk iPad er ikke testet her.

## LES_MEG_V26_3.txt

BenKen Stage Pro V26.3 – fullskjerm og lydutgangstest

FULLSKJERM
Trykk FULLSKJERM øverst, eller velg Full Screen under Settings → Setlist.
Appens toppmeny skjules. Ett kort trykk i sangområdet viser kontrollene i fire sekunder.
Sveip, vertikal scrolling og bevegelse med flere fingre viser ikke menyen.
Første trykk brukes til å vise menyen. Et nytt trykk kan aktivere en kontroll.
Menyen holdes synlig mens Settings eller en dialog brukes.
AVSLUTT FULLSKJERM går tilbake. Escape gjør det samme med tastatur.
Autoscroll og lydavspilling fortsetter mens kontrollene er skjult.
Dette skjuler appens kontroller. Nettleserens adresselinje styres av nettleseren.

LYDUTGANGSTEST PÅ IPAD / IPHONE
1. Koble til lydkortet som du vil bruke.
2. Velg Settings → Tools → TEST LYDUTGANGER.
3. Les antall kanaler nettleseren rapporterer.
4. TEST 1, TEST 2 osv. sender en kort 440 Hz-tone til den valgte kanalen.
   Tonen har maksimalt nivå omtrent −36 dBFS. Start med lavt volum på lydkortet.
5. Kontroller på lydkortets målere/utganger hvilken kanal som reagerer.
6. LES PÅ NYTT etter at du har byttet eller koblet til lydkortet.
STOPP TESTTONE stopper tonen. Lukk-knappen avslutter testens lydmotor.

Dette undersøker nettleserens tilgang. Et resultat på to kanaler avgjør ikke
hvor mange utganger en egen iOS-app kan bruke med samme lydkort.
V26.3 inneholder en kanaltest; multitrack-mixer med separate hardwareutganger
må testes videre i det egne iOS-prosjektet. Se MULTITRACK_IPAD_IPHONE.txt.

GITHUB-OPPDATERING
Pakk ut ZIP-filen. Åpne https://github.com/kenhje/BenKenStagePro
Velg Add file → Upload files. Last opp index.html og sw.js til rotmappen.
Velg Commit changes. Når GitHub Pages har publisert, last siden på nytt:
https://kenhje.github.io/BenKenStagePro/
V26.3 vises øverst.

TESTSTATUS
Automatiske tester av meny, gester, lydkanalvalg, avbrytelse, lagring, scroll
og skjul/vis akkorder består i en DOM-modell med simulerte lydutganger.
Den eksisterende C++-lydkjernen består tester av routing og strømming.
Fysisk touch, lyd, kanalruting og ytelse på iPad/iPhone gjenstår å teste.

## LES_MEG_V26_4.txt

BenKen Stage Pro V26.4 – utvidet lydtest for Ui24R

UI24R ER MÅLET FOR LIVEOPPSETTET
Denne oppdateringen forbedrer feilsøkingen av USB-lyd før multitrack utvides.
Kanaloversikten bekrefter hva nettleseren rapporterer. Måleren måler signal
før utgangsrutingen inne i appen. Fysisk USB-lyd må fortsatt bekreftes på Ui24R.

NY TEST
Settings → Tools → TEST LYDUTGANGER.
- Tre sekunders 440 Hz-tone i stedet for den tidligere svært korte tonen.
- Velg −36, −24 eller −18 dBFS. Standard er −24 dBFS.
- GJENTA spiller tre sekunder på / ett sekund av i opptil ett minutt.
- Måleren viser målt nåverdi og høyeste målte nivå inne i appen.
- Lydmotorens tilstand og lydklokke vises mens testen går.
- STOPP TESTTONE, ny kanal, nytt nivå eller lukking avbryter forrige test.
- STEREOTEST 1–2 bruker vanlig stereo uten kanalfordeleren fra enkeltkanaltesten.
- LES PÅ NYTT viser alle tilgjengelige enkeltkanaler igjen.

FØRSTE TEST PÅ UI24R
1. Åpne Settings → Patching → Channels → USB DAW 1–16 i Ui24R.
2. Patch USB DAW 1 og 2 til ledige mikserkanaler.
3. I BenKen: velg −24 dBFS, slå på Gjenta og trykk STEREOTEST 1–2.
4. Se på SIGNAL I APPEN og Ui24R-kanalenes målere samtidig.
5. Trykk STOPP. Velg LES PÅ NYTT og test USB-kanalene enkeltvis.

Målt signal i appen og manglende signal i Ui24R viser at lydgenereringen
fungerer internt; USB-overføring og patching må undersøkes videre.
Manglende signal i appens måler peker mot generering/lydmotor.
Hvis stereo virker og enkeltkanaltesten ikke gjør det, har vi snevret inn
problemet til forskjellene mellom de to lydoppsettene. Ingen av resultatene
alene beviser årsaken.

GITHUB
Pakk ut ZIP-filen. Last opp index.html og sw.js til rotmappen i
https://github.com/kenhje/BenKenStagePro og velg Commit changes.
Etter publisering: last siden på nytt. V26.4 vises øverst.

Automatiske tester av 32 kanaler, måling, stereo, gjentakelse, avbrytelse
og eksisterende fullskjerm/scroll/lagring består.
Testene bruker DOM-modell og simulerte lydnoder. USB-lyd på fysisk Ui24R
er ikke verifisert her.

Ui24R-patching, HARMANs veiledning:
https://help.harmanpro.com/ui24r-multitrack-recording-with-a-daw
https://help.harmanpro.com/exploring-the-patching-section-of-the-ui24r

## LES_MEG_V26_5.txt

BenKen Stage Pro V26.5 – multitrack til Ui24R

OPPDATER GITHUB
Denne versjonen har nye JS-/CSS-filer. Det er ikke nok å laste opp bare index.html og sw.js.
Last opp disse sju filene til rotmappen i https://github.com/kenhje/BenKenStagePro:
  index.html
  sw.js
  stage-core.js
  stage-project.js
  stage-audio.js
  stage-mixer.js
  mixer.css
Velg Commit changes. Når GitHub Pages er ferdig, last appen på nytt. V26.5 vises øverst.
Ikonene og manifestet er også med i ZIP-filen. Samme lagringsnøkler brukes som før.

FØRSTE PRØVE MED UI24R
1. Koble Ui24R til iPad/iPhone som ved den fungerende lydtesten.
2. Åpne MIXER / LYD. Velg IMPORTER PROSJEKT under «Lydfiler, iCloud Drive og Google Drive».
3. Importer demo/BenKen_Ui24R_Test.benken fra denne ZIP-filen.
   Den legges til som en egen låt; eksisterende sanger og settlister beholdes.
4. Velg «Ui24R / separate USB-kanaler». Kontroller 32 kanaler ved 48 kHz.
5. Patch USB DAW 1, 2 og 3 til ledige mikserkanaler i Ui24R.
6. Trykk SPILL. Testen varer 15 sekunder:
   0–4 sekunder: tone på USB 1.
   4–8 sekunder: tone på USB 2.
   8–15 sekunder: toner på begge, 1 og 2.
   Klikk på USB 3 gjennom hele testen.
Testfilene har lavt signalnivå, omtrent −24 dBFS. Juster lyttevolum på lydkortet.

LEGG INN EGNE LYDFILER
Velg låten, åpne MIXER / LYD og trykk + LEGG TIL LYDFILER.
Velg flere stems fra Filer: På min iPad/iPhone, iCloud Drive eller Google Drive.
Google Drive må være installert og aktivert som en plassering i Filer.
Vent til filene er kopiert og klargjort før du lukker appen.
Hvert spor får nivå, mute/solo, mono/stereo, stereobalanse og USB-utgang.
Masterfaderen styrer alle utgangene. Innstillingene lagres separat per låt.
Sporene starter på samme lydklokke. Pause/fortsett bruker samme posisjon for alle.
Eksporter stems fra samme startpunkt i Reaper, med stillhet frem til hvert instrument begynner.
Nye spor starter på 1–2; filer med click/klikk/clix/metronom i navnet foreslås som mono på 3.
Mono-filer oppdages under klargjøring. Kontroller format og routing før bruk.

LYDUTGANGER
I USB-modus er utgangene USB DAW-kanaler på Ui24R, ikke fysiske XLR-utgangsnumre.
Manglende utganger blokkerer avspilling. Det gjøres ingen automatisk nedmiks av klikk til 1–2.
Stereoøving velges uttrykkelig og mikser alle spor, også klikk, til 1–2.
Når lydkortet byttes, stopp avspillingen og bruk LES UTGANGER / KLARGJØR LYD.
Format, utganger, filimport og sletting endres mens avspillingen er stoppet.
Nivå, mute/solo, stereobalanse og master kan justeres under avspilling.

HVOR LYDEN LAGRES
Importerte lydfiler kopieres til lokal nettleserlagring på denne enheten.
Avspilling bruker de lokale kopiene, også uten nettilgang etter at appen er lastet/cachet.
En fil i iCloud Drive eller Google Drive er en separat original/backup.
Dette er manuell import/eksport via Filer; det er ikke automatisk synkronisering.
Nettleserlagring kan ryddes bort eller slettes. Ha prosjektfiler med lyd i tillegg.

PROSJEKTFILER MED LYD
1. Velg «Aktuell låt med lyd» eller «Hele biblioteket med lyd».
2. Trykk LAG PROSJEKTFIL. Avspillingen må være stoppet.
3. Velg DEL / LAGRE I FILER og lagringssted, eller LAST NED.
   En nedlastet prosjektfil kan flyttes videre i Filer til iCloud Drive eller Google Drive.
4. På en annen enhet: IMPORTER PROSJEKT og velg .benken-filen.
Låt-prosjekter legges til som en ny låt. Biblioteksprosjekter erstatter bibliotek og settlister etter bekreftelse.
Filer kopieres lokalt ved import. Vanlig JSON-backup tar bare tekst og innstillinger.
Forrige klargjorte lyd frigjøres når en prosjektfil lages; trykk KLARGJØR LYD før neste avspilling.

KAPASITET OG STATUS
Grensesnittet har en grense på 32 lydspor per låt. Dette er ikke et målt kapasitetstall for iPad 6.
Nettversjonen dekoder én låt om gangen, med en grense på 256 MB ferdig dekodet lyd.
Færre, kortere eller mono-filer reduserer minnebruken. Komprimering alene reduserer ikke dekodet minne.
Prosjekteksport begrenses til 256 MB lyd per prosjektfil. Bruk enkeltlåt-filer for større bibliotek.
Gamle automatisk opprettede lyd-ID-er uten en lokal fil regnes som tekstlåter. Eksplisitt valgte, manglende mikserfiler blokkerer full backup.
41 automatiserte tester av motor, ruting, mikser, filer, backup, lagring og eksisterende funksjoner består.
I tillegg består tidligere UI-test av skjul/vis akkorder. Testene bruker en DOM-/lydmodell.
Faktisk multitrack-ytelse, USB-kanalskille, skydeling og langvarig kjøring på fysisk iPad/iPhone er ikke testet her.
Prøv først testprosjektet og deretter hele settet på ditt faktiske utstyr.

KILDER
Filer og tredjeparts skylagring, Apple:
https://support.apple.com/en-us/102238
WebKit lagringspolicy:
https://webkit.org/blog/14403/updates-to-storage-policy/
Ui24R USB-ruting, HARMAN:
https://help.harmanpro.com/ui24r-multitrack-recording-with-a-daw

## LES_MEG_V26_6.txt

BenKen Stage Pro V26.6 – spor og utgangsbusser

Dette er en GitHub-oppdatering. Den er ikke lagt ut automatisk.
Pakk ut ZIP-filen. Last opp disse filene til roten i GitHub-repositoriet:
index.html, sw.js, stage-core.js, stage-project.js, stage-audio.js,
stage-mixer.js, mixer.css, manifest.webmanifest, icon-192.png, icon-512.png.
Last også opp hele demo-mappen. Filen skal ligge på:
demo/BenKen_Ui24R_Busstest.benken
GitHub: Add file → Upload files → dra inn filene og demo-mappen → Commit changes.
Åpne GitHub Pages igjen etter publisering. Kontroller V26.6 øverst.
Eksisterende sanger, spillelister og lokale lydfiler bruker de samme lagringsnøklene.

SPOR
Opptil 32 spor i prosjektmodellen. Velg flere WAV/MP3/M4A/AIFF/CAF-filer med
+ LYDFILER øverst i mikseren. Hvert spor har navn, nivå, panorering/balanse,
mute, solo og måler. Alle filer må være eksportert fra samme startpunkt.
Nye backingfiler går til buss 1, filnavn med click/klikk/clix/metronom til buss 2.
Velg UTGANGSBUSS nederst i sporstripen for å sende sporet til en annen buss.
Eldre låter beholder direkte USB-ruting; velg en buss når du ønsker å endre det.
For direkte USB kan sporet fortsatt velges som mono/stereo og rutes per spor.

UTGANGER / BUSSER
16 globale utgangsbusser med navn, nivå, mute, måler og mono/stereo USB-ruting.
Flere spor kan dele en buss. F.eks. trommer, bass og keyboard på samme backingbuss,
mens klikk bruker sin egen buss. Bussnivå og mute påvirker alle spor på bussen.
Busser gjelder alle låter på denne enheten. Master lagres fortsatt per låt.
VIS ALLE 16 BUSSER viser også ubrukte busser; ellers vises de som låten bruker.
Busser som ikke brukes av låten trenger ingen tilgjengelig fysisk utgang.
Ruting og mono/stereo kan endres mens avspillingen er stoppet.
Nivå, pan, mute/solo og master kan endres under avspilling.
Standard: Buss 1 Backing → stereo USB 1–2; buss 2 Klikk → mono USB 3.
Øvrige standardbusser bruker stereopar 5–6, 7–8, ... 31–32. Juster før bruk.
Spor med direkte USB-ruting går utenom bussfaderne, men gjennom master.

UI24R
USB-numrene er USB DAW-kanaler. I Ui24R:
Settings → Patching → Channels → USB DAW 1–16 / 17–32.
Patch ønskede USB-returer til ledige mikserkanaler. Behold liveinngangene dine.
Manglende utgang på et brukt spor eller en brukt buss blokkerer avspilling.
Stereoøving er et separat valg og sender også klikk til stereo 1–2.

TESTLÅT
Trykk + TESTLÅT −12 dBFS øverst i mikseren. Dette legger til en ny testlåt,
uten å erstatte sanger eller spillelister. demo-mappen må være lastet opp.
Du kan også bruke IMPORTER PROSJEKT og velge .benken-filen manuelt.
Testen varer 15 sekunder: 0–4 s venstre USB 1, 4–8 s høyre USB 2,
8–15 s begge sider. Klikk på USB 3 hele veien.
Filene har omtrent −12 dBFS toppnivå. Ved 0 dB på spor, buss og master
skal appens måler vise omtrent −12 dBFS. MAKS husker høyeste målte verdi;
NULLSTILL PEAK tømmer denne. Ingen automatisk normalisering er lagt til.
Denne testen har ca. 12 dB høyere filnivå enn forrige demo.

LYDFILER, ICLOUD DRIVE OG GOOGLE DRIVE
+ LYDFILER åpner filvelgeren for lyd. IMPORTER PROSJEKT åpner .benken-filer.
Prosjektimporten har ikke filtypefilter; selve innholdet valideres før import.
Velg lydfiler via Filer, fra På min iPad/iPhone, iCloud Drive eller Google Drive.
Google Drive må være aktivert som plassering i Filer. Last ned skyfilen først
hvis den ikke er tilgjengelig. Appen kopierer lydfilene lokalt til avspilling.
Dette er ikke automatisk skysynkronisering. Ikke slett nettstedsdata for appen.
LAG PROSJEKTFIL under lagringsseksjonen lager en backup med lyd, tekst og miks.
Velg Aktuell låt eller Hele biblioteket, deretter DEL / LAGRE I FILER / LAST NED.
JSON-backup inneholder tekst og mikserinnstillinger, men ikke lydfilene.

PROSJEKTER MED BUSSER
V26.6 .benken-filer inkluderer bussoppsett. En låt legges til ved import.
Hvis en importert buss allerede finnes med samme navn, nivå, mute og USB-ruting,
brukes den. Hvis den er forskjellig, kopieres den til en ledig buss.
Dette hindrer at eksisterende låters busser blir endret av en låtimport.
Hvis alle 16 busser brukes og ingen passer, avvises importen uten endringer.
Hele biblioteket erstatter biblioteket etter bekreftelse og tekstbackup.
Bruk V26.6 eller nyere på mottakeren for prosjekter med bussruting.
Nye prosjektfiler har formatversjon 2. V26.5 avviser dem i stedet for å overse
bussrutingen. V26.6 kan fortsatt importere de eldre formatversjon 1-filene.

TESTING OG GRENSER
Automatiske tester bruker modellert DOM, Web Audio og IndexedDB.
Det er ikke en ekte Safari- eller iPad-test. Den nye bussrutingen må testes på Ui24R.
Kenneth har bekreftet at egne lydspor i V26.5 spiller med normalt nivå på Ui24R.
Ingen EQ er lagt til. MIDI, AUv3, waveform/regionredigering og automatisk
skysynkronisering er ikke del av denne oppdateringen.
Nettversjonen dekoder hele den aktive låten i minnet, med grense 256 MB.
32 spor er modellens maksimum, ikke et løfte om kapasitet på en eldre iPad.
Prosjektfiler kan inneholde opptil 256 MB lyd; bruk per-låt-filer for store bibliotek.

## LES_MEG_V26_7.txt

BenKen Stage Pro V26.7 – mikserfadere, busskobling og minnevisning

GITHUB-OPPDATERING
Pakk ut ZIP-filen. Last opp alle rotfilene til roten i GitHub-repositoriet:
index.html, sw.js, stage-core.js, stage-project.js, stage-audio.js,
stage-mixer.js, mixer.css, manifest.webmanifest og de to ikonfilene.
Last opp hele demo-mappen også. Kontroller at versjonen øverst viser V26.7.
Appen er ikke oppdatert på GitHub automatisk.
De samme lagringsnøklene brukes for sanger, setlister og lokale lydfiler.

NY MIKSER
Tydeligere kanalstriper med spornavn nederst på en farget etikett.
Fadere med større sølvfargede håndtak, dB-skala og markering ved 0 dB.
Vertikale nivåmålere ved siden av faderne, peakverdi og master peak hold.
Faderområdet går fra helt av til +6 dB. 0 dB er ved 75 % av faderbanen.
Faderne har en dB-basert taper med finere kontroll rundt normalt arbeidsnivå.
0 / 0 dB-knappene eller dobbelttrykk på faderen gir uendret nivå (0 dB).
Nivåene du allerede har lagret endres ikke av at du åpner den nye mikseren.
Mute/solo og pan kan brukes under avspilling. Ruting endres mens lyden er stoppet.
Ingen EQ er lagt til.

SPOR OG UTGANGER / BUSSER
Opptil 32 spor i prosjektmodellen og 16 felles utgangsbusser.
Flere spor kan dele en buss. Bussnivå og mute gjelder alle spor som er koblet til den.
Master lagres per låt. Bussinnstillingene gjelder alle låter på denne enheten.
Nye backingfiler kobles til buss 1 (stereo USB 1–2).
Filnavn med click/klikk/clix/metronom kobles til buss 2 (mono USB 3).
Velg UTGANGSBUSS på hvert spor og USB UT på bussene for andre oppsett.
Den lille etiketten øverst i hver stripe viser signalveien.

ELDRE SPOR SOM GÅR DIREKTE TIL USB
Eldre låter kan gå direkte til USB og dermed utenom bussfaderne.
Dette markeres nå tydelig over mikseren og på den enkelte sporstripen.
KOBLE DIREKTE SPOR TIL BUSSER lager busskoblinger med samme fysiske USB-ruting,
uendret nivå og uendrede mute/solo-valg. Eksisterende busser som brukes av
andre låter beholder innstillingene sine. Klikk/mono-pan som tidligere var
uten virkning nullstilles for å beholde det hørbare nivået etter busskobling.
Hvis ingen ledige busser passer, avbrytes hele endringen uten delvis lagring.
Du kan fortsatt velge Direkte USB i sporstripen hvis du ønsker det.

MINNEGRENSER – WAV OG MP3
Nettversjonen laster og dekoder hele den aktive låten i minnet.
Arbeidsminnegrensen er fortsatt 256 MiB dekodet lyd per låt. Den er ikke hevet.
MP3 reduserer filstørrelse og lagringsbehov, men lyden dekodes til 32-bit float PCM.
Ved samme lengde, samplingsfrekvens og kanaltall blir arbeidsminnebehovet likt.
Eksempel ved 48 kHz: ett stereospor på 4 minutter krever ca. 87,9 MiB dekodet lyd.
Tre slike stereospor krever ca. 263,7 MiB, også om originalfilene er små MP3-filer.
En ekte mono-fil bruker halvparten av minnet til en tilsvarende stereo-fil.
Mono-valget på en stereo-fil endrer avspillingen, men gjør ikke originalfilen
eller den dekodede filbufferen mindre. Eksporter en ekte mono-fil der det passer.
Mute frigjør ikke minnet for et spor, fordi det må kunne åpnes under avspilling.

Minnevisningen under mikseren viser behovet i MiB og markerer overskridelser.
Ved overskridelse står det Minst, fordi resten av filene ennå ikke er dekodet.
WAV-hodet brukes til å stoppe før en ny stor fil dekodes over totalgrensen,
når WAV-formatet kan leses. Samme lydfil brukt flere ganger deles i minnet.
Ved minnefeil starter ingen delvis låt. De importerte originalfilene beholdes.
Fjern noen spor og prøv igjen, eller bruk kortere/mono-filer. Sporfjerning sletter
ikke originalfilen fra den lokale lyddatabasen.

Det finnes to andre, separate grenser: 160 MiB per innlastet lydfil, og
256 MiB lagrede lydfiler i hver eksportert prosjektfil. MP3 kan hjelpe med
lagrings- og prosjektfilgrensene, men ikke grensen for dekodet arbeidsminne.
En egen app med en lydmotor som leser lokale filer i mindre deler er neste
retning for større multitrack-låter. Dette er ikke implementert i denne nettversjonen.

UI24R
USB-numrene betyr USB DAW-kanaler. I Ui24R:
Settings → Patching → Channels → USB DAW 1–16 / 17–32.
Patch ønsket USB-retur til en ledig mikserkanal. Behold liveinngangene dine.
Brukte spor/busser med manglende utganger blokkerer avspilling.
Ubrukte busser blokkerer ikke avspilling. VIS ALLE 16 BUSSER viser også de ubrukte.
Stereoøving sender alle spor, også klikk, til stereo 1–2.
Under Lydtest og USB-ruting ligger KLARGJØR LYD og + TESTLÅT −12 dBFS.
Testlåten er samme 15-sekunders buss-test som før, nå med oppdatert metadata.
0–4 s venstre USB 1, 4–8 s høyre USB 2, 8–15 s begge, klikk USB 3 hele veien.

LYDFILER, ICLOUD OG GOOGLE DRIVE
+ LYDFILER importerer WAV/MP3/M4A/AIFF/CAF fra Filer, iCloud eller Google Drive.
Google Drive må være aktivert som plassering i Filer. Appen kopierer filene lokalt.
Dette er ikke automatisk skysynkronisering. Alle spor må ha samme startpunkt.
IMPORTER PROSJEKT åpner .benken-filer. Innholdet valideres før import.
LAG PROSJEKTFIL under lagringsseksjonen tar med lyd, tekst, miks og bussoppsett.
Velg Aktuell låt eller Hele biblioteket, så DEL / LAGRE I FILER eller LAST NED.
JSON-backup inneholder ikke lydfilene. Bruk prosjektfiler til backup med lyd.
En låt legges til uten å erstatte setlister. Bussoppsett som er forskjellige
kopieres til ledige busser. Et helt biblioteksprosjekt erstatter biblioteket etter
bekreftelse og tekstbackup. Ikke slett nettstedsdata uten å ha backup med lyd.
Prosjektformat 2 kan leses av V26.6/V26.7. Format 1 fra eldre versjoner kan importeres.
V26.5 avviser format 2, slik at den ikke overser bussruting.

VERIFISERING
Automatiske tester bruker modellert Web Audio, DOM og IndexedDB.
Ingen ekte Safari-layout eller fysisk iPad/Ui24R-test er utført her.
Busskobling, ny faderbetjening og utseendet må derfor prøves på iPad.
32 spor er modellens maksimum og er ikke et løfte om kapasitet på iPad 6.

## LES_MEG_V26_8.txt

BenKen Stage Pro V26.8 – scenekontroller, mutegrupper og bølgeform

OPPDATER GITHUB
Pakk ut ZIP-filen. Last opp alle filene i rotmappen og hele demo-mappen til roten
i GitHub-repositoriet. Behold navn og mapper. Kontroller V26.8 øverst etter publisering.
Nye filer som også må lastes opp: stage-performance.js og performance.css.
Alle eksisterende sanger, setlister og lydfiler bruker de samme lagringsnøklene.
Dette er en ZIP-oppdatering. Den er ikke publisert automatisk.

FILER PER LÅT
En mappe per låt i iCloud Drive eller Google Drive er et ryddig oppsett:
BenKen / Låtnavn / Lydfiler – originalspor som Drums.wav, Bass.wav, Keys.wav, Click.wav.
BenKen / Låtnavn / Låtnavn.benken – prosjektbackup med tekst, lydfiler og miks.
Velg en låt i appen, åpne MIKSER, trykk + LYDFILER og velg sporene for den låten.
Alle spor må være eksportert fra samme startpunkt, også om et instrument begynner senere.
Appen kopierer filene lokalt og kobler dem til den valgte låten. Den oppretter ikke
mapper i skytjenesten og følger ikke senere endringer i originalfilene automatisk.
Originalfilene kan være i iCloud, Google Drive eller På min iPad/iPhone.
Google Drive må være aktivert som plassering i Filer. Last ned skyfilene før bruk
hvis de ikke allerede er tilgjengelige.

I mikseren: åpne LYDFILER FOR DENNE LÅTEN for oversikt over spor og originalfilnavn.
LAG PROSJEKTFIL i samme del lager en .benken-fil som kan lagres i låtens mappe.
Velg Aktuell låt for én låt, eller Hele biblioteket for bibliotek og setlister.
JSON-backup tar vare på tekst, setlister og mikserinnstillinger, men ikke lydfilene.
Ta derfor også en bibliotekbackup for setlistene når du lagrer låter hver for seg.
En .benken-låt legges til uten å erstatte eksisterende låter eller setlister.
Hele biblioteksprosjekter erstatter biblioteket etter bekreftelse og tekstbackup.

STORE KNAPPER NEDERST
Standardknappene er Forrige, Spill/pause, Stopp, Neste, Mute, bakover, fremover og Mikser.
Trykk KONTROLLER nederst for å velge inntil 12 knapper og rekkefølgen på dem.
Du kan også gi knappene egne tekster. Skjul fjerner den aktuelle plassen.
Mulige handlinger: transport, mute av appens lyd, hver av de seks mutegruppene,
hopp bakover/fremover, til start, mikser, lydfiler, autoscroll og fullskjerm.
Knappelisten kan rulles sidelengs på små skjermer.
Knappelayouten gjelder denne enheten; du kan ha ulike oppsett på Mac og iPad.
Innstillingene finnes også under Settings → SCENE.
Du kan skjule hele feltet og åpne innstillingene igjen fra SCENE.

SPILL / PAUSE / STOPP
SPILL starter alle ferdig klargjorte lydspor samtidig. Nytt trykk pauser.
STOPP avslutter avspillingen og setter posisjonen til starten av låten.
NESTE og FORRIGE følger samme låtrekkefølge som knappene øverst.
MUTE muter appens samlede lyd, også klikk, uten å endre faderne eller stoppe tidslinjen.
Den muter ikke mikrofoner, TH-U eller andre lydkilder som ikke går gjennom appen.
Bruk en mutegruppe for å mute bare utvalgte backing-spor og beholde klikk.
Master-mute følger låtskifte til du slår den av, og er av ved ny oppstart.

SEKS MUTEGRUPPER
I mikseren: åpne GRUPPER på et spor og velg gruppene det skal tilhøre.
Et spor kan være med i flere grupper. Medlemskap lagres per låt.
Gruppeknappene over mikseren slår gruppene av/på. De kan også legges nederst via KONTROLLER.
Gi gruppene egne navn, som Gitar, Kor eller Perkusjon, i KONTROLLER.
Navnene gjelder alle låter. Bruk forskjellige navn på de seks gruppene.
Gruppene summeres: er minst én av sporets grupper mutet, er sporet mutet.
En aktiv gruppe kan ikke overstyres av SOLO eller av sporets egen MUTE-knapp.
Når gruppen slås av, beholdes eventuelle individuelle mutevalg.
Aktive grupper følger låtskifte i samme økt. De starter avslått ved ny oppstart.
Gruppemedlemskap og navn tas med i prosjektbackup, men aktive mutevalg i økten gjør ikke det.

BØLGEFORM OG HOPP I LÅTEN
Trykk BØLGEFORM nederst for å vise bølgeformen til et valgt lydspor.
Velg hvilket spor som vises i nedtrekkslisten. Valget huskes per låt.
Bølgeformen beregnes fra den ferdig dekodede lydfilen og er før fader/mute.
Den er skalert for visning; grafikken er ikke en nivåmåler og endrer ikke lydnivået.
Grafikken bygger bare på lokale, klargjorte lydfiler. Ingen bølgeform tegnes for manglende lyd.
Dra på tidslinjen eller bølgeformen for å velge posisjon. Alle lydspor, også klikk,
flyttes til samme tidspunkt. Under dragging vises posisjonen uten at lyden spiller.
Når du slipper fortsetter avspillingen hvis låten spilte før du begynte å dra.
Var låten pauset, blir den værende pauset på den nye posisjonen.
STOPP og låtskifte avbryter dragging/hopp uten å starte den gamle låten på nytt.
Hopp-knappene bruker 10 sekunder som standard. Velg 1–120 sekunder i KONTROLLER.
Der kan du også slå av hopping under avspilling; hopping mens pauset er fortsatt mulig.
Når SYNC SCROLL TO SONG DURATION er valgt, følger teksten det nye tidspunktet.
Dette er fri posisjonering. Regioner, løkker og arrangering av vers/refreng er ikke lagt til.

FULLSKJERM
Både øverste og nederste kontrollfelt skjules i fullskjerm.
Trykk på tekstflaten for å vise dem midlertidig. Et første trykk starter ikke lyd.
Kontroller blir tilgjengelige mens du bruker innstillinger eller drar i tidslinjen.
Nederste kontrollfelt dekker ikke den nederste teksten i vanlig visning.

BUSSER OG MINNE
De 16 utgangsbussene og Ui24R-rutingen fra V26.7 er beholdt. Ingen EQ er lagt til.
Arbeidsminnegrensen er fortsatt 256 MiB dekodet lyd per aktiv låt.
MP3 sparer filplass, men reduserer ikke dekodet minne ved samme lengde, rate og kanaltall.
En egen mono-fil bruker halvparten av en tilsvarende stereo-fil. Mute frigjør ikke minnet.
Filgrensen er 160 MiB per lydfil og prosjektfilgrensen er 256 MiB lagrede lydfiler.
32 spor er modellens maksimum og er ikke et kapasitetsløfte for iPad 6.
En innebygd lydmotor med lesing i mindre deler er fortsatt neste retning for større låter.

PROSJEKTFORMAT
Nye eksporterte prosjektfiler bruker format 3 for å ta med mutegrupper.
Bruk V26.8 eller nyere på mottakeren. Eldre utgaver avviser format 3.
V26.8 leser fortsatt de eldre formatene 1 og 2.
Ved låtimport tilpasses busser og mutegrupper etter oppsett/navn. Eksisterende låters
busser og gruppenavn endres ikke hvis de er i bruk. Det brukes ledige plasser.
Hvis det ikke finnes plass, avvises importen uten å endre biblioteket.
Prosjektfilene tar ikke med enhetens knapper, feltvisning eller hoppeinnstillinger.

VERIFISERING
Automatiske tester bruker modellert DOM, Web Audio og IndexedDB.
Ingen ekte Safari-layout eller fysisk iPad/Ui24R-test er gjort her.
Test nye knapper, dragging og mutegrupper med Ui24R før du bruker dem live.

## LES_MEG_V26_9.txt

BenKen Stage Pro V26.9 – rettelse av oppstart og prosjektimport

OPPDATER GITHUB
Pakk ut ZIP-filen. Last opp ALLE de utpakkede filene, inkludert demo-mappen,
til roten i GitHub-repositoriet. Velg å erstatte eksisterende filer med samme navn.
Denne pakken inneholder samlet programkode og stilark:
- benken-runtime-v26-9.js
- benken-ui-v26-9.css
Last også opp index.html og sw.js. Eldre stage-*.js og CSS kan bli liggende.
De brukes ikke av V26.9. ZIP-filen er ikke publisert automatisk.
Vent til GitHub Pages-publiseringen er ferdig. Lukk og åpne nettsiden/appikonet
igjen. Kontroller V26.9 både øverst i appen og inne i mikseren.
Bruk samme nettadresse og nettleserprofil som før for tilgang til lokalt lagret lyd.
Sanger, setlister og lyd bruker samme lagringsnøkler som tidligere.
Du trenger ikke slette Safari-data eller installere appen på nytt.
Hvis oppdateringen er ufullstendig, vises en melding før appen endrer lagrede data.
Last i så fall opp hele pakken og bruk LAST PÅ NYTT.

DETTE ER RETTET
Gamle og nye hjelpefiler kunne blandes ved oppdatering. Det kan stoppe oppstarten
og gi «Cannot access uninitialized variable» etterpå. Feilen er gjenskapt i test.
V26.9 bruker én versjonsmerket programfil og ett tilhørende stilark.
Scenepanelet monteres etter at delt oppstartsdata er initialisert.
Hvis visningen feiler etter at en prosjektimport er lagret, beholdes lydfilene.
Avvist import før lagring rydder fremdeles bare opp de nye kopiene.
KLARGJØR LYD er flyttet opp ved statusfeltet og er tilgjengelig ved feil/gjenopptaking.

SLIK TESTER DU
1. Velg en låt i appen. Åpne MIXER / LYD.
2. Trykk + LYDFILER og velg sporene. Vent til de er klargjort, og trykk SPILL.
3. Prosjektfil er valgfritt: bruk den til backup eller flytting til en annen enhet.
   Du trenger ikke eksportere og importere låten igjen for vanlig avspilling.
4. Har du allerede en lagret .benken-fil, bruk IMPORTER PROSJEKT direkte.
   Den legges til som en ny låt. Ikke importer de løse lydfilene først.
5. Hvis spor står som «Ikke klargjort», trykk KLARGJØR LYD ved statusmeldingen.
   Meldingen forklarer om filer mangler, minnegrensen overskrides eller USB-utganger
   ikke er tilgjengelige. En prosjektfil fra før feilen kan importeres på nytt for
   å gjenopprette lydkopier som mangler; denne oppdateringen kan ikke gjenskape slettet lyd.
6. For test uten Ui24R: velg Stereoøving. Da mikses også klikk til utgang 1–2.
   For live bruk: koble til Ui24R, velg separate USB-kanaler og bruk LES UTGANGER.

FILER PER LÅT
En mappe per låt i iCloud Drive eller Google Drive er et ryddig oppsett:
BenKen / Låtnavn / Lydfiler – originalspor som Drums.wav, Bass.wav, Keys.wav, Click.wav.
BenKen / Låtnavn / Låtnavn.benken – prosjektbackup med tekst, lydfiler og miks.
Velg en låt i appen, åpne MIKSER, trykk + LYDFILER og velg sporene for den låten.
Alle spor må være eksportert fra samme startpunkt, også om et instrument begynner senere.
Appen kopierer filene lokalt og kobler dem til den valgte låten. Den oppretter ikke
mapper i skytjenesten og følger ikke senere endringer i originalfilene automatisk.
Originalfilene kan være i iCloud, Google Drive eller På min iPad/iPhone.
Google Drive må være aktivert som plassering i Filer. Last ned skyfilene før bruk
hvis de ikke allerede er tilgjengelige.

I mikseren: åpne LYDFILER FOR DENNE LÅTEN for oversikt over spor og originalfilnavn.
LAG PROSJEKTFIL i samme del lager en .benken-fil som kan lagres i låtens mappe.
Velg Aktuell låt for én låt, eller Hele biblioteket for bibliotek og setlister.
JSON-backup tar vare på tekst, setlister og mikserinnstillinger, men ikke lydfilene.
Ta derfor også en bibliotekbackup for setlistene når du lagrer låter hver for seg.
En .benken-låt legges til uten å erstatte eksisterende låter eller setlister.
Hele biblioteksprosjekter erstatter biblioteket etter bekreftelse og tekstbackup.

STORE KNAPPER NEDERST
Standardknappene er Forrige, Spill/pause, Stopp, Neste, Mute, bakover, fremover og Mikser.
Trykk KONTROLLER nederst for å velge inntil 12 knapper og rekkefølgen på dem.
Du kan også gi knappene egne tekster. Skjul fjerner den aktuelle plassen.
Mulige handlinger: transport, mute av appens lyd, hver av de seks mutegruppene,
hopp bakover/fremover, til start, mikser, lydfiler, autoscroll og fullskjerm.
Knappelisten kan rulles sidelengs på små skjermer.
Knappelayouten gjelder denne enheten; du kan ha ulike oppsett på Mac og iPad.
Innstillingene finnes også under Settings → SCENE.
Du kan skjule hele feltet og åpne innstillingene igjen fra SCENE.

SPILL / PAUSE / STOPP
SPILL starter alle ferdig klargjorte lydspor samtidig. Etter eksport: bruk KLARGJØR LYD før SPILL. Nytt trykk pauser.
STOPP avslutter avspillingen og setter posisjonen til starten av låten.
NESTE og FORRIGE følger samme låtrekkefølge som knappene øverst.
MUTE muter appens samlede lyd, også klikk, uten å endre faderne eller stoppe tidslinjen.
Den muter ikke mikrofoner, TH-U eller andre lydkilder som ikke går gjennom appen.
Bruk en mutegruppe for å mute bare utvalgte backing-spor og beholde klikk.
Master-mute følger låtskifte til du slår den av, og er av ved ny oppstart.

SEKS MUTEGRUPPER
I mikseren: åpne GRUPPER på et spor og velg gruppene det skal tilhøre.
Et spor kan være med i flere grupper. Medlemskap lagres per låt.
Gruppeknappene over mikseren slår gruppene av/på. De kan også legges nederst via KONTROLLER.
Gi gruppene egne navn, som Gitar, Kor eller Perkusjon, i KONTROLLER.
Navnene gjelder alle låter. Bruk forskjellige navn på de seks gruppene.
Gruppene summeres: er minst én av sporets grupper mutet, er sporet mutet.
En aktiv gruppe kan ikke overstyres av SOLO eller av sporets egen MUTE-knapp.
Når gruppen slås av, beholdes eventuelle individuelle mutevalg.
Aktive grupper følger låtskifte i samme økt. De starter avslått ved ny oppstart.
Gruppemedlemskap og navn tas med i prosjektbackup, men aktive mutevalg i økten gjør ikke det.

BØLGEFORM OG HOPP I LÅTEN
Trykk BØLGEFORM nederst for å vise bølgeformen til et valgt lydspor.
Velg hvilket spor som vises i nedtrekkslisten. Valget huskes per låt.
Bølgeformen beregnes fra den ferdig dekodede lydfilen og er før fader/mute.
Den er skalert for visning; grafikken er ikke en nivåmåler og endrer ikke lydnivået.
Grafikken bygger bare på lokale, klargjorte lydfiler. Ingen bølgeform tegnes for manglende lyd.
Dra på tidslinjen eller bølgeformen for å velge posisjon. Alle lydspor, også klikk,
flyttes til samme tidspunkt. Under dragging vises posisjonen uten at lyden spiller.
Når du slipper fortsetter avspillingen hvis låten spilte før du begynte å dra.
Var låten pauset, blir den værende pauset på den nye posisjonen.
STOPP og låtskifte avbryter dragging/hopp uten å starte den gamle låten på nytt.
Hopp-knappene bruker 10 sekunder som standard. Velg 1–120 sekunder i KONTROLLER.
Der kan du også slå av hopping under avspilling; hopping mens pauset er fortsatt mulig.
Når SYNC SCROLL TO SONG DURATION er valgt, følger teksten det nye tidspunktet.
Dette er fri posisjonering. Regioner, løkker og arrangering av vers/refreng er ikke lagt til.

FULLSKJERM
Både øverste og nederste kontrollfelt skjules i fullskjerm.
Trykk på tekstflaten for å vise dem midlertidig. Et første trykk starter ikke lyd.
Kontroller blir tilgjengelige mens du bruker innstillinger eller drar i tidslinjen.
Nederste kontrollfelt dekker ikke den nederste teksten i vanlig visning.

BUSSER OG MINNE
De 16 utgangsbussene og Ui24R-rutingen fra V26.7 er beholdt. Ingen EQ er lagt til.
Arbeidsminnegrensen er fortsatt 256 MiB dekodet lyd per aktiv låt.
MP3 sparer filplass, men reduserer ikke dekodet minne ved samme lengde, rate og kanaltall.
En egen mono-fil bruker halvparten av en tilsvarende stereo-fil. Mute frigjør ikke minnet.
Filgrensen er 160 MiB per lydfil og prosjektfilgrensen er 256 MiB lagrede lydfiler.
32 spor er modellens maksimum og er ikke et kapasitetsløfte for iPad 6.
En innebygd lydmotor med lesing i mindre deler er fortsatt neste retning for større låter.

PROSJEKTFORMAT
Nye eksporterte prosjektfiler bruker format 3 for å ta med mutegrupper.
Bruk V26.8 eller nyere på mottakeren. Eldre utgaver avviser format 3.
V26.9 leser fortsatt de eldre formatene 1 og 2.
Ved låtimport tilpasses busser og mutegrupper etter oppsett/navn. Eksisterende låters
busser og gruppenavn endres ikke hvis de er i bruk. Det brukes ledige plasser.
Hvis det ikke finnes plass, avvises importen uten å endre biblioteket.
Prosjektfilene tar ikke med enhetens knapper, feltvisning eller hoppeinnstillinger.

VERIFISERING
90 automatiske tester består, inkludert import av fem spor, eksport, prosjektimport,
gjenåpning og avspilling med begge transportfeltene. Testene bruker modellert DOM,
Web Audio og IndexedDB. I tillegg består akkord-/innstillingsregresjonen.
Ingen ekte Safari-layout eller fysisk iPad/Ui24R-test er gjort her.
Test nye knapper, dragging og mutegrupper med Ui24R før du bruker dem live.
