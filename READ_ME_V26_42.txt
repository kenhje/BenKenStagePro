BENKEN STAGE PRO V26.42 — SEKSJONSKNAPPER FOR BERØRING

OPPDATERING
Pakk ut ZIP-filen. Last opp innholdet til rotmappen i ditt eksisterende
kenhje/BenKenStagePro-repository på GitHub, og erstatt filer med samme navn.
Ta også med demo/. Ikke last opp ZIP-filen eller slett gamle prosjektfiler.
Åpne BenKen med internett etter at GitHub-publiseringen er ferdig. Mixeren
skal vise V26.42. Lukk og åpne appen igjen hvis forrige versjon fortsatt vises.
Ingen Xcode-, Swift- eller REAPER Lua-oppdatering trengs.
Ikke slett appen eller nullstill lagringen.

TEST SEKSJONSAVSPILLING
1. Kontroller V26.42 i mixeren.
2. Slå på TAP SECTION TO PLAY i SETTINGS > LYRICS eller under CONTROLS.
3. Velg en sang med klargjort lyd og regioner fra REAPER eller SYNC LYRICS.
4. Trykk på seksjonsoverskriften i teksten, for eksempel Chorus.
5. Med WAVEFORM synlig: trykk på seksjonsnavnet i den fargede raden øverst.
   Feltet under navneraden brukes fortsatt til å dra avspillingsmarkøren.

Har du DOUBLE-TAP PLAY på, trykker du to ganger på samme seksjon for å
starte fra stopp. ALLOW SEEKING DURING PLAYBACK må være på for å hoppe
mens musikken spiller. Seksjonshopp starter uten en ny count-in.

ENDRET
Tekstoverskrifter og waveform-seksjoner har nå egne, vanlige knapper.
Navneraden har 44 px trykkhøyde og ligger atskilt fra waveform-skyveren.
Et kort trykk starter ved slipp og trenger ikke et ekstra klikk etterpå.
Et etterfølgende klikk starter ikke lyden på nytt. Gammelt tekstvalg andre
steder på siden blokkerer ikke et bevisst trykk på en seksjonsknapp.

Scroll, avbrutt berøring og lange trykk starter ikke musikk. En seksjonsknapp
kan brukes direkte i fullscreen. Vanlige trykk andre steder viser fortsatt
kontrollene. Manglende seksjonstid, avslått funksjon og seek-sperre gir nå
beskjed i kontrollfeltet, i stedet for å ignorere trykket uten forklaring.

BEHOLDT
REAPER-import med avhuking av spor, regionfarger fra Personalization eller
REAPER, kompakte Tracks/Buses, like filknapper, Autoplay, multitrack,
USB-ruting, mono-standard, mute groups, MIDI, backup, offline og Host/Follow.
Samme lokale lagring og native LAN-protokoll 26.37 / følgerside 26.37.1.

KONTROLL
To interaksjoner som ble blokkert i V26.41 er gjenskapt i modelltester:
berøring uten etterfølgende klikk og et gammelt tekstvalg. De samme
interaksjonene starter riktig seksjon i V26.42. Nye kontroller dekker
scroll, kansellering, langt trykk, dobbeltrykk og sangbytte under berøring.
Fysiske iPad-/Safari-trykk er ikke testet her og må bekreftes på enheten.

VERIFICATION
349 JavaScript/model checks and 1 dedicated CSS layout check passed (350 total).
Two blocked V26.41 interactions were reproduced and passed with V26.42.
Native source, audio processing and storage schema are unchanged.
A browser binary could not be downloaded in this environment; no physical
iPad/Safari or full browser interaction testing is claimed. Not deployed.
