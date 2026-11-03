BenKen Web V26.72 – Calendar, venues, packing & tuner input fix

BRUK WEB V26.72 SAMMEN MED NATIVE V27.12
Bygg App/BenKenStagePro.xcodeproj fra Native V27.13-pakken på iPad/Mac.
Den gamle Native-appen får ikke den direkte mikrofonrettingen bare ved weboppdatering.
START TUNER skal nå be om mikrofontilgang direkte fra native-appen.
På iPad foretrekkes innebygd mikrofon. På Mac brukes systemets lydinngang.
Input level viser om det kommer signal. Stop / Done / bakgrunn stopper mikrofonen.
Mac-prosjektet har Audio Input-rettighet for hardened runtime.
Browser ber om mikrofon før den venter på AudioContext, og bruker en stille analyseutgang.
Virkelig mikrofon og avspilling etter tuning må prøves på fysisk enhet.

KALENDER
Kun i Settings → PLANNING: Calendar, Venues og Packing list. Ingen kalenderknapp i hovedbildet.
Calendar: legg til øving/konsert, dato, start/slutt, oppmøte, lydprøve, spillested, sett og låter.
Venues: Add venue med adresse, kontakt, telefon, e-post og scenenotater.
Packing list: mal kopieres til nye arrangementer. Legg til/fjern utstyr, juster antall,
og kryss av separat for Pack for the gig og Bring home.
Contract: egne arrangør-, honorar- og vilkårsfelt. CONTRACT DRAFT eksporterer et HTML-utkast
som kan åpnes og skrives ut / lagres som PDF. Ingen sending eller signering skjer automatisk.

Kalenderen lagres lokalt og følger med i bibliotekbackup. .ICS er manuell eksport,
ikke automatisk Apple/Google-synk. Google-import gjøres på datamaskin.
Felles bandkonto, invitasjoner og automatisk kalenderabonnement er ikke aktivert i denne versjonen.
Kontakter og kontraktsbeløp inkluderes ikke automatisk i .ics eller deling av låt/setliste.

MANUAL
Settings → Manual har nå 34 søkbare kapitler. manual.html er også inkludert for offline lesing/utskrift.

KONTROLL
133 automatiske kontroller (119 web / 14 native tuner-DSP og kommandohåndtering).
Native V27.13 bygger for Mac Catalyst og iPad-simulator. Mikrofonen er ikke fysisk testet.
UI testet med isolert bibliotek, testarrangement og simulert native-mikrofon.

REFERANSER
Apple mikrofontillatelse: https://support.apple.com/no-no/102213
Mac Audio Input: https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.security.device.audio-input
Google kalenderimport: https://support.google.com/calendar/answer/37118
Apple kalenderimport: https://support.apple.com/no-no/guide/calendar/icl1023/mac

V26.72 / Native V27.13
- Ny vannrett tuner i valgt skin. Grønn innenfor +/-2,5 cent.
- Overlappende native analyse og finmåling ved full samplingsfrekvens.
- Apple / iOS Calendar: Connect, velg skrivbar kalender, Sync now. Valgfri oppdatering etter lagring. Enveis BenKen til Kalender, ingen bandinvitasjoner.
- Venues: postnummer, by, nettside og native Apple Maps-søk.
- Pakkeliste: egen Edit list / Done editing.
- Kalendervisning Month / Day / Upcoming og flere kontraktfelt.
Bygg Native V27.13 og oppdater webfilene til V26.72. Faktisk mikrofonpresisjon og kalenderrettighet må testes på enheten.
