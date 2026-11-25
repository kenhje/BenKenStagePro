BenKen Stage Pro V26.271

- benken://app is not a secure context, so crypto.subtle (SHA-256), crypto.randomUUID and navigator.clipboard were missing and .benken / audio import failed in the app. Inline fallbacks (pure-JS SHA-256, UUID from getRandomValues, execCommand copy) are installed only when the functions are missing.
