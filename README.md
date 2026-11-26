# BenKen Stage Pro – web app

The web part of BenKen Stage Pro™ by Kenneth Hjelle. It is published on GitHub Pages at
https://kenhje.github.io/BenKenStagePro/ and built into the native app (iPad, iPhone, Mac), which opens it
from its own address `benken://app/` and downloads verified updates from here.

## What is in this repository

| Path | Purpose |
|---|---|
| `index.html` | The app. Loads the current `benken-*-v26-NNN.js/.css` files. |
| `benken-*-v26-NNN.js`, `benken-ui-v26-NNN.css` | App modules for the current version only. |
| `sw.js` | Offline cache for browsers. Its `ASSETS` list is also the list of files the native app needs. |
| `app-files.json` | Version, size and SHA-256 of every app file. The native app downloads a new version only when all files match. Made by `make_app_files.py`. |
| `manual.html` | User manual, made by `make_manual.py` from `manualGroups` and `manualSections` in `index.html`. |
| `licenses.html` | Third-party code and licenses (also in Help & Info). |
| `qrcode.js`, `QRCode_License.txt` | QR Code Generator (MIT). |
| `soundcraft-ui-connection-7.0.3.mjs` | Ui24R connection library (MIT, includes RxJS and tslib), bundled unmodified. |
| `BenKen_Chord_Chart_Demo.benken`, `demo/` | Demo song and Ui24R bus test. |
| `REAPER/` | REAPER export script. |
| `supabase/sql/` | Database setup and updates, run once each in the Supabase SQL editor. |
| `supabase/functions/` | Supabase Edge Function for web-editor pairing. |
| `docs/` | Notes on colour palettes and loudness measurement. |
| `CHANGELOG.md` | All earlier READ_ME / LES_MEG notes, newest first. |

## Publishing a new web version

1. Copy the current `*-v26-NNN.*` files to the next number and update the references in `index.html`, `sw.js` and `manual.html`.
2. Add the release to `aboutUpdates` in `index.html` and a section to `CHANGELOG.md`.
3. If the manual changed, run `python3 make_manual.py` (builds `manual.html` from `manualGroups` and `manualSections` in `index.html`). Then run `python3 make_app_files.py` to refresh `app-files.json`.
4. Publish `index.html`, `manual.html`, `sw.js`, `app-files.json`, `CHANGELOG.md` and the new version files together.
5. Remove the previous version's `benken-*-v26-NNN.*` files once the new version is live.

The native app (built from Xcode) picks up the new version in the background and uses it from its next start.
App Store builds use only the web files built into the app; run `sync_web_into_app.sh` in the native project before archiving.

Older versions and notes are in the git history.
