BenKen Stage Pro — Native V27.25 / Web V26.109
5. november 2026

USB: Native ber eksplisitt om tilgjengelige utgangskanaler på iPad/iPhone. Beholdt USB-routing kontrolleres mot tilgjengelige kanaler. Appen ruter aldri automatisk til stereo for å skjule en USB-feil.

REFRESH OUTPUTS klargjør et allerede lastet native-prosjekt på nytt fra den lokale lydcachen. Har forrige klargjøring feilet, forsøker webdelen vanlig klargjøring. En ny tilkobling mens avspilling er stoppet utløser klargjøring av valgt låt. Ingen automatisk avspilling ved tilkobling.

Preparing: Web viser kopierte byte; Native viser faktisk fremdrift i lydrenderingen, spor for spor. Kontroll av filer og kobling av utganger er egne faser. Brukt tid vises; et sikkert tidsestimat for det som gjenstår kan ikke gis. Native V27.25 kreves for detaljert fremdrift og Refresh outputs.

Åpne App/BenKenStagePro.xcodeproj. Bruk samme Team og appidentitet som eksisterende app og bygg over den. Ikke slett appen eller biblioteket. Publiser alle Web V26.109-filene sammen.

Kontrollert: iOS- og Mac Catalyst-bygg bestått. 42 lydmotortester kjørt, 2 maskinvareavhengige tester hoppet over, ingen feil. Webtest for fremdrift, refresh, feil og lagring bestått.

Fysisk Ui24R/iPad-test gjenstår. Test mikser før appstart, tilkobling etter appstart, kabel ut/inn med avspilling stoppet, alle rutede utganger og bytte til Mixing Station. Bruk ikke oppdateringen live før dette er bekreftet.

Laget til BenKen™ — Copyright © Kenneth Hjelle 2026
