BenKen Stage Pro Web V26.102 · Native V27.23

MASTER-meteret viser målt signal etter Native-miksen (alle utgangene). Oppdatering omtrent 10 ganger i sekundet. Bare ett målepunkt, ingen ekstra måling per spor. Målingen går ut på tid når mikseren ikke vises / appen er i bakgrunnen. Eksisterende transport- og bakgrunnsavspilling beholdes.
Signal betyr at lyd går gjennom motoren. Det bekrefter ikke patching/volum i Ui24R eller lyd fra høyttalere. Det er en samplet signalindikator, ikke en true-peak-måler. Separate spor-, buss- og Song-metere er fortsatt uten separat Native-måling.

Tuneren har kortere ferskt vindu for gitar og sang, langt vindu for bass, raskere oppdatering og mindre flakking rundt grønt. Ingen mikrofonbehandling fortsetter etter at tuneren lukkes. Testet med testsignaler; ekte instrument og mikrofon må bekrefte forbedringen.
Show Info ligger på egen 44 px høy rad med mer avstand fra Done. About og manual er oppdatert.

Denne oppdateringen KREVER en ny Native-bygging for signalmeteret:
1. Last opp alle webfilene til appens GitHub-repo som før.
2. Pakk ut Native V27.23 og åpne App/BenKenStagePro.xcodeproj.
3. Bygg over eksisterende BenKen Stage Pro på iPad/iPhone/Mac. Ikke slett appen. Appidentitet, webadresse og eksisterende lagring er beholdt.
4. About skal vise Web V26.102 og Native V27.23.

Build og automatiske tester passerer. Fysisk iPad/iPhone/Ui24R og ditt bibliotek må testes før livebruk.
