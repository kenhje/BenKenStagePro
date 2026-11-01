BENKEN STAGE PRO V26.39 — INLINE FILE DETAILS / COMPACT BUSES

OPPDATERING
Pakk ut ZIP-filen. Last opp innholdet til rotmappen i ditt eksisterende
kenhje/BenKenStagePro-repository på GitHub, og erstatt filer med samme navn.
Ta også med demo/. Ikke last opp ZIP-filen eller slett gamle prosjektfiler.
Åpne BenKen med internett etter at publiseringen er ferdig. Mixeren skal
vise V26.39. Lukk og åpne appen igjen hvis den fortsatt viser forrige versjon.

Ingen Xcode- eller Swift-oppdatering trengs denne gangen. Den fungerende
native appen med LAN 26.37 / følgerside 26.37.1 er fortsatt kompatibel.
Ikke slett appen eller nullstill lagringen.

AUDIO & FILES
Hvert spor har nå FILE DETAILS som en knapp ved siden av spornavn,
REPLACE FILE og DELETE. Når knappen er lukket, brukes ingen ekstra rad
på detaljer. Åpner du den, vises originalfil, lagringsstatus, format,
lengde, filstørrelse og ruting under det aktuelle sporet.

På smale telefonskjermer kan knappene legge seg på neste linje, slik at
navn og knapper forblir lesbare. På iPad og større skjermer ligger de ved
siden av hverandre. Navn lagres automatisk og filbytte beholder øvrige
sporinnstillinger. FILE DETAILS kan også leses mens avspilling pågår.

MIXER SETTINGS > BUSES
Bussene har samme kompakte stil som Tracks: navn, farge og USB-utgang.
Trykk på USB-feltet for å åpne bussens valg for mono/stereo, USB-utgang,
AUTO COLOR og oversikt over tilkoblede spor. Radene starter lukket;
trykker du på en bestemt buss fra mikseren, åpnes innstillingene for den.

Bussinnstillinger er fortsatt globale og brukes av alle sanger. Endringer
lagres automatisk. Det åpne panelet blir stående åpent når format endres.
Du kan se innstillingene under avspilling, men redigering er låst til stopp.

BEHOLDT
Kompakte Tracks, importknapper øverst i Audio & Files, standardbusser,
REAPER V5-oppdatering, tekstseksjoner, flersporsavspilling, mute groups,
backup, MIDI og lokal Host/Follow. Samme lagring og nettverksprotokoll.
Ingen endring i lydbehandling eller lydfiler.

KONTROLL
313 eksisterende automatiske JavaScript/modellsjekker bestått.
Funksjonssjekker bekrefter at File Details er skrivebeskyttet, viser riktig
fil etter navneendring/bytte, og at bussnavn, farge, format og USB-utgang
lagres ved omstart. CSS-oppsettet er kontrollert for telefon, iPad og Mac.
Fysisk nettleser-/iPad-visning er ikke testet her.

VERIFICATION
313 existing JavaScript/model checks passed. Inline file details, bus persistence
and responsive CSS constraints also passed targeted smoke checks. No native
source changed. Physical iPad/browser rendering still needs confirmation.
