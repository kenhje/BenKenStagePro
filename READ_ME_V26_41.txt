BENKEN STAGE PRO V26.41 — REAPER, REGIONFARGER OG SEKSJONSSTART

OPPDATERING
Pakk ut ZIP-filen. Last opp innholdet til rotmappen i ditt eksisterende
kenhje/BenKenStagePro-repository på GitHub, og erstatt filer med samme navn.
Ta også med demo/. Ikke last opp ZIP-filen eller slett gamle prosjektfiler.
Åpne BenKen med internett etter at GitHub-publiseringen er ferdig. Mixeren
skal vise V26.41. Lukk og åpne appen igjen hvis forrige versjon fortsatt vises.
Ingen Xcode-, Swift- eller REAPER Lua-oppdatering trengs denne gangen.
Ikke slett appen eller nullstill lagringen.

VELG SPOR
1. Åpne MIXER > MIXER SETTINGS > AUDIO & FILES.
2. Trykk IMPORT / UPDATE FROM REAPER og velg den eksporterte .benken-filen.
3. Alle spor er avhuket som standard, hver gang du åpner en eksport.
4. Fjern avhukingen ved spor du ikke vil importere. All stems velger alle
   eller ingen. Telleren viser hvor mange som er valgt.
5. Velg eksisterende sang og UPDATE SONG, eller ADD AS NEW SONG.

Bare valgte spor kopieres til lokal lydlagring og legges til eller erstattes.
Ved UPDATE SONG beholdes lydfiler, navn, farge, ruting, nivå og mute groups
for spor som ikke er valgt. Koblingen til deres REAPER-spor beholdes også,
slik at de kan oppdateres automatisk ved en senere import.
Ved ADD AS NEW SONG får den nye sangen bare de valgte sporene.
Avhukingen beholdes hvis du bytter målsang i samme importvindu.
Neste gang du åpner importvinduet, er alle spor valgt igjen.

REGIONER OG TEKST
Use REAPER regions og Sync lyric section headings fungerer uavhengig av
sporvalget. Velg ingen spor hvis du bare vil oppdatere regioner og tekst.
En eksisterende sang beholder da alle sine lokale lydfiler.
Regionvalg, tekstinnhold og seksjonskoblinger følger samme regler som før.

REGIONFARGER
SETTINGS > PERSONALIZATION har valget
OVERRIDE REAPER REGION COLORS WITH PERSONALIZATION.
Det er slått på som standard: Chorus, Verse, Intro osv. bruker de samme
seksjonsfargene i waveform og teksten. Endre fargene i Personalization.
Valget og dine egne farger beholdes når du oppdaterer en låt fra REAPER.

Slå av overstyringen for å bruke de eksporterte REAPER-regionfargene.
Da følger både waveform og tilkoblede tekstoverskrifter fargene fra REAPER,
og en senere REAPER-oppdatering henter nye farger fra prosjektet.
Originale regionfarger beholdes i låtdataene også mens overstyringen er på.
Dette velger visningsfarger i BenKen; det endrer ikke REAPER-prosjektet.

SPILL FRA EN SEKSJON
Slå på TAP SECTION TO PLAY i SETTINGS > LYRICS eller under CONTROLS.
Da kan du trykke på en tidskoblet tekstoverskrift eller på seksjonsnavnet
øverst i waveform for å starte avspilling fra seksjonens begynnelse.
Under avspilling hopper lyden til den valgte seksjonen og fortsetter.
Vanlig draing i bølgeformen fungerer fortsatt under navnefeltet.

Lyden må være klargjort, og seksjonen må ha en starttid fra REAPER-regioner
eller SYNC LYRICS. Lagret tempo tas med i starttidene. Seksjonshopp starter
musikken direkte fra delen, uten en ny count-in. Alle spor følger hoppet.
Valget er av som standard og lagres på enheten. Sperren for seeking under
avspilling gjelder også her. Double-tap Play krever to trykk på samme del
for å starte fra stopp. En scroll-bevegelse eller markert tekst starter ikke lyd.

BEHOLDT
REAPER Export V5, kompakte Tracks/Buses, filrader med like knapper,
Autoplay-bryter, redigering av valgt sang, multitrack, mono-standard,
USB-ruting, MIDI, backup, offline og Host/Follow.
Samme lagring, lydbehandling og native LAN-protokoll 26.37 / følgerside 26.37.1.

KONTROLL
Automatiske JavaScript-/modellsjekker dekker import med alle, noen eller
ingen spor, senere full oppdatering, avbrudd og feil under kopiering eller
klargjøring. Eksportfilene kommer fra den eksisterende REAPER-eksportøren.
Nye sjekker dekker fargevalg og REAPER-oppdatering, seksjonsstart fra tekst
og waveform, tempo, omstart, double-tap, seek-sperre, scroll og Stop.
Fysisk iPad-/nettleservisning må bekreftes på enheten.

VERIFICATION
340 JavaScript/model checks passed, including nine REAPER track-selection and eleven section-play/color checks.
Responsive CSS constraints passed targeted selection-layout smoke checks. Native source,
audio processing and storage schema unchanged. Physical iPad/browser rendering
was not tested here. This archive has not been deployed to GitHub.
