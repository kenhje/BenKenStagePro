BenKen Stage Pro V26.255 — Autosync between iPad, iPhone and Mac

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
