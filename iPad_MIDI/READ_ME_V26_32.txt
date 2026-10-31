BENKEN STAGE PRO V26.32 — COMPACT MIXER SETTINGS

WHAT CHANGED
Mixer Settings > Tracks: each track has a MUTE GROUPS button. Membership
checkboxes are hidden until opened for that track. The button shows the
number of assigned groups. Closing the section keeps its assignments.
The track editor uses two columns, with expanded mute groups below the row.
SAVE MIXER SETTINGS is now in the top heading and stays accessible while
scrolling the settings. In Audio & Files, the same action says SAVE NAMES.

UPDATE THE EXISTING GITHUB SITE
This ZIP is a web update. Upload its contents to the root of the existing
kenhje/BenKenStagePro repository, replacing files with matching names.
Do not upload the ZIP itself or put the files inside an extra subfolder.
Keep existing files, repository settings and GitHub Pages configuration.
The actual interface uses index.html, sw.js, benken-runtime-v26-32.js and
benken-ui-v26-32.css. Keep the manifest, icons and demo folder alongside them.
Wait for GitHub Pages to finish publishing. With internet available, close
and reopen BenKen, then check that the mixer shows V26.32.
No Xcode changes, signing changes or app deletion are required for this update.

EXISTING DATA
The storage keys, audio databases, project formats and memory limit are
unchanged. No data migration or cache reset is part of this update.
Track assignments, routing and automatic saving keep their existing behavior.

DEVICE CHECK
Open Mixer Settings > Tracks. Mute groups should initially be collapsed.
Open a track's MUTE GROUPS button, adjust an assignment, close the section
and reopen it. Check that the assignment is retained, including after
closing and reopening BenKen. Check the top save action while scrolling.
After updating, verify a fresh start and song playback on the Ui24R Wi-Fi
without internet. Ui24R connection-library caching and physical cue recall
still require a device check; this UI update does not change that behavior.

VERIFICATION
254 existing mixer integration, CSS layout and offline-cache checks passed.
Application smoke checks also cover independent group disclosures, retained
assignments, agreement with the Mute Groups tab, saved names, the relocated
save action and reopening the app. CSS constraints were checked at 320, 375,
768, 1024 and 1366 pixels. These are DOM/audio models and CSS constraints;
actual iPad layout and native offline/cue operation still need device testing.
