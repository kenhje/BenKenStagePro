BenKen Stage Pro Web V26.97 · Native V27.22

Mixer → TRACKS → SONG → LUFS
1. Velg Target LUFS (−60 til −5, standard −14).
2. ANALYZE & APPLY måler gjeldende låt og lagrer Song Master.
3. ANALYZE SETLIST behandler den valgte setlisten én låt om gangen.
4. RESET SONG henter tilbake mastervolumet fra før første normalisering.

Faktisk oppnådd LUFS vises. Høye lydtopper og eksisterende maksimal Song Master-forsterkning på +6 dB kan gjøre målet uoppnåelig. Ingen komprimering eller endring av originalfiler.
Målingen er en stereo-referanse ved originaltempo før EQ, masterkompressor og global Master. Lagrede spor- og bussnivåer inngår. Midlertidige mute/solo ignoreres. Velg spor under Tracks & measurement; klikk/cue utelates fra LUFS som standard. Alle filspor undersøkes for sample-topper, både i full stereomiks og lagret USB-ruting. Generert metronom inngår ikke. Dette er ikke en sanntids limiter eller true-peak-måler.

Hold BenKen åpen og stans avspilling under analysen. Analyse og dekoding kjøres før konserten. Temporary miksbiter lagres lokalt og slettes etterpå. En fil dekodes om gangen. Analysegrenser: 64 MiB per fil, 192 MiB dekodet lyd, maks stereo. Låter over ca. 8 minutter kan overstige analysegrensen.
Manglende filer rapporteres med låt og spornavn. Cancel stopper videre analyse; ferdige låter beholder lagrede nivåer. Avspilling og automatisk synk venter mens analysen kjører.

Last opp alle webfilene til appens GitHub-repo som før. Ingen ny Xcode-bygging nødvendig. Behold eksisterende app og låtbibliotek.
About og manualen er oppdatert. Automatisk og nettlesertesting er utført. Ditt fulle bibliotek og fysisk iPad/iPhone må fortsatt testes før livebruk.
