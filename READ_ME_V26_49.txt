BENKEN STAGE PRO V26.49 — SETTINGS / LOCAL AUTO BACKUP

INNSTILLINGER
- Live sync er fjernet fra Tools-menyen.
- Lyrics starter med EDIT SONG, EDIT LYRICS og SYNC LYRICS, over akkordvalg.
- Sets, New Set og Add Songs ligger øverst i Setlist.
- Network heter SHARE LYRICS. Inne i panelet brukes fortsatt Host / Follow.
- Playback mode ligger først under Playback.
- Backup er delt i full backup med lyd, automatisk lokal backup og en
  sammenleggbar gruppe for prosjekter og tekstimport/-eksport.
- Lyrics-valget TAP SECTION TO PLAY er kontrollert og tilkoblet korrekt.
- Utseendet, region count-in og importrettingene fra tidligere versjoner
  er videreført.

AUTOMATISK LOKAL BACKUP
Ukentlig lokal backup er standard, slik brukeren valgte. Kan slås av med
Schedule > OFF. Første kopi tas når det finnes låter og appen er åpen og
i ro. Deretter kontrolleres om det har gått en uke. Hvis appen har vært
lukket eller opptatt, tas neste kopi når appen igjen er åpen og i ro.
Det er ikke en garantert bakgrunnsjobb når iPad-appen er lukket.

Tre gjenopprettingskopier beholdes med bibliotek, setlister og innstillinger.
Originale lydfiler beholdes lokalt så lenge en av kopiene trenger dem.
REAPER-erstatningsimport og filopprydding får derfor ikke slette lyd som
brukes av en bevart kopi. Når eldste kopi utgår, kan dens lydfiler ryddes
bort dersom de heller ikke brukes av biblioteket eller andre kopier.
Det lages ingen nye dekodede lydkopier under denne sikkerhetskopieringen.

BACK UP NOW lager en kopi med en gang mens avspillingen er stoppet.
Velg en kopi og RESTORE SELECTED COPY for å gjenopprette bibliotek og
setlister. Lydfilene kontrolleres først. Appen ber om bekreftelse og tilbyr
tekstbackup av nåværende bibliotek før gjenoppretting. Enhetens gjeldende
utgang/MIDI/Controls og innstilling for autobackup beholdes.

Kopiene og lyden ligger på samme enhet. De er ikke eksportert til Mac,
iCloud eller Files og følger ikke med hvis appdata slettes. Bruk CREATE
FULL BACKUP øverst for uavhengige filer som kan overføres til Mac/iCloud.
Vanlig automatisk lagring og recovery-drafts finnes fortsatt separat.

INSTALLASJON
Ta full sikkerhetskopi først. Pakk ut ZIP-filen og last opp innholdet til
roten av eksisterende kenhje/BenKenStagePro på GitHub. Erstatt filer med
samme navn, og ta med demo-mappen. Ikke last opp selve ZIP-filen.
Vent på publisering, åpne appen med internett og kontroller V26.49.
La offline-oppdateringen fullføres før du bytter til miksernettverket.
Ingen Xcode- eller REAPER-scriptendring kreves. Ikke slett appen eller
tøm nettsteddata. Eksisterende lyd-database og dens skjema beholdes.
Gjenopprettingspunktene bruker en egen lokal database.

KONTROLL
37 automatiserte kontroller bestått: 19 for tidligere lyd/import/count-in
og 18 for lokale kopier, ukeintervall, lydfilbeskyttelse, tre kopier,
opprydding, feil, samtidige forespørsler og gjenoppretting.
I nettleser ble en kopi med to lydfiler lagret. Testlåtens navn ble endret
og gjenopprettet fra kopien. Kopien var fortsatt tilgjengelig etter ny
åpning. Lyrics-redigering og regiontrykkvalget ble prøvd. Rekkefølgen i
Playback og Setlist, nytt navn og fravær av Live sync ble kontrollert.
Backup ble visuelt kontrollert i 768x1024 og nederste gjenopprettingsknapp
ble kontrollert over Controls ved 1024x768. Ingen fysisk iPad/Ui24R-test
eller lang konsertprøve er utført her. Stabilitetsmodus er fortsatt aktiv:
regionlooping, spor-EQ og masterkompressor er midlertidig forbikoblet.
Pakken er ikke publisert til GitHub av Codex.
