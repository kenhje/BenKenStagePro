BenKen Web V26.115 · Section playback, waveform and Native meters
6 November 2026

Use Native V27.28 for waveform and per-track meters. Build the new Xcode project over the existing app with the same identity; do not delete the app or library. Upload the complete web package.

Practice + Tap section to play: tap headings in lyrics, the current/next/later sections in the top bar, or the waveform regions. Show sections controls visibility only. Sections need REAPER timing or SYNC LYRICS. Turning Practice off disables section tapping. Explicitly enabling Tap section to play enables Practice. Seeking protection, double-tap protection and concert lock remain.

Native waveform: generated from the prepared local audio, one small read buffer at a time; cached compact peaks are returned to the web view. Work waits while playing and is cancelled at Play or song change. No full-song PCM copy is sent to WebKit. Native V27.27 shows an upgrade instruction.

Native track meters: sampled signal after each track EQ, scaled by mix gain (including mute/solo/groups/bus/song/master). The master meter measures the actual combined output. Bus and Song displays summarize the highest track contribution, not a separate summed mix tap. Measurement is leased only while the mixer is visible; old values expire. It does not verify external mixer/speaker sound.

Browser interactions, Native tests and Mac/iOS builds checked. Physical iPad, iPhone, Mac and USB device tests remain.
