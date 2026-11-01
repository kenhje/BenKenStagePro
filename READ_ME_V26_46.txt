BENKEN STAGE PRO V26.46 — REAPER IMPORT / SONG SWITCHING

Dette er en oppdatering av webfilene i V26.45.

ENDRINGER
- Gammel avspillingslyd slippes før nye REAPER-stems kopieres inn.
- REAPER-import kontrollerer fortsatt lyden før låten lagres. Ferdig
  klargjort lyd gjenbrukes etter lagring hvis spor, tempo og toneendring
  fortsatt er identiske. Dermed unngås en ekstra full lydklargjøring.
- Ved avbrutt innlasting venter neste låt på at WebKits pågående
  lyddekoding faktisk avsluttes. En avbrutt JavaScript-operasjon kan ikke
  i seg selv stoppe denne dekodingen. Mellomliggende låtvalg droppes.
- Ny versjon på webfiler og offline-cache hindrer blanding med V26.45.

Dette er tiltak mot bekreftet unødvendig arbeid og overlappende dekoding.
Årsaken til det rapporterte iPad-stoppet er ikke bevist. Denne pakken er
ikke en overgang til AVAudioEngine og garanterer ikke avbruddsfri lyd.

INSTALLASJON
1. Ta sikkerhetskopi av bibliotek og lokale lydfiler med dagens app først.
2. Pakk ut ZIP-filen og last opp innholdet til roten av ditt eksisterende
   kenhje/BenKenStagePro-repository. Erstatt index.html, sw.js og andre
   filer med samme navn. Behold demo-mappen. Ikke last opp selve ZIP-filen.
3. Vent til GitHub-siden er publisert. Åpne appen med internett, og lukk
   og åpne appen på nytt om nødvendig. Kontroller at den viser V26.46.
4. La oppdateringen for frakoblet bruk fullføres før du bytter til
   mikserens nettverk.

Ingen Xcode-, Swift- eller REAPER-scriptendring kreves for denne pakken.
Ikke slett appen eller tøm nettsteddata. Lagringsnøkler og databaseskjema
er beholdt. Gamle versjonerte webfiler kan ligge igjen på GitHub.

BEHOLDT FRA V26.45
Stabilitetsmodus er fortsatt aktiv: regionlooping, spor-EQ og master-
kompressor er midlertidig forbikoblet. Lagrede FX-verdier beholdes.
Vanlig avspilling, lokale lydfiler, ruting, nivåer, mutegrupper, MIDI,
REAPER-import, tempo/toneendring og Host/Follow videreføres.

TEST PÅ IPAD
1. Spill en låt og stopp den. Importer en ny REAPER-versjon av samme låt,
   og velg å oppdatere eksisterende låt.
2. Kontroller at nye lydfiler og regioner er riktige, og at tekst, nivåer
   og ruting er som forventet.
3. Spill låten og bytt flere ganger mellom ulike låter. Prøv også å velge
   neste låt før klargjøringen av den forrige er ferdig. Bare siste valg
   skal bli klart for avspilling.
4. Gjenta erstatningsimporten noen ganger. Test deretter en hel settliste
   med det faktiske lydkortet og MIDI-utstyret, også uten internett.
5. Hvis feilen kommer igjen, noter låt, antall stems, omtrent når stoppet
   kom, og om det skjedde ved import, klargjøring eller avspilling.

VERIFIKASJON
11 automatiserte kontroller bestått: dekodingsrekkefølge ved raske bytter,
feil fra pågående dekoder, gjenbruk av lyd etter transportreset, endrede
spor/tempo, manglende lyd, uferdig klargjøring, REAPER-importrekkefølge,
tilbakerulling ved lagringsfeil/lydfeil og pakkens JavaScript/offline-filer.
Kontrollene bruker modeller av lyddekoder, lagring og importens UI-grenser.
Dette er ikke en fysisk minnemåling, full nettlesertest eller iPad/Ui24R-test.
Pakken er ikke publisert til GitHub av Codex.
