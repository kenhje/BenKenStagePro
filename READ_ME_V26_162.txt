BenKen V26.162 — Web song editor — 10 November 2026
Native: V27.31 for automatic cache, V27.32 for logo startup; no new native required.
App: Settings > Songs & setlists > Web song editor. Use the same email as the website editor. Check for changes, select a song and review both versions before sending or receiving. Audio, routing, timing and separate chord charts remain local. Web changes to section names may require checking playback section timing afterwards.
Website: editor.html. Local drafts and ChordPro export work without an account. Online library requires SUPABASE_WEB_EDITOR_SETUP.sql and email sign-in enabled in the existing Supabase project. Never use the anonymous live-following table for private song texts.
The SQL script grants authenticated users access only to their own text library. Review before applying. Saves use atomic revision checks to prevent silently overwriting simultaneous edits. No service key belongs in the browser.
Local recovery copies of the last 30 text replacements are stored under benken-web-text-recovery-v1. Keep regular complete backups as well.
Cloud schema activated and live database checks passed for own-user read/save, revision conflicts, other-user isolation, anonymous denial and direct-write denial (test rows rolled back). Email delivery/sign-in and physical iPad use still require verification.
