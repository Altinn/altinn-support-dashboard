# Altinn Support Dashboard

## Introduksjon

Velkommen til Altinn Support Dashboard-prosjektet. Dette prosjektet har som mål å utvikle en moderne og effektiv webbasert løsning for Altinn Brukerservice (ABS) for å håndtere kundeservicehenvendelser. Den nye løsningen skal erstatte den eksisterende WPF-baserte applikasjonen og gi kundeservicemedarbeidere muligheten til å gjøre oppslag på roller, kontaktinformasjon og selskaper.

## Hvorfor webbasert?

Overgangen til en webbasert plattform gir flere fordeler:

- **Tilgjengelighet**: Brukerne kan få tilgang til verktøyet fra en hvilken som helst nettleser, uavhengig av hvilken enhet de bruker, noe som øker fleksibiliteten.
- **Enkel oppdatering**: Oppdateringer kan rulles ut sentralt på serveren, noe som reduserer tidsbruk og kompleksitet knyttet til distribusjon av oppdateringer. Brukerne får automatisk tilgang til de nyeste funksjonene uten manuelle oppdateringer.
- **Integrasjon**: Det blir enklere å integrere verktøyet med andre nettbaserte tjenester og systemer, noe som forbedrer samspillet og datautvekslingen mellom verktøyet og andre verktøy som brukes i daglig arbeid.
- **Skalerbarhet**: En webbasert løsning kan enklere skaleres for å håndtere økt antall brukere og forespørsler.

## Funksjonalitet

- **Oppslag**: Gjør oppslag basert på telefonnummer, organisasjonsnummer eller e-postadresse for å hente relevant informasjon om tilknyttede selskaper og personer.
- **Bedriftsinformasjon**: Få tilgang til detaljer om bedrifter innringeren er koblet til eller har rettigheter i.
- **Roller og Rettigheter**: Slå opp og vis roller, inkludert enhetsregisterroller (ER-roller).
- **Kontaktinformasjon**: Få opp kontaktinformasjon om personer i bedriften når du klikker på en bedrift.
- **Organisasjonsopprettelse**: Opprett nye organisasjoner i Altinn Studio med validering av informasjon mot Brønnøysundregistrene. Oppretter automatisk standard teams og repositories.
- **PAT-token håndtering**: Sikker lagring og validering av Personal Access Tokens for Altinn Studio i Settings-modulen, med miljøvelger for development eller production.
- **Brukervennlig grensesnitt**: Utviklet med React for å sikre en responsiv og intuitiv brukeropplevelse.
- **Sikkerhet**: Implementert i henhold til Microsoft Security Development Lifecycle for sikker håndtering av personopplysninger.

## Kjøring og oppsett

### Backend

For å kjøre backend:

1. Naviger til mappen `altinn-support-dashboard\backend\src\altinn-support-dashboard.backend`
2. Kjør kommandoen `dotnet run`

For å kjøre backend-tester:

1. Naviger til mappen `altinn-support-dashboard\backend\test\altinn-support-dashboard.backend.Tests`
2. Kjør kommandoen `dotnet test`

### Frontend

For å kjøre frontend lokalt:

1. Naviger til mappen `altinn-support-dashboard\frontend\altinn-support-dashboard.client`
2. Kjør kommandoen `npm run dev`

### Arbeidsflyt

1. Start backend-serveren først som vil tilby API-endepunkter for frontend-applikasjonen
2. Start deretter frontend-applikasjonen som vil koble seg til backend-serveren
3. Når begge kjører, vil frontend kommunisere med backend via API-kall for å hente og sende data
4. Eventuelle endringer i frontend-koden vil automatisk oppdateres i nettleseren (hot reload)
5. For endringer i backend-koden må serveren startes på nytt for at endringene skal tre i kraft

## Bidra

Vi setter pris på bidrag fra alle utviklere. For å bidra:

1. Fork repoet
2. Lag en feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit dine endringer (`git commit -m 'Add some AmazingFeature'`)
4. Push til branchen (`git push origin feature/AmazingFeature`)
5. Åpne en Pull Request

## Lisens

Dette prosjektet er lisensiert under MIT-lisensen - se [LICENSE](LICENSE) filen for detaljer.

## Kontakt

For spørsmål eller forespørsler, vennligst kontakt [Espen Halsen på epost](mailto:espen.elstad.halsen@digdir.no) eller [Andreas Bjørnå på epost](mailto:andreas.chummuenwai.bjorna@digdir.no).

## Dokumentasjon

For mer detaljer, sjekk ut all dokumentasjon på [pedia](#) (kommer).
