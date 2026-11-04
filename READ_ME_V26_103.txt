BenKen Stage Pro · Web V26.103 · Native V27.23 unchanged
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
