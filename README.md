# Altinn Support Dashboard

## Introduction

Altinn support dashboard was built to give ABS and servicedesk a modern and efficient web-based tool to help end users. We have also begun to introduce functionality and tooling which can help different development teams and digdir emplooyes navigate altinn data in a easy and effective way.

## Features

- **Lookup**: Search by phone number, organization number or email address to find related organizations and people.
- **Organization information**: View details about the organizations the caller is connected to or has rights in.
- **Roles and rights**: Look up and display roles, including Central Coordinating Register roles (ER roles).
- **Contact information**: View contact information for people in an organization by clicking on it.
- **Manual role search**: Look up roles and delegations between two parties.
- **Resource search**: Search for resources (currently limited to apps) by title.
- **ID conversion**: Convert an organization number or national identity number to UUID and PartyId.
- **Dialog lookup**: Find a dialog in Dialogporten by dialog ID, correspondence ID or app instance ID, and view dialog details.
- **Notification search**: Search for notifications, and look up the notification log for a dialog ID or transmission ID.
- **Notification availability**: Check whether a person or organization can be reached by notifications.
- **Test correspondence**: Create and send a correspondence for testing (beta).
- **User-friendly interface**: Built with React for a responsive and intuitive user experience.

## Technologies

- **Backend**: .NET 10, C#, ASP.NET Core Web API
- **Frontend**: React 19, TypeScript, Vite
- **Testing**: xUnit (backend), Vitest and Playwright (frontend)
- **CI/CD**: GitHub Actions
- **Hosting**: Azure App Service
- **Authentication**: Azure Entra ID (MSAL)
- **API integrations**: REST APIs for the Brønnøysund Register Centre and Altinn
- **Styling and components**: [Designsystemet](https://designsystemet.no/en)

## Getting started

### Prerequisites
Before you start, make sure you have the following installed:
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js (LTS version)](https://nodejs.org/)
- [npm (comes with Node.js)](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

### Cloning the repo
To clone the repo, run:

```
git clone https://github.com/Altinn/altinn-support-dashboard.git
```

## Running the dashboard locally

- Start the backend: `dotnet run --project backend/src/altinn-support-dashboard.backend/backend.csproj`
- Install frontend dependencies (first time, or when dependencies change): `npm install --prefix frontend/altinn-support-dashboard.client`
- Start the frontend: `npm run dev --prefix frontend/altinn-support-dashboard.client`

Alternatively, start the backend and frontend together with Aspire: `cd tools/aspire && aspire run`. See [tools/aspire/README.md](tools/aspire/README.md).

## Running tests

- Backend: `dotnet test --project backend/test/altinn-support-dashboard.backend.Tests`
- Frontend unit tests (Vitest): `npm test --prefix frontend/altinn-support-dashboard.client`
- Frontend end-to-end tests (Playwright): run `npx playwright test` from `frontend/altinn-support-dashboard.client`

## Folder structure

### Frontend
The frontend follows a component-based architecture with:
- **Components**: UI components, each in its own folder
- **Pages**: One component per page/route
- **Hooks**: Custom React hooks for component logic
- **Stores**: Global state (Zustand)
- **Models**: TypeScript types and interfaces
- **Utils**: Helper functions

### Backend
The backend follows a standard .NET structure with:
- **Clients**: External API clients (Altinn, Brreg)
- **Controllers**: HTTP endpoints/API controllers
- **Models**: Data models and DTOs
- **Services**: Business logic
- **Security**: Authentication and authorization setup
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or requests, please contact [Siri Esteri Berg-Johnsen](mailto:siri.esteri.berg-johnsen@digdir.no) by email.

## Documentation

The system is also documented on [Confluence](https://digdir.atlassian.net/wiki/spaces/BASD/overview) (requires Digdir login).
