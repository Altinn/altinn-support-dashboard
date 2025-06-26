# Altinn Support Dashboard - Project Structure

## Root
```
altinn-support-dashboard/
├── .git/
├── .github/
├── .gitignore
├── .vs/
├── LICENSE
├── README.md
├── changes.md
├── tree.md
├── altinn-support-dashboard.sln
├── backend/
│   ├── src/
│   │   └── altinn-support-dashboard.backend/
│   │       ├── Clients/
│   │       │   ├── AltinnApiClient.cs
│   │       │   ├── DataBrregClient.cs
│   │       │   └── GiteaApiClient.cs
│   │       ├── Controllers/
│   │       │   ├── AltinnController.cs
│   │       │   └── GiteaController.cs
│   │       ├── Models/
│   │       │   ├── BrregConfiguration.cs
│   │       │   ├── GiteaConfiguration.cs
│   │       │   └── Gitea/
│   │       │       └── GiteaModels.cs
│   │       ├── Program.cs
│   │       ├── Security/
│   │       ├── Services/
│   │       │   ├── AltinnApiService.cs
│   │       │   ├── DataBrregService.cs
│   │       │   ├── GiteaService.cs
│   │       │   └── Interfaces/
│   │       │       ├── IAltinnApiService.cs
│   │       │       ├── IDataBrregService.cs
│   │       │       └── IGiteaService.cs
│   │       ├── Startup.cs
│   │       ├── Validation/
│   │       ├── appsettings.json
│   │       └── backend.csproj
│   └── test/
├── frontend/
│   └── altinn-support-dashboard.client/
│       ├── public/
│       │   ├── index.html
│       │   ├── favicon.ico
│       │   └── version.json         # Versjonsinformasjon og endringslogg
│       └── src/
│           ├── components/
│           │   ├── MainContent/
│           │   ├── ManualRoleSearch/
│           │   ├── SettingsContent/
│           │   │   ├── SettingsContentComponent.tsx
│           │   │   ├── models/
│           │   │   └── utils/
│           │   ├── Sidebar/
│           │   │   ├── SidebarComponent.tsx
│           │   │   ├── hooks/
│           │   │   └── models/
│           │   ├── TopSearchBar/
│           │   └── VersionDialog/               # Versjonsmeldings-dialog
│           │       └── VersionDialog.tsx
│           ├── hooks/
│           │   ├── hooks.ts
│           │   └── useVersionCheck.ts           # Hook for versjonskontroll
│           ├── models/
│           ├── utils/
│           └── main.tsx
├── package.json
└── renovate.json
```

## Key Components Structure

### Frontend
The frontend follows a component-based architecture with:
- **Components**: UI components, each with its own folder
- **Hooks**: Custom React hooks for component logic
- **Models**: TypeScript types and interfaces
- **Utils**: Helper functions and utilities

### Backend
The backend follows a .NET structure with:
- **Clients**: External API clients (Altinn, Brreg)
- **Controllers**: HTTP endpoints/API controllers
- **Models**: Data models and DTOs
- **Services**: Business logic services
