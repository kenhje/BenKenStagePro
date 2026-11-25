BenKen Stage Pro V26.265

- Library safety copy in the app (needs native V27.56): after every save (2 s debounce) and on background, the web library (benken-ipad-v4) plus all other benken* storage keys are sent to the app (librarySave).
- On a start with empty web storage, the app copy is loaded (libraryLoad), written back and the page reloads once. Shows "Library restored from the app copy (N songs)."
- Never mirrors before the restore check on a fresh start; the app refuses to replace a copy with songs by an empty library.
- Step 1 of moving the web files into the app package.
