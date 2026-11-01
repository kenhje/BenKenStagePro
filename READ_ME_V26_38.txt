BENKEN STAGE PRO V26.38 — COMPACT TRACKS / AUDIO & FILES

OPPDATERING
Pakk ut ZIP-filen. Last opp innholdet i rotmappen til den eksisterende
kenhje/BenKenStagePro på GitHub, og erstatt filer med samme navn.
Last opp innholdet i demo/ også. Ikke last opp ZIP-filen eller slett andre
prosjektfiler. Åpne BenKen med internett etter publisering. Mixeren viser V26.38.

Dette er en nettoppdatering. Behold Xcode-appen som allerede fungerer.
Native LAN 26.37 og oppdateringen av følgersiden 26.37.1 er kompatible.
Du trenger ingen ny Swift-fil eller ny installasjon for denne endringen.
Ikke slett appen eller nullstill lokal lagring.

MIXER SETTINGS > TRACKS
Hver kompakte rad viser navn, farge og valgt output bus.
Trykk på bussfeltet for å åpne samlet innstilling for sporet:
- Output bus og mono/stereo
- Direkte USB-utgang hvis sporet ikke bruker buss
- Follow song key og mute groups
- AUTO COLOR og originalt filnavn

Endringer lagres automatisk. Panelet blir værende åpent når buss eller
format endres, slik at du kan gjøre flere valg. Når du åpner innstillingene
på nytt, er radene lukket. Det finnes fortsatt en egen MUTE GROUPS-fane.

MIXER SETTINGS > AUDIO & FILES
IMPORT / UPDATE FROM REAPER og + AUDIO FILES står øverst.
Sporlisten kommer rett under, med navn, REPLACE FILE og DELETE synlig.
FILE DETAILS under hvert spor viser originalfil, lagringsstatus, format,
lengde, størrelse og ruting.

Under listen finner du:
- Status og PREPARE AUDIO når lyd må klargjøres
- AUDIO OPTIONS: standardformat og standardbusser for nye spor
- FILE INFORMATION: filoppsummering og hjelpetekst

Ingen lydfiler, busser, mute groups eller spillelister flyttes av denne
oppdateringen. REAPER V5-import, tekstseksjoner, tempo/transpose, backup,
MIDI og lokal Host/Follow bruker samme lagring og protokoller som før.

KONTROLL
Eksisterende automatiske kontroller dekker filimport, REPLACE FILE, ruting,
lagring, mikserhandlinger, REAPER-oppdateringer, offline filer og LAN-broen.
En ekstra funksjonssjekk bekrefter åpning/lukking av kompakte sporvalg og
lagring av buss, stereo og mute group. Utseendet må kontrolleres på iPad;
ingen fysisk nettleser- eller enhetstest er kjørt her.

VERIFICATION
313 existing JavaScript/model checks passed. Compact control persistence
and responsive CSS constraints also passed targeted smoke checks. No native
source changed. Physical iPad/browser rendering still needs confirmation.
