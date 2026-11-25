BenKen Stage Pro V26.273

- Delete account (App Store requirement): Settings → Songs & setlists → Profile & document details → BenKen account, and under Autosync & web editor. Confirm by typing DELETE.
- The app first removes the user's files in Storage (rehearsal mixes they uploaded, their shared packages), then calls benken_delete_my_account(), signs out and keeps local songs and audio.
- Database: run SUPABASE_DELETE_ACCOUNT_V26_273.sql once.
