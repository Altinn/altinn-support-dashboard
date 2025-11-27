using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Models.Gitea;
using Microsoft.Extensions.Logging;

namespace altinn_support_dashboard.Server.Clients
{
    /// <summary>
    /// Klient for interaksjon med Gitea API (dev.altinn.studio)
    /// </summary>
    public class GiteaApiClient
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger<GiteaApiClient> _logger;
        private readonly Dictionary<string, HttpClient> _clients = new();
        private readonly GiteaConfiguration _giteaConfiguration;
        private readonly JsonSerializerOptions _jsonOptions;

        /// <summary>
        /// Initialiserer en ny instans av GiteaApiClient-klassen
        /// </summary>
        public GiteaApiClient(IHttpClientFactory clientFactory, IOptions<GiteaConfiguration> giteaConfiguration, ILogger<GiteaApiClient> logger)
        {
            _clientFactory = clientFactory;
            _giteaConfiguration = giteaConfiguration.Value;
            _logger = logger;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };

            // Initialiserer klienter for hvert miljø
            InitClient("development", _giteaConfiguration.Development);
            InitClient("production", _giteaConfiguration.Production);
        }

        private void InitClient(string environmentName, GiteaEnvironmentConfiguration configuration)
        {
            var client = _clientFactory.CreateClient($"Gitea-{environmentName}");
            client.BaseAddress = new Uri(configuration.BaseUrl);
            client.Timeout = TimeSpan.FromSeconds(configuration.Timeout);

            _clients.Add(environmentName, client);
        }

        /// <summary>
        /// Setter GitHub Personal Access Token for autentisering
        /// </summary>
        public void SetAuthToken(string environmentName, string token)
        {
            if (_clients.TryGetValue(environmentName, out var client))
            {
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Add("Authorization", $"token {token}");
            }
        }

        /// <summary>
        /// Validerer om en PAT-token er gyldig
        /// </summary>
        public async Task<bool> ValidateToken(string environmentName, string token)
        {
            try
            {
                // Sjekk om token har riktig format (40 tegn)
                if (string.IsNullOrEmpty(token) || token.Length != 40)
                {
                    _logger.LogWarning("Ugyldig token format. Token må være 40 tegn lang.");
                    return false;
                }

                var client = _clientFactory.CreateClient();
                string baseUrl = "";

                // Finn riktig base URL basert på valgt miljø
                if (environmentName.Equals("development", StringComparison.OrdinalIgnoreCase))
                {
                    baseUrl = _giteaConfiguration.Development.BaseUrl;
                }
                else if (environmentName.Equals("production", StringComparison.OrdinalIgnoreCase))
                {
                    baseUrl = _giteaConfiguration.Production.BaseUrl;
                }
                else
                {
                    _logger.LogError($"Ukjent miljø: {environmentName}");
                    return false;
                }

                if (string.IsNullOrEmpty(baseUrl))
                {
                    _logger.LogError($"Manglende baseUrl for miljø: {environmentName}");
                    return false;
                }

                // Sikre at baseUrl ender med /
                if (!baseUrl.EndsWith("/"))
                {
                    baseUrl += "/";
                }

                client.BaseAddress = new Uri(baseUrl);
                client.DefaultRequestHeaders.Add("Authorization", $"token {token}");

                // Sjekk om brukeren har tilgang ved å hente brukerinformasjon
                // Bruker samme API-endepunkt som RepoCleanup-verktøyet
                var response = await client.GetAsync("api/v1/user");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Token validering feilet. Statuskode: {response.StatusCode}");
                    return false;
                }

                _logger.LogInformation("Token er gyldig");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil under validering av token for miljø {environmentName}");
                return false;
            }
        }

        /// <summary>
        /// Henter autentisert bruker
        /// </summary>
        public async Task<GiteaUser?> GetAuthenticatedUser(string environmentName)
        {
            try
            {
                var client = _clients[environmentName];
                var response = await client.GetAsync("api/v1/user");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<GiteaUser>(content, _jsonOptions);
                }

                throw new HttpRequestException($"Kunne ikke hente autentisert bruker. Status: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved henting av autentisert bruker for {environmentName}");
                throw;
            }
        }

        /// <summary>
        /// Validerer at organisasjonsnavn følger standard format
        /// </summary>
        private bool IsValidOrgShortName(string shortName)
        {
            // Må starte med en liten bokstav og være 2-5 tegn
            return System.Text.RegularExpressions.Regex.IsMatch(shortName, @"^[a-z][a-z0-9-]{0,3}[a-z0-9]$");
        }

        /// <summary>
        /// Validerer at nettadresse følger tillatt format
        /// </summary>
        private bool IsValidWebsite(string website)
        {
            return System.Text.RegularExpressions.Regex.IsMatch(website, @"^[a-zA-Z0-9\-._/:]*$");
        }

        /// <summary>
        /// Oppretter en ny organisasjon i Gitea
        /// </summary>
        public async Task<GiteaOrganization> CreateOrganization(string environmentName, GiteaOrganizationCreate organization)
        {
            try
            {
                if (!_clients.TryGetValue(environmentName, out var client))
                {
                    throw new Exception($"Ingen klient konfigurert for miljø {environmentName}");
                }

                // Validering av organisasjonsnavn
                if (!IsValidOrgShortName(organization.Username))
                {
                    _logger.LogError($"Ugyldig organisasjonsnavn: '{organization.Username}'. Navnet må starte med en liten bokstav og slutte med en liten bokstav eller tall, 2-5 tegn.");
                    throw new ArgumentException($"Ugyldig organisasjonsnavn. Navnet må starte med en liten bokstav og slutte med en liten bokstav eller tall, 2-5 tegn.");
                }

                // Validering av nettside
                if (!string.IsNullOrEmpty(organization.Website) && !IsValidWebsite(organization.Website))
                {
                    _logger.LogError($"Ugyldig nettadresse: '{organization.Website}'. Kun bokstaver, tall og tegnene '-', '_', '.', '/', ':' er tillatt.");
                    throw new ArgumentException($"Ugyldig nettadresse. Kun bokstaver, tall og tegnene '-', '_', '.', '/', ':' er tillatt.");
                }

                var requestContent = new StringContent(
                    JsonSerializer.Serialize(organization, _jsonOptions),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await client.PostAsync("api/v1/orgs", requestContent);

                if (!response.IsSuccessStatusCode)
                {
                    var errorJson = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Feil ved opprettelse av organisasjon: {response.StatusCode}, {errorJson}");
                    throw new HttpRequestException($"Kunne ikke opprette organisasjon. Status: {response.StatusCode}, Feilmelding: {errorJson}");
                }

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<GiteaOrganization>(content, _jsonOptions);
            }
            catch (Exception ex) when (!(ex is ArgumentException) && !(ex is HttpRequestException))
            {
                _logger.LogError(ex, $"Uventet feil ved opprettelse av organisasjon for {environmentName}");
                throw;
            }
        }

        /// <summary>
        /// Oppretter et nytt team for en organisasjon
        /// </summary>
        public async Task<GiteaTeam?> CreateTeam(string environmentName, string orgName, GiteaTeamCreate team)
        {
            try
            {
                var client = _clients[environmentName];
                var content = new StringContent(JsonSerializer.Serialize(team, _jsonOptions), Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"api/v1/orgs/{orgName}/teams", content);

                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<GiteaTeam>(responseContent, _jsonOptions);
                }

                _logger.LogError($"Feil ved opprettelse av team: {responseContent}");
                throw new HttpRequestException($"Kunne ikke opprette team. Status: {response.StatusCode}, Feilmelding: {responseContent}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved opprettelse av team for {environmentName}");
                throw;
            }
        }

        /// <summary>
        /// Oppretter et nytt repository under den autentiserte brukeren
        /// </summary>
        public async Task<GiteaRepository?> CreateRepository(string environmentName, GiteaRepositoryCreate repo)
        {
            try
            {
                var client = _clients[environmentName];
                var content = new StringContent(JsonSerializer.Serialize(repo, _jsonOptions), Encoding.UTF8, "application/json");

                var response = await client.PostAsync("api/v1/user/repos", content);

                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<GiteaRepository>(responseContent, _jsonOptions);
                }

                _logger.LogError($"Feil ved opprettelse av repository: {responseContent}");
                throw new HttpRequestException($"Kunne ikke opprette repository. Status: {response.StatusCode}, Feilmelding: {responseContent}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved opprettelse av repository for {environmentName}");
                throw;
            }
        }

        /// <summary>
        /// Overfører eierskap av et repository
        /// </summary>
        public async Task<GiteaRepository?> TransferRepository(string environmentName, string owner, string repo, GiteaRepositoryTransfer transfer)
        {
            try
            {
                if (!_clients.TryGetValue(environmentName, out var client))
                {
                    throw new Exception($"Ingen klient konfigurert for miljø {environmentName}");
                }

                var content = new StringContent(JsonSerializer.Serialize(transfer, _jsonOptions), Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"api/v1/repos/{owner}/{repo}/transfer", content);

                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<GiteaRepository>(responseContent, _jsonOptions);
                }

                _logger.LogError($"Feil ved overføring av repository: {responseContent}");
                throw new HttpRequestException($"Kunne ikke overføre repository. Status: {response.StatusCode}, Feilmelding: {responseContent}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved overføring av repository {owner}/{repo} til {transfer.NewOwner} for {environmentName}");
                throw;
            }
        }

        /// <summary>
        /// Sjekker om en organisasjon eksisterer
        /// </summary>
        public async Task<bool> OrganizationExists(string environmentName, string orgName)
        {
            try
            {
                var client = _clients[environmentName];
                var response = await client.GetAsync($"api/v1/orgs/{orgName}");

                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved sjekk av organisasjon for {environmentName}");
                return false;
            }
        }
    }
}
