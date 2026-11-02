BenKen Web V26.61 / Native Test V27.7

Nytt i webdelen
- PREPARING vises mens lyd klargjøres.
- READY vises i to sekunder og forsvinner deretter. Feil som NOT READY skjules ikke av dette.
- NEXT vises som standard også i fullskjerm.
- Settings → Controls har egne valg for SHOW NEXT SONG IN FULLSCREEN og
  KEEP CONTROLS VISIBLE IN FULLSCREEN, samt en knapp for å åpne/forlate fullskjerm.
- De samme valgene finnes i Customize controls, der de lagres med SAVE CONTROLS.
- Fullskjerm kan kombineres med Buttons only. Kontroller forblir synlige og brukbare
  når toppmenyen skjules; teksten får plass over kontrollfeltet.
- Valgene lagres på denne enheten og beholdes etter ny åpning.

Mac-lyd: Native V27.7
Den nye native-testen bruker hovedmikseren til AVAudioEngine i Practice / Stereo på Mac.
Den lar stereoutgangen følge maskinens lydformat, i stedet for å koble 48 kHz-miksen
rett til hardwareutgangen. Dette er en mulig retting for at tidslinjen gikk uten lyd
på Mac. Det er ikke bekreftet med lyd på din fysiske Mac ennå.
Kodegrunnlag: https://developer.apple.com/documentation/avfaudio/avaudioengine/mainmixernode
48 kHz til 44,1 kHz stereokonvertering er kontrollert med ekte lydrendring uten høyttalere.
Direkte multikanals USB bruker fortsatt egen diskret ruting.
Native-protokollen er kompatibel med V27.6; for Mac-rettingen må V27.7 bygges.

Installer
1. Web: pakk ut ZIP-filen og last opp innholdet til GitHub. Vent på vellykket Pages-publisering.
2. Xcode: åpne prosjektet i BenKen_Native_V27_7_Mac_Audio/App/BenKenStagePro.xcodeproj.
   Kjør My Mac (Mac Catalyst) for Mac, eller velg iPad-en.
3. På Mac: Settings → Playback → Practice / Stereo og Engine → Native · main interface test.
   Prøv samme testlåt igjen. Kontroller både lyd, Pause og Stop.
4. Fullskjerm: Settings → Controls, velg ønsket Next/Controls-visning og OPEN FULLSCREEN.

Motorstatus
Hovedgrensesnittets native-motor er fortsatt en testutgave. Synk oppdaterer den separate
native-konsertkopien; hovedbiblioteket og konsertkopien er ennå ikke samlet.
Bølgeform, peak-målere, selvstendig metronom, FX og looper er ikke ferdig i hovedmotoren.
Test av ekte Ui24R-/MIDI-ruting, lang avspilling og fysisk Mac/iPad-lyd gjenstår.
Kontrollene bygger videre på V26.59; lydfiler, tempo og toneart er lokale native-kopier.
Ingen publisering eller installasjon er utført i denne leveransen.

Kontrollert
Mac Catalyst og iPad Simulator bygger; 28 native-tester består.
23 automatiske web-/overføringskontroller består, i tillegg til målrettet Ready-timingkontroll.
Fullskjerm med Controls og Next er kontrollert i lokal UI-forhåndsvisning med testbibliotek
og simulerte native-svar. Buttons only, synlighet etter ny åpning, og av/på for Next er kontrollert.
Se Verification i Native-pakken for bygglogger og nærmere teststatus.
