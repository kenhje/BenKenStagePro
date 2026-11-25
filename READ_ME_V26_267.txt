BenKen Stage Pro V26.267

- Local web files in the app (needs native V27.58): app-files.json lists every file the app needs with size and SHA-256 (made by make_app_files.py from the sw.js asset list). The app downloads newer versions in the background, verifies them and uses them from the next start.
- Share links point to the GitHub address when BenKen runs from benken://app.
- Inside the app, audio restored from the permanent copy is not copied again into web storage.
- Storage page: BenKen web files version, Check for update now, Remove old copy at the GitHub address.
- Manual: Offline use & updates rewritten.

Publish routine from now on: run make_app_files.py and upload app-files.json together with the other files.
