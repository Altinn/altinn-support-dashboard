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
            if (_clients.TryGetValue(environmentName, out HttpClient client))
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
                string baseUrl = null;
                
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
        public async Task<GiteaUser> GetAuthenticatedUser(string environmentName)
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
        /// Oppretter en ny organisasjon
        /// </summary>
        public async Task<GiteaOrganization> CreateOrganization(string environmentName, GiteaOrganizationCreate organization)
        {
            try
            {
                var client = _clients[environmentName];
                var content = new StringContent(JsonSerializer.Serialize(organization, _jsonOptions), Encoding.UTF8, "application/json");
                
                var response = await client.PostAsync("api/v1/orgs", content);
                
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<GiteaOrganization>(responseContent, _jsonOptions);
                }
                
                _logger.LogError($"Feil ved opprettelse av organisasjon: {responseContent}");
                throw new HttpRequestException($"Kunne ikke opprette organisasjon. Status: {response.StatusCode}, Feilmelding: {responseContent}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved opprettelse av organisasjon for {environmentName}");
                throw;
            }
        }

        /// <summary>
        /// Oppretter et nytt team for en organisasjon
        /// </summary>
        public async Task<GiteaTeam> CreateTeam(string environmentName, string orgName, GiteaTeamCreate team)
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
        public async Task<GiteaRepository> CreateRepository(string environmentName, GiteaRepositoryCreate repo)
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
        public async Task<GiteaRepository> TransferRepository(string environmentName, string owner, string repo, string newOwner)
        {
            try
            {
                var client = _clients[environmentName];
                var transferOption = new { new_owner = newOwner };
                var content = new StringContent(JsonSerializer.Serialize(transferOption, _jsonOptions), Encoding.UTF8, "application/json");
                
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
                _logger.LogError(ex, $"Feil ved overføring av repository for {environmentName}");
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
