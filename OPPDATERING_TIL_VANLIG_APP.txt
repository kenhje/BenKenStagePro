BenKen Stage Pro — Web V26.87 / Native V27.19
4. november 2026

DENNE OPPDATERINGEN TRENGER BÅDE WEBFILENE OG NY BYGGING I XCODE.
Publiser alle webfilene samlet. Åpne App/BenKenStagePro.xcodeproj i den nye Native-mappen. Velg din enhet og bygg over den eksisterende BenKen Stage Pro-appen. Ikke slett appen. Samme appidentitet og datalager er beholdt. Ta backup med lyd før oppdatering.

BAKGRUNNSAVSPILLING
Velg Native under Settings > Audio & playback. Start en låt, bytt til Mixing Station, og kontroller at lyden fortsetter. Tilbake i BenKen skal tidsvisningen oppdateres.
Webdelen pauser ikke lenger den nye native motoren ved pagehide, og unødvendige meldinger om uendret lydrute ignoreres. Native lyd og MIDI Clock er uavhengige av nettleserens tidtakere.
Ved stopp i visningsprosessen fortsetter aktiv native avspilling. STOP AUDIO vises før RETRY kan brukes.
Reelt bytte/frakobling av lydutgang og lydavbrudd stopper fortsatt avspillingen. Tvangsavslutting av BenKen stopper lyden. Automatisk neste låt i bakgrunnen er ikke bekreftet.

MIDI CLOCK
Settings > MIDI & pedals > MIDI CLOCK OUTPUT.
Stopp musikken. Velg én tilkoblet MIDI-utgang, slå på Send MIDI Clock with playback og lagre. Innstillingen huskes lokalt på hver enhet.
Clock følger låtens avspillingstempo, også ved tempoendring, uavhengig av manuelt metronomtempo. Krever kjent BPM mellom 20 og 300 og Native-motoren.
Send Start / Stop er valgfritt og av som standard. START sendes på første musikkslag etter count-in ved start fra begynnelsen. Clock sendes også under count-in. Pause/stopp/lydavbrudd sender STOP når valget er på.
Seek eller resume flytter ikke looperens posisjon og sender ikke ny START. Begynn fra låtstart for felles start. Looperens lagrede looper må være satt opp for ekstern temposync.
Velg ekstern MIDI/USB-temposync på RC-600. Enheten må vises som MIDI-utgang; hvis direkte USB ikke fungerer, bruk kompatibelt USB–MIDI-interface til DIN MIDI IN.
Ved MIDI-frakobling eller klokkeavbrudd fortsetter lyden uten Clock. Stopp og start igjen for ny synkronisering.

KONTROLLERT
iOS Simulator og Mac Catalyst bygger. 35 Swift-tester, 2 hoppet over, ingen feil; inkludert virkelig CoreMIDI-kommunikasjon med virtuell testutgang og tidsstemplede Clock/Start/Stop-meldinger.
Web-regresjoner passerer, inklusive count-in, tempo, sveip, menyer og bakgrunnsvalg. MIDI-meny og lagring er kontrollert med simulert enhet.
Fysisk iPad/Mixing Station og RC-600 er IKKE testet her. Dette må prøves med ditt fulle lydoppsett før livebruk. Ha konserten tilgjengelig på reserveenheten.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026
