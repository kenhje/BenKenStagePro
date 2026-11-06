BenKen Web V26.116 · Native meter display fix
6 November 2026

Keep Native V27.28. No new Xcode build is required.
Upload this complete web package. Existing songs and settings are preserved.

The Native player already sends per-track levels. An old UI guard still forced every meter except Master to zero. This release enables Track, Bus and Song displays when Native V27.28 advertises track metering. Master remains a separate output measurement. Older Native versions still show unavailable meters rather than invented levels.

Tests cover the actual display helper, level zero/mute and old-version compatibility. Native processing has not changed. Physical device verification remains.
