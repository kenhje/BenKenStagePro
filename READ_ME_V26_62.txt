BenKen Web V26.62 – ryddigere Controls

Settings → Controls viser nå to oversiktlige felt: Fullscreen og Control bar.
Customize controls har seks vanlige valg øverst. Playback/lyrics, knapperekkefølge
og mute group-navn ligger i tre sammenfoldede seksjoner. SAVE CONTROLS er synlig.
Eksisterende valg og lagring er beholdt.

PREPARING vises mens lyd klargjøres. READY forsvinner etter to sekunder.
NEXT kan vises i fullskjerm. Controls kan beholdes synlig og vise bare knapper.

Med Native V27.8 eller nyere finnes Playback → NATIVE AUDIO STATUS. V27.9
viser også signalet etter Mac-mikseren og retter stereo-kanaltypen på Mac.
For lydrettingen må Native V27.9 bygges; weboppdatering alene er ikke nok.

Bruk
Web: pakk ut og last opp innholdet til GitHub. Vent på vellykket Pages-publisering.
Native: åpne BenKen_Native_V27_9_Mac_Stereo/App/BenKenStagePro.xcodeproj.
Velg My Mac (Mac Catalyst) eller iPad. Prøv Native i Practice / Stereo på Mac.
Native V27.9 virker også med Web V26.61, så Mac-lyden kan testes før webpublisering.

Kontrollert
27 webkontroller består. Ny Controls-visning er kontrollert lokalt i grensesnittet
med testbibliotek og simulerte native-svar. 29 native-tester og begge bygg består.
Mac-stereorettingen ga signal etter Mac-mikseren i faktisk hardwaretest; hørbar
lyd på brukerens Catalyst-app må fortsatt bekreftes.

Hovedmotoren er fortsatt en testutgave. Konsertkopi og hovedbibliotek er ennå
ikke samlet. Bølgeform, peak-målere, selvstendig metronom, FX og looper gjenstår.
Ingen publisering eller installasjon utføres automatisk.
