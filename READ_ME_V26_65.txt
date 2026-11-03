BenKen Web V26.65 – Share, Key, Click & Device Audio

Bruk Native V27.10 for systemvolum, buffervalg og de nye native-metronomlydene.
Webdelen må publiseres sammen med alle filene i ZIP-pakken.

Song key & capo
En egen #-knapp ligger over Setlist nederst til venstre. Den åpner sangtoneart,
Kenneth capo, Bente capo og Bente-referanse med dagens eksisterende logikk.
Toneartsvalget bruker lydmotorens område −2 til +2 halvtoner. Stopp avspilling
før lydens toneart endres. Original key er sangens registrerte opprinnelige toneart.
Lyrics / Chords / Both er lokale visningsvalg og kan skiftes under avspilling.

Metronom
Velg Soft beep, Wood block eller Bell i Count-in & metronome og trykk SAVE CLICK
SETTINGS. De samme tre lydtypene finnes i Browser og Native V27.10.
Flash Controls frame on the beat og Flash color lagres for denne enheten.
Rammen kan blinke under count-in og avspilling, også uten hørbar metronom.

Device volume og buffer
Øverst i Settings og under Audio & playback finnes Device volume.
På iPad med Native V27.10 vises Apples virkelige systemslider. Prosenten følger
både slideren og iPad-volumknappene. Save reference level lagrer ønsket nivå
lokalt som en referanse; det endrer ikke volum automatisk ved konsertstart.
Eksterne lydutganger kan ha sitt eget volum. Mac bruker Mac-/lydkortets volumkontroll.
Buffer viser ønsket og faktisk størrelse, frekvens og millisekunder. iPad kan be
om 256, 512 eller 1024 samples; standarden er fortsatt 1024. Mac viser faktisk
buffer fra standardlydenheten, og lar lydkortet/Mac styre størrelsen.
Fysisk iPad-test av systemslider, volumknapper, referansenivå og buffer gjenstår.

Deling med lyd
Settings → Share songs & setlists → Open sharing. Prosjektadressen og den
offentlige nøkkelen er lagt inn. Trykk SEND SIGN-IN EMAIL. Kopier innloggings-/bekreftelseslenken fra e-posten
uten å åpne den først, lim den inn i Code or sign-in link og trykk SIGN IN.
Velg så Current song eller
en setliste, velg 1 eller 7 dagers varighet, og last opp. Appen viser lenke og QR.
Lenken gir nedlastingstilgang til de delte låtene frem til utløp. QR lages lokalt.
Mottaker velger Add songs & audio; eksisterende bibliotek beholdes. Navnekollisjon
på setlister gir en ny '(shared 2)'-liste. Buser og mute-grupper remappes til ledige
plasser; import avvises før endringer dersom det ikke er nok ledige plasser.
QR åpner nettsiden. Open in BenKen app videresender til Native V27.10 via
benkenstagepro://share. Alternativt lim lenken inn under Receive a share i appen.
Native-mottak krever at webpakken også er publisert.

Lagring og feil
Store overføringer deles i nettbiter på opptil 24 MiB. Mottak bruker midlertidig
lokal fillagring der dette støttes, og kopierer så original lyd til appbiblioteket.
Uten slik lagring begrenses mottak til 256 MiB. Fullført import fungerer offline.
En avbrutt opplasting forsøker å rydde opp sine egne nettbiter. Delte filer ligger
fortsatt i lagringen etter lenkeutløp og kan slettes fra Storage senere; lenkeutløp
er ikke automatisk sletting eller frigjøring av kvote. Ingen automatisk betaling.

Kontrollert
50 webkontroller består, inkludert deling/QR/import med testlagring, store biter,
feilopprydding og vern av eksisterende låter. UI: Bente/Kenneth, toneart, alle tre
visninger, lydvalg og faktisk blinkklasse er prøvd med testsetliste og simulert
native-avspilling. Mottak med midlertidig fillagring og innlasting av
12 syntetiske lydfiler er også prøvd i nettleseren med lokal testserver; både
opprinnelig og mottatt setliste ble beholdt. Native: 30 tester, 29 kjørt og bestått, én opt-in hardwaretest
hoppet over. Begge Xcode-bygg består. Tre metronomlyder er rendret i stereo.
Privat lagring og opplastingsrett for prosjekteier er aktivert i Supabase.
Standard e-postmal er beholdt fordi gratisoppsettet ikke tillater egen tallkodemal.
Virkelig innlogging og opplasting/nedlasting fra appen må fortsatt prøves.
