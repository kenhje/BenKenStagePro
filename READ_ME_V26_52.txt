BENKEN STAGE PRO V26.52 — CONCERT / PRACTICE / BACKUP DEVICE

ÅPNE VERKTØYENE
Trykk CONCERT / PRACTICE i kontrollfeltet, eller Settings > Concert.
De fire hovedknappene øverst er beholdt. Studio Black og øvrige skins,
region-count-in og tidligere import-/backuprettinger er videreført.

1. CONCERT CHECK
Velg setlisten du skal bruke og trykk CHECK CONCERT.
Uten valgt setliste sjekkes hele biblioteket.
- Kontrollerer at alle refererte originalfiler finnes lokalt, uten å
  laste inn/dekode alle låtene samtidig.
- Sammenligner nødvendige USB-kanaler med kanalene lydsystemet eksponerer.
  Practice / Stereo vises som et punkt å kontrollere, ikke som bekreftet
  separat USB-ruting.
- Kontrollerer tilstedeværelse av MIDI-innganger hvis mappings er satt opp.
- Viser alder på lokal backup og kontrollerer hurtiglager for appfilene.
- Viser eksplisitt at fysisk patching, lydnivå, click/cue-isolasjon og
  pedalrespons må prøves med utstyret. En grønn filkontroll bekrefter ikke
  riktig fysisk mikserinngang eller avbruddsfri konsertdrift.
Kjør kontrollen på nytt etter endringer og på reserveenheten.

2. LIVE LOCK
ENABLE LIVE LOCK beskytter import, sletting, tekst-/sporredigering og
endring av lydutganger. Playback, låtvalg, nivåer, panorering og mute-
kontroller er tilgjengelige. Åpne redigeringsvinduer og aktive importer/
øving må avsluttes før låsen aktiveres.
Låsen vises tydelig i kontrollfeltet og huskes etter ny åpning.
LIVE LOCK · UNLOCK eller UNLOCK EDITING åpner for redigering igjen etter
bekreftelse. Opplåsing stopper ikke avspillingen.

4. STATUS OG OVERGANGER
Kontrollfeltet viser klargjøring, klar, opptelling, avspilling eller pause,
samt neste låt og AUTO/MANUAL. Ved autoplay vises klargjøring og nedtelling.
Concert Check-panelet har en valgfri ekstra autoplay-pause på 0/3/5/10 s.
Pausen starter etter at neste låt er klargjort. Deretter gjelder eventuell
vanlig count-in før låten. Den samlede overgangen kan altså ta lengre tid
enn den valgte pausen. Manuell stopp eller nytt låtvalg avbryter ventingen.
Dette er ikke sømløs/gapless avspilling.

6. PRACTICE
Velg en tidsfestet region fra REAPER eller SYNC LYRICS. Klargjør lyden først.
Velg én, to, tre eller fem gjennomspillinger og pause på 0/2/5/10 s.
PLAY SELECTED REGION bruker den lagrede region-count-in fra Tempo.
Hver gjennomspilling stopper ved slutten av regionen. Den neste starter
etter valgt pause og en ny opptelling. Første start følger eventuell
Double-tap Play-beskyttelse; de bestilte repetisjonene krever ikke nye trykk.
STOP PRACTICE avbryter øvelsen. Vanlig manuell transport eller låtbytte
avslutter også repetisjonsplanen. Avsluttet øving starter ikke autoplay.
Under TEMPO / KEY / COUNT-IN finnes de samme tempo-, tonearts- og klikk-
kontrollene som i mikseren. Det er ett felles sett kontroller og verdier.
Øvingsvisningen har kontrollerte pauser mellom runder, ikke sømløs looping.

5. BACKUP DEVICE — KONsertpakke MED LYD
1. Velg ønsket setliste før du åpner verktøyet.
2. Velg BACKUP DEVICE > EXPORT CONCERT WITH AUDIO.
3. Trykk PREPARE PART og DOWNLOAD PART. Lagre alle nummererte deler sammen.
   Store konserter får flere deler. Filnavnet begynner med BenKen_Concert.
4. På Mac: åpne samme publiserte BenKen-versjon i nettleseren/appen. Bruk
   Backup > Restore full backup og velg alle delene fra denne eksporten.
5. Kontroller mottakerens utgangsmodus, MIDI og klikkutgang, kjør Concert
   Check og prøv hele oppsettet med det faktiske reserveutstyret.
Pakken tar med valgt setliste, alle dens låter, tekster, original lyd,
sporruting, nivåer og innstillinger. Gjentatte oppføringer av samme låt og
AUTO-valgene per oppføring bevares. Ubrukte låter utelates. Uten valgt
setliste eksporteres hele biblioteket.
Standard gjenoppretting beholder mottakerens enhetsvalg som utgang/MIDI/
Controls. Bruk eksisterende valg for gjenoppretting av enhetsinnstillinger
hvis du bevisst vil erstatte dem. Kontroller alltid rutingen på mottakeren.
Pakken inneholder konsertdata, ikke et nytt native Mac-program. Det er ingen
automatisk overtakelse eller automatisk synkronisering mellom enhetene.

INSTALLASJON AV V26.52
Ta full sikkerhetskopi av dagens oppsett først. Pakk ut og last opp hele
innholdet til roten av eksisterende kenhje/BenKenStagePro på GitHub, som
før. Ta med demo-mappen, ikke selve ZIP-filen. Vent på publisering og
kontroller V26.52 ved åpning med internett. La offline-oppdateringen fullføres.
Ingen Xcode- eller REAPER-scriptendring kreves. Ikke slett appdata.
Eksisterende Web Audio-motor brukes fortsatt. Stabilitetsmodus er beholdt:
sømløs regionlooping, spor-EQ og masterkompressor er fortsatt forbikoblet.
Denne øvingsfunksjonen bruker planlagt stopp/start i den eksisterende motoren.

VERIFIKASJON OG VIDERE PRØVE
57 automatiserte kontroller bestått: 19 for tidligere lyd/import/count-in,
18 for lokal backup og 20 for konsertsjekk, pakkeutvalg, setlistrekkefølge,
MIDI-/USB-krav, autoplay-forsinkelse og avbrudd, planlagt regionstopp,
normal avspilling uten regionstopp, låst import/gjenoppretting, første
Play-bekreftelse og komplett/ufullstendig flerparts-gjenoppretting.
I nettleser fullførte en stille testlåt tre runder med to takters count-in
og to sekunders pause. Sletting og mikserredigering ble blokkert under
LIVE LOCK, mens Play og Stop fungerte. En faktisk konsertfil med to lydfiler
ble lastet ned og kontrollert. Tempo ble flyttet inn i øvingspanelet og
returnerte riktig til mikseren etter lukking. Layout er kontrollert i
1024x768 og 768x1024. Appskallet/offline-beredskap ble ikke bekreftet av den
lokale testnettleseren, og ble vist som et kontrollpunkt i sjekken.
Ingen fysisk iPad/Ui24R-/MIDI-prøve, full reserve-Mac-oppsetting eller lang
konsertprøve er utført her. Test dette før livebruk. Ingen ny garanti om
stabilitet eller årsak til det tidligere iPad-stoppet er dokumentert.
Pakken er ikke publisert til GitHub av Codex.
