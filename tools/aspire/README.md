# Aspire app host

Runs the backend and frontend locally from one command, with logs, traces and metrics in the Aspire dashboard.

## Prerequisites

* [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
* [Aspire CLI](https://aspire.dev/get-started/install-cli/)
* [Node.js (LTS)](https://nodejs.org/), with `npm install` run once in `frontend/altinn-support-dashboard.client`
* A trusted .NET development certificate (`dotnet dev-certs https --trust`). The backend and Vite both run on HTTPS.

## Run

```bash
cd tools/aspire
aspire run
```

The dashboard opens on `https://localhost:17194` and needs a trusted .NET development certificate (`aspire certs trust`). To skip the certificate for the dashboard, run it over plain HTTP with the `http` profile from `apphost.run.json`:

```bash
aspire run -lp http
```

The dashboard is then on `http://localhost:15194` with no login token. Only the dashboard changes; the backend and frontend still use HTTPS. It shows an "Endpoint is unsecured" banner, which is expected: anything on the machine can send telemetry to it or read it, so use the profile on your own machine only.

## What it starts

| Resource | What it is | Port |
| :--- | :--- | :--- |
| `backend` | `backend/src/altinn-support-dashboard.backend` | 5237 |
| `frontend` | `npm run dev` in `frontend/altinn-support-dashboard.client` | 5173 |

* The backend runs with `ASPNETCORE_ENVIRONMENT=Development`, so user secrets, client mocks and the dev login bypass work as with `dotnet run`.
* The ports are fixed because CORS, the login redirect and the Vite proxy hardcode `https://localhost:5173` and `https://localhost:5237`.
* The backend has a **Swagger** link in the URLs column.
* The frontend waits until the backend is running.
* The backend sends logs, traces and metrics to the dashboard. This only happens when `OTEL_EXPORTER_OTLP_ENDPOINT` is set, which Aspire does, so `dotnet run` and production are unaffected. The frontend only shows its console output.

## Dashboard actions

### Run tests

Each resource has a **Run tests** action. `backend` runs `dotnet test` on `backend/test/altinn-support-dashboard.backend.Tests`, and `frontend` runs `npx vitest run`.

* The test resource is hidden until its first run. After that it shows up under its resource with its own log.
* The state shows **Passed** (green) or **Failed** (red) based on the exit code.

### Change alert

When a `.cs`, `.csproj` or `.json` file changes under `backend/src/altinn-support-dashboard.backend`, the dashboard shows a yellow notification with a **Restart** button. `bin`, `obj` and `wwwroot` are ignored. The frontend has no alert, since Vite reloads changes by itself.

## Troubleshooting

* **`address already in use` on 5237 or 5173**: a backend or Vite started outside Aspire is still running. Stop it and restart the resource.
* **The frontend cannot reach `/api`**: check that `backend` is running and its log has `Application started` and `Now listening on: https://localhost:5237`.

