IPAD — TEST AV LOKALT NETTVERK (NATIVE 26.31.3)

OPPDATER I XCODE
1. Åpne ditt eksisterende BenKenStagePro-prosjekt.
2. Velg app-filen du bruker: hos deg BenKenMIDIApp 2.swift.
3. Åpne nye BenKenMIDIApp.swift fra denne mappen i en teksteditor.
   Kopier HELE innholdet, erstatt hele innholdet i din eksisterende
   BenKenMIDIApp 2.swift i Xcode og lagre med Cmd+S.
   Ikke legg til enda en kopi av Swift-filen i prosjektet.
4. Velg tilkoblet iPad øverst og trykk Run (trekanten).
Behold ditt Team, Bundle Identifier og installerte app. Ikke slett appen.
MIDIService.swift trenger ingen endring.

TEST
1. BenKen > Settings > Ui24R Cue Follow.
2. Med internett: PREPARE OFFLINE ACCESS én gang for å lagre biblioteket.
3. Bytt til samme lokale Wi-Fi som Ui24R. Skriv mikserens IP, f.eks. 10.10.1.1.
4. TEST LOCAL NETWORK. Godkjenn Lokalt nettverk dersom iPad spør.
5. Testen viser HTTP-svar eller iPads konkrete feil/feilkode. Ta bilde av
   denne meldingen hvis det ikke virker. Ved HTTP-svar: prøv CONNECT.

Testen laster ikke ned forbindelsesbiblioteket først. Den leser rotadressen
og sender ingen cue-, snapshot- eller showkommando. HTTP-svar viser at en
server kan nås; det bekrefter ikke alene at Ui24R-cueprotokollen fungerer.
Den tidligere timeout-feilen er ikke bekreftet rettet på fysisk enhet.

HVIS TESTEN SIER AT TILLATELSESBESKRIVELSEN MANGLER
Den kontrollerer den faktisk installerte appen. I Xcode: velg TARGET > Info.
Privacy - Local Network Usage Description må ha en forklarende verdi.
Medfølgende Info.plist viser prosjektets oppsett. Behold egne innstillinger;
ikke overskriv en tilpasset plist ukritisk. Kontroller at target bruker
riktig Info.plist og kjør Run igjen.

Hvis BenKen vises i iPad > Innstillinger > Personvern og sikkerhet > Lokalt
nettverk, må bryteren være på. Manglende oppføring alene påviser ikke årsaken.
Samme IP kan også testes i Safari på den samme iPad-en og mikserens Wi-Fi.
Testen tillater bare private IPv4-adresser på port 80.

Den innebygde JavaScript-broen er modelltestet med BenKen V26.35. Her finnes
ikke Xcode/Apple SDK. Swift-kompilering og virkelig Ui24R-forbindelse må
prøves på Mac/iPad. GitHub-oppdatering alene legger ikke til native knappen.
