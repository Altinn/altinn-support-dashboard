using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Clients;
using altinn_support_dashboard.Server.Models.Gitea;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace altinn_support_dashboard.Server.Services
{
    /// <summary>
    /// Implementasjon av tjenesten for Gitea operasjoner
    /// </summary>
    public class GiteaService : IGiteaService
    {
        private readonly GiteaApiClient _giteaApiClient;
        private readonly ILogger<GiteaService> _logger;
        private Dictionary<string, string> _tokens = new Dictionary<string, string>();

        /// <summary>
        /// Initialiserer en ny instans av GiteaService
        /// </summary>
        public GiteaService(GiteaApiClient giteaApiClient, ILogger<GiteaService> logger)
        {
            _giteaApiClient = giteaApiClient;
            _logger = logger;
        }

        /// <summary>
        /// Validerer en PAT-token for et gitt miljø
        /// </summary>
        public async Task<PatValidationResult> ValidateTokenAsync(string environmentName, string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return new PatValidationResult
                {
                    IsValid = false,
                    Message = "Token kan ikke være tom"
                };
            }

            try
            {
                bool isValid = await _giteaApiClient.ValidateToken(environmentName, token);

                if (isValid)
                {
                    _tokens[environmentName] = token;
                    _giteaApiClient.SetAuthToken(environmentName, token);

                    return new PatValidationResult
                    {
                        IsValid = true,
                        Message = "Token er gyldig og lagret"
                    };
                }

                return new PatValidationResult
                {
                    IsValid = false,
                    Message = "Ugyldig token eller manglende rettigheter"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved validering av token for miljø {environmentName}");

                return new PatValidationResult
                {
                    IsValid = false,
                    Message = $"Feil ved validering: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Setter aktiv PAT-token for et miljø
        /// </summary>
        public void SetToken(string environmentName, string token)
        {
            _tokens[environmentName] = token;
            _giteaApiClient.SetAuthToken(environmentName, token);
        }

        /// <summary>
        /// Sjekker om en organisasjon eksisterer
        /// </summary>
        public async Task<bool> OrganizationExistsAsync(string environmentName, string orgName)
        {
            try
            {
                return await _giteaApiClient.OrganizationExists(environmentName, orgName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved sjekk om organisasjon eksisterer for {environmentName}");
                return false;
            }
        }

        /// <summary>
        /// Oppretter en ny organisasjon med standardteam og datamodels repository
        /// </summary>
        public async Task<OrganizationCreationResult> CreateOrganizationAsync(string environmentName, OrganizationCreationRequest request)
        {
            // Validering av input
            var validationResult = ValidateOrganizationRequest(request);
            if (!validationResult.Success)
            {
                return validationResult;
            }

            try
            {
                // 1. Opprett organisasjon
                var orgResult = await CreateOrganization(environmentName, request);
                if (!orgResult.Success)
                {
                    return orgResult;
                }

                // 2. Opprett standardteam
                var teamsResult = await CreateDefaultTeams(environmentName, request.ShortName);
                if (!teamsResult.Success)
                {
                    return new OrganizationCreationResult
                    {
                        Success = false,
                        Message = teamsResult.Message,
                        Organization = orgResult.Organization
                    };
                }

                // 3. Opprett standard datamodels repository
                var repoResult = await CreateDefaultRepository(environmentName, request.ShortName);
                if (!repoResult.Success)
                {
                    return new OrganizationCreationResult
                    {
                        Success = false,
                        Message = repoResult.Message,
                        Organization = orgResult.Organization,
                        Teams = teamsResult.Teams
                    };
                }

                // Alt er vellykket
                return new OrganizationCreationResult
                {
                    Success = true,
                    Message = "Organisasjon opprettet vellykket med team og repository",
                    Organization = orgResult.Organization,
                    Teams = teamsResult.Teams,
                    DefaultRepository = repoResult.DefaultRepository
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved opprettelse av organisasjon for {environmentName}");

                return new OrganizationCreationResult
                {
                    Success = false,
                    Message = $"Uventet feil: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Validerer forespørsel om organisasjonsoppretting
        /// </summary>
        private OrganizationCreationResult ValidateOrganizationRequest(OrganizationCreationRequest request)
        {
            // Valider ShortName (Username)
            if (string.IsNullOrEmpty(request.ShortName))
            {
                return new OrganizationCreationResult
                {
                    Success = false,
                    Message = "Kortnavn kan ikke være tomt"
                };
            }

            // ShortName må starte med en bokstav og slutte med bokstav eller tall
            // Kun tillatte tegn er a-z, 0-9 og bindestrek
            // Lengde: 2-5 tegn
            var shortNamePattern = new Regex("^[a-z][a-z0-9-]{0,3}[a-z0-9]$");
            if (!shortNamePattern.IsMatch(request.ShortName))
            {
                return new OrganizationCreationResult
                {
                    Success = false,
                    Message = "Kortnavn må starte med en bokstav, slutte med bokstav eller tall, kun inneholde små bokstaver, tall og bindestrek, og være 2-5 tegn langt"
                };
            }

            // Valider FullName
            if (string.IsNullOrEmpty(request.FullName))
            {
                return new OrganizationCreationResult
                {
                    Success = false,
                    Message = "Fullt navn kan ikke være tomt"
                };
            }

            // FullName kan ikke være alt i store bokstaver
            if (request.FullName == request.FullName.ToUpper() && !Regex.IsMatch(request.FullName, "^[^a-z]*$"))
            {
                return new OrganizationCreationResult
                {
                    Success = false,
                    Message = "Fullt navn kan ikke være kun store bokstaver"
                };
            }

            // Valider WebsiteUrl (valgfritt felt)
            if (!string.IsNullOrEmpty(request.WebsiteUrl))
            {
                // URL må følge et gyldig format
                // Tillatte tegn: a-zA-Z0-9-._/:
                var urlPattern = new Regex("^[a-zA-Z0-9\\-._/:]*$");
                if (!urlPattern.IsMatch(request.WebsiteUrl))
                {
                    return new OrganizationCreationResult
                    {
                        Success = false,
                        Message = "Nettstedsadresse har et ugyldig format. Kun bokstaver, tall og tegnene -._/: er tillatt"
                    };
                }

                try
                {
                    // Sjekk om det er en gyldig URL
                    var uri = new Uri(request.WebsiteUrl);
                }
                catch
                {
                    return new OrganizationCreationResult
                    {
                        Success = false,
                        Message = "Nettstedsadresse er ikke en gyldig URL"
                    };
                }
            }

            return new OrganizationCreationResult { Success = true, Message = "Validering fullført" };
        }

        /// <summary>
        /// Oppretter en organisasjon i Gitea
        /// </summary>
        private async Task<OrganizationCreationResult> CreateOrganization(string environmentName, OrganizationCreationRequest request)
        {
            try
            {
                // Sjekk om organisasjonen allerede eksisterer
                bool orgExists = await OrganizationExistsAsync(environmentName, request.ShortName);
                if (orgExists)
                {
                    return new OrganizationCreationResult
                    {
                        Success = false,
                        Message = $"Organisasjon med kortnavn '{request.ShortName}' eksisterer allerede"
                    };
                }

                // Opprett organisasjonen
                var orgRequest = new GiteaOrganizationCreate
                {
                    Username = request.ShortName,
                    FullName = request.FullName,
                    Description = request.Description, // Legg til beskrivelse fra forespørselen
                    Website = request.WebsiteUrl,
                    Visibility = "public",
                    RepoAdminChangeTeamAccess = false
                };

                var organization = await _giteaApiClient.CreateOrganization(environmentName, orgRequest);

                return new OrganizationCreationResult
                {
                    Success = true,
                    Message = "Organisasjon opprettet",
                    Organization = organization
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved opprettelse av organisasjon for {environmentName}");

                return new OrganizationCreationResult
                {
                    Success = false,
                    Message = $"Kunne ikke opprette organisasjon: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Oppretter standardteam for en organisasjon
        /// </summary>
        private async Task<OrganizationCreationResult> CreateDefaultTeams(string environmentName, string orgName)
        {
            var teams = new List<GiteaTeamCreate>
            {
                new GiteaTeamCreate
                {
                    Name = "Deploy-Production",
                    Description = "Team med tilgang til å deploye til produksjonsmiljø",
                    Permission = "read",
                    UnitsPermission = "read",
                    IncludesAllRepositories = false,
                    CanCreateOrgRepo = false
                },
                new GiteaTeamCreate
                {
                    Name = "Deploy-TT02",
                    Description = "Team med tilgang til å deploye til testmiljø",
                    Permission = "read",
                    UnitsPermission = "read",
                    IncludesAllRepositories = false,
                    CanCreateOrgRepo = false
                },
                new GiteaTeamCreate
                {
                    Name = "Devs",
                    Description = "All application developers",
                    Permission = "write",
                    UnitsPermission = "write",
                    IncludesAllRepositories = true,
                    CanCreateOrgRepo = true
                },
                new GiteaTeamCreate
                {
                    Name = "Datamodels",
                    Description = "Team for those who can work on an organizations shared data models",
                    Permission = "write",
                    UnitsPermission = "write",
                    IncludesAllRepositories = false,
                    CanCreateOrgRepo = false
                }
            };

            var createdTeams = new List<GiteaTeam>();
            bool success = true;
            string errorMessage = string.Empty;

            try
            {
                foreach (var team in teams)
                {
                    try
                    {
                        var createdTeam = await _giteaApiClient.CreateTeam(environmentName, orgName, team);
                        if (createdTeam != null)
                        {

                            createdTeams.Add(createdTeam);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Feil ved opprettelse av team {team.Name} for {orgName}");
                        success = false;
                        errorMessage = $"Feil ved opprettelse av team {team.Name}: {ex.Message}";
                    }
                }

                return new OrganizationCreationResult
                {
                    Success = success,
                    Message = success ? "Teams opprettet vellykket" : errorMessage,
                    Teams = createdTeams
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved opprettelse av standardteam for {orgName}");

                return new OrganizationCreationResult
                {
                    Success = false,
                    Message = $"Kunne ikke opprette standardteam: {ex.Message}",
                    Teams = createdTeams
                };
            }
        }

        /// <summary>
        /// Oppretter standard 'datamodels' repository for en organisasjon
        /// </summary>
        private async Task<OrganizationCreationResult> CreateDefaultRepository(string environmentName, string orgName)
        {
            try
            {
                // Hent autentisert bruker
                var user = await _giteaApiClient.GetAuthenticatedUser(environmentName);

                // Opprett repository under den autentiserte brukeren
                string repoName = $"{orgName}-datamodels";
                var repoRequest = new GiteaRepositoryCreate
                {
                    Name = repoName,
                    Description = $"Standard datamodell-repository for {orgName}",
                    AutoInit = true,
                    DefaultBranch = "main",
                    Private = false
                };

                var repo = await _giteaApiClient.CreateRepository(environmentName, repoRequest);

                // Overfør eierskap til den nye organisasjonen
                var transferRequest = new GiteaRepositoryTransfer
                {
                    NewOwner = orgName
                };


                if (user == null)
                {
                    throw new Exception("User is null");
                }

                var transferredRepo = await _giteaApiClient.TransferRepository(
                    environmentName,
                    user.Username,
                    repoName,
                    transferRequest);

                return new OrganizationCreationResult
                {
                    Success = true,
                    Message = "Standard repository opprettet vellykket",
                    DefaultRepository = transferredRepo
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved opprettelse av standard repository for {orgName}");

                return new OrganizationCreationResult
                {
                    Success = false,
                    Message = $"Kunne ikke opprette standard repository: {ex.Message}"
                };
            }
        }
    }
}
