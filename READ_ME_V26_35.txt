BENKEN STAGE PRO V26.35 — REAPER OG NETTVERKTEST

NETTVERSJONEN
Pakk ut ZIP-filen. Last opp filene rett i rotmappen til eksisterende
kenhje/BenKenStagePro på GitHub, og erstatt samme filnavn. Ikke slett andre
filer eller last opp selve ZIP-filen. Åpne BenKen med internett etter
publisering. Mixeren skal vise V26.35.

REAPER-OPPDATERING
REAPER/READ_ME_REAPER.txt forklarer installasjonen av Export_to_BenKen.lua.
Bruk ett prosjekt per låt. Velg normalt inntil seks spor/mappebusser og
kjør scriptet. Én .benken-fil inneholder lyd, spornavn, farger og regioner.
BenKen > Mixer > Settings > Audio & Files > IMPORT / UPDATE FROM REAPER.
Første gang kobler du til eksisterende spor eller oppretter en ny låt.
Ved neste eksport kjenner BenKen igjen sporene. Du kan eksportere bare
endret gitar; andre lydspor, sangtekst, ruting, fader og mute groups beholdes.
Nye spor bruker reglene for standardbusser i Audio & Files.
Vanlig Save i REAPER eller endringer i en skymappe oppdaterer ikke BenKen
automatisk i denne versjonen. Det er en eksport-/importflyt med en knapp.

IPAD OG LOKALT NETTVERK
iPad_update/READ_ME_IPAD.txt forklarer hvordan hele Swift-koden erstattes
i din eksisterende BenKenMIDIApp 2.swift i Xcode. Lagre og kjør Run på iPad.
Ikke legg til duplisert Swift-fil eller slett appen. GitHub-oppdateringen
alene legger ikke til den nye native TEST LOCAL NETWORK-knappen.
Knappen leser mikserens private IP direkte, uten CDN-bibliotek, og viser
konkret HTTP-svar eller iPad-feil. Den sender ingen cue-/showkommandoer.
Nettverksfeilens årsak er ennå ikke påvist på fysisk enhet.

BEHOLDT
Standardbusser etter filnavn, tryggere REPLACE FILE, filstatus per spor,
skjulte mute group-valg, Save øverst og skjulte controls ved skjermtastatur.
Samme lokale databaser og 256 MiB minnegrense. Safari og native app har
separate lokale lydfiler/data. Ikke slett appen eller nullstill lagring.

FØRSTE TEST
Test en låt. REAPERs tempoendringer blir en del av renderte lydfiler, men
BenKens genererte metronom følger ennå ikke hele tempokartet. Eksporter
Click for låter med tempoendringer. Kontroller eksportens sluttid; et
click-klipp som fortsetter etter Outro kan ellers bruke mye unødvendig minne.

Automatiske kontroller dekker import, delvis oppdatering, tilbakeføring ved
feil, lagring, backup, mikser, offline skall og JavaScript-broen. Lua er kjørt
mot en REAPER-modell med metadata fra innsendt prosjekt. Ingen ekte lyd er
rendret i disse kontrollene. Swift/Xcode, Ui24R-forbindelse, REAPER-rendering
og iCloud/Drive-filvalg må testes på dine enheter. Ikke publisert av oss.

VERIFICATION
299 automated JavaScript/model checks passed. Lua 5.4 exporter contract
checks also passed. Native Swift and real REAPER rendering are untested.
