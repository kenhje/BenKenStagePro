REAPER → BENKEN — FØRSTE TESTVERSJON

INSTALLASJON PÅ MAC
1. Lagre Export_to_BenKen.lua et fast sted på Mac-en.
2. I REAPER: Actions > Show action list > ReaScript: Load.
3. Velg Lua-filen. Scriptet kan kjøres med Run og gis egen knapp/snarvei.
Ingen SWS-utvidelse trengs.

MALEN DIN
Bruk ett prosjekt per låt. Lag seks tydelig navngitte spor/mappebusser i
ønsket farge. Drums, Guitar, Bass, Keys, BGV, Click og Cue støttes av
BenKens standardregler. Du velger selv hvilke seks kategorier du vil ha.
Click og Cue trenger egne spor hvis de skal styres uavhengig.
Regionnavn: Intro, Verse, Chorus, Bridge, Solo, Melody, Outro.
Verse 1, Verse 2 osv. er også mulig. Flytt grensene til riktige tider for
hver låt. Dette eksportformatet støtter ikke overlappende regioner.

Lagre helst malen før første eksport. Opprett ny låt med eget filnavn.
Scriptet lager en egen låtkobling ved første eksport. Ved Save As etter en
eksport spør det om dette er en NY låt eller samme låt med nytt navn/sted:
YES = ny låt, NO = behold koblingen. Lagre prosjektet etter første eksport.

EKSPORT
1. Stopp avspilling. Prosjektet må være lagret og playrate stå på 1.0.
   Vanlige tempoendringer i prosjektet støttes av renderingen.
2. Velg spor/mappebusser som skal bli lydfiler i BenKen. Velg en mappebuss
   ELLER dens underspor, slik at samme lyd ikke eksporteres to ganger.
3. Kjør scriptet. Første gang velger du målmappe. Det kan være en lokal
   synkmappe i iCloud Drive eller Google Drive.
4. Velg MP3/WAV, 1 mono / 2 stereo og sluttid i sekunder. Standard er MP3,
   mono og siste regions slutt. 0 = hele prosjektet. Kontroller sluttiden
   og ta med eventuell etterklang etter Outro. Alle filer starter ved tid 0
   og har samme eksportlengde. Det gamle tidsutvalget brukes ikke.
5. Pakken heter som prosjektet med .benken til slutt. Forrige pakke erstattes
   først når den nye er skrevet. Lagre REAPER-prosjektet så koblingen huskes.
6. Vent til eventuell skysynk er ferdig før du velger pakken på iPad.

IMPORT I BENKEN
Mixer > Settings > Audio & Files > IMPORT / UPDATE FROM REAPER.
Velg pakken. ADD AS NEW SONG oppretter ny låt. For en eksisterende låt:
velg låten, koble eksportsporene til riktige eksisterende spor, UPDATE SONG.
Unike navnetreff foreslås. Add as a new track brukes kun for et ekstra spor.

Use REAPER regions tar med nøyaktige start-/sluttider til bølgeformen. Hvis
teksten har samme antall deler i samme rekkefølge/type, oppdateres også
delenes synkpunkter. Importen beholder sangtekst og notater. Den lager ikke
linje-for-linje-tekst eller akkorder fra lyd.

SENERE ENDRINGER
Endre f.eks. gitarlyden, velg bare Guitar-bussen og eksporter igjen. Importer
den nye pakken og se over UPDATE SONG-koblingen. Andre lydspor beholdes.
REAPER-sporets faste ID brukes etter første kobling. Ikke slett og opprett
sporet på nytt ved vanlig endring av lydopptak; det gir en ny spor-ID.
BenKen beholder buss, fader, pan, mute groups, format, farge og lokale alias.
REAPER-navn som ikke er endret lokalt følger senere navneendringer i REAPER.
Nye spor tar med REAPER-fargen og bruker BenKens standardbussregler.
Ved endret låtlengde må alle lydspor som berøres eksporteres på nytt.

LYD OG BEGRENSNINGER
Valgte spor/mappebusser rendres med egen lydbehandling og nivå, uten
mastereffekter. Retur-/send-effekter på andre spor må tas med bevisst.
Solo fjernes midlertidig og valgt eksportspor åpnes fra mute. Barnas mute
inne i en mappe beholdes. Renderinnstillinger, sporvalg, mute og solo
gjenopprettes etterpå, også ved feil. Kontroller en virkelig eksport først.

Variable tempo blir en del av lydfilene. BenKens genererte metronom følger
ennå ikke hele tempokartet: eksporter Click for slike låter. MP3 sparer
filplass, men ikke dekodet minne sammenlignet med WAV. Forventet minne sjekkes
ved 48 kHz; andre samplingsfrekvenser kan kreve mer minne på enheten.

En .rpp alene inneholder ikke ferdigrendret lyd. Dette er enveis eksport.
Vanlig Save oppdaterer ikke BenKen automatisk. Ingen mappeovervåking eller
bakgrunnssynk er inkludert. BenKen lagrer ferdige lydkopier lokalt.

Lua 5.4, pakkestruktur, faste ID-er, delvis oppdatering, tilbakeføring ved
feil og ny låt fra mal er modelltestet med metadata fra innsendt prosjekt.
Ekte lydrendering og plug-ins må testes i din REAPER-installasjon.
