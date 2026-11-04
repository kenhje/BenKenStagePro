BenKen Stage Pro — Native V27.21 / Web V26.89
4. november 2026

Bygg App/BenKenStagePro.xcodeproj i denne nye Native-mappen over eksisterende app. Ikke slett appen eller biblioteket. Samme appidentitet og lagring beholdes.
Native V27.21 inneholder lydrettingene og oppstartsrettingen. Web V26.87/26.88 kan fortsatt brukes. Web V26.89 oppdaterer About og lydstatusvisningen; den anbefales, men er ikke nødvendig for selve native lydrettingen.

BAKGRUNNSAVSPILLING
Audio Units for spillere, klikk og miksing reserverer minst 4096 frames per renderblokk før motoren startes. Dette er kapasitet for iOS-bakgrunnskjøring, ikke en endring av ditt valgte hardwarebuffer. La bufferen stå på 1024 under første test.
Kontinuerlig signalmåling på lydstrømmen er slått av ved vanlig iPad/iPhone-avspilling for å redusere belastning. Mac-signaldiagnostikk og offline lydtester er beholdt.
Reelt bytte av lydutgang, frakobling eller en annen app som avbryter lydøkten kan fortsatt stoppe avspillingen. Ingen automatisk omstart ved et slikt avbrudd.

KLARGJØRING
Spor med uendret tempo og tonehøyde hopper over TimePitch-behandlingen. Filverifisering og klargjøring til 48 kHz beholdes; dette kan fortsatt ta tid, særlig med store filer og endret tempo/toneart. Verifiserte eksisterende lydcacher gjenbrukes.
Native lydstatus viser tid for filverifisering/installering og for klargjøring/innlasting, samt sist registrerte lydavbrudd. Web V26.89 forklarer at signalmåling er slått av på iOS.

TEST
1. Bruk Native, buffer 1024 og en låt uten tempo- eller toneartsendring.
2. Start avspilling, gå til Hjem-skjermen og la den spille minst ett minutt.
3. Gå tilbake, åpne Mixing Station mens samme låt spiller, og prøv minst ett minutt.
4. Gjenta med multitrack, separat USB-routing, tempo og transponering på ditt vanlige oppsett.
Hvis det stopper: åpne Settings > Audio & playback > Native audio status og lagre rapporten før du klargjør en annen låt. Rapporten inneholder tidspunkt/målinger og siste registrerte lydavbrudd.

Bygging og automatiske lydtester erstatter ikke fysisk iPad/iPhone-testing. Appbytte og Mixing Station må fortsatt bekreftes på dine enheter før livebruk.

Laget til BenKen™
Copyright © Kenneth Hjelle 2026
