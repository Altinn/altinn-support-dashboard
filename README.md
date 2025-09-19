# Altinn Support Dashboard

## Introduksjon

Velkommen til Altinn Support Dashboard. Løsningen ble utviklet for å få en moderne og effektiv webbasert løsning for Altinn Brukerservice (ABS). Løsningen gir kundeservicemedarbeidere tilgang til Altinn-roller, kontaktinformasjon og selskaper.

## Funksjonalitet

- **Oppslag**: Gjør oppslag basert på telefonnummer, organisasjonsnummer eller e-postadresse for å hente relevant informasjon om tilknyttede selskaper og personer.
- **Bedriftsinformasjon**: Få tilgang til detaljer om bedrifter innringeren er koblet til eller har rettigheter i.
- **Roller og Rettigheter**: Slå opp og vis roller, inkludert enhetsregisterroller (ER-roller).
- **Kontaktinformasjon**: Få opp kontaktinformasjon om personer i bedriften når du klikker på en bedrift.
- **Organisasjonsopprettelse**: Opprett nye organisasjoner i Altinn Studio med validering av informasjon mot Brønnøysundregistrene. Oppretter automatisk standard teams og repositories.
- **PAT-token håndtering**: Sikker lagring og validering av Personal Access Tokens for Altinn Studio i Settings-modulen, med miljøvelger for development eller production.
- **Brukervennlig grensesnitt**: Utviklet med React for å sikre en responsiv og intuitiv brukeropplevelse.
- **Sikkerhet**: Implementert i henhold til Microsoft Security Development Lifecycle for sikker håndtering av personopplysninger.


## Teknologier

- **Backend**: .NET 7, C#, ASP.NET Core Web API
- **Frontend**: React, TypeScript, Vite
- **Testing**: xUnit for backend
- **CI/CD**: GitHub Actions
- **Hosting**: Azure App Service
- **Autentisering**: Azure AD B2C
- **API Integrasjoner**: REST-API til Brønnøysundregistrene og Altinn 
- **Styling og komponenter**: Designsystemet fra Digdir (@digdir/designsystemet-css og @digdir/designsystemet-react)

## Komme i gang

### Forutsetninger
Før du begynner bør du ha følgende installert:
- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- [Node.js (LTS versjon)](https://nodejs.org/)
- [npm (kommer med Node.js)](https://www.npmjs.com/)
- [Git](https://git-scm.com/)


### Kloning av repo
For å klone repoet, kjør følgende kommando i terminalen:

git clone https://github.com/Altinn/altinn-support-dashboard.git


## Kjøre dashboardet på lokal maskin

- Kjør kommandoen `dotnet run --project backend/src/altinn-support-dashboard.backend/backend.csproj` (starter backend)
- Kjør kommandoen `npm install` (trengs bare første gang eller for oppdatering av avhengigheter)
- Kjør kommandoen `npm run dev --prefix frontend/altinn-support-dashboard.client` (starter frontend)

## Kjøre backend-tester:
- Kjør kommandoen `dotnet test --project backend/test/altinn-support-dashboard.backend.Tests`

## Mappestrukturen med hovedkomponentene

### Frontend
Frontend følger en komponentbasert arkitektur med:
- **Komponenter**: UI-komponenter, hver med sin egen mappe
- **Hooks**: Egendefinerte React-hooks for komponentlogikk
- **Modeller**: TypeScript-typer og -grensesnitt
- **Verktøy (utils)**: Hjelpefunksjoner og verktøy

### Backend
Backend følger en .NET-struktur med:
- **Klienter**: Eksterne API-klienter (Altinn, Brreg)
- **Kontrollere**: HTTP-endepunkter/API-kontrollere
- **Modeller**: Datamodeller og DTO-er
- **Servicer**: Forretningslogikk-tjenester
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

For spørsmål eller forespørsler, vennligst kontakt [Ernst Jonny Lyngøy](mailto:ernst.jonny.lyngoy@digdir.no) på epost

## Dokumentasjon

Systemet er også dokumentert på [Confluence](https://digdir.atlassian.net/wiki/spaces/BK/pages/3403087933/Altinn+Dashboard+Utvikling) (krever Digdir innlogging)