using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AltinnSupportDashboard.Interfaces;
using AltinnSupportDashboard.Models.Gitea;

namespace AltinnSupportDashboard.Services
{
    /// <summary>
    /// Service for Gitea operations
    /// </summary>
    public class GiteaService : IGiteaService
    {
        private readonly IGiteaApiClient _giteaApiClient;
        
        /// <summary>
        /// Initializes a new instance of the <see cref="GiteaService"/> class
        /// </summary>
        public GiteaService(IGiteaApiClient giteaApiClient)
        {
            _giteaApiClient = giteaApiClient;
        }
        
        /// <inheritdoc/>
        public bool IsValidToken(string token)
        {
            return !string.IsNullOrWhiteSpace(token) && token.Trim().Length == 40;
        }
        
        /// <inheritdoc/>
        public bool IsValidOrgShortName(string shortName)
        {
            return Regex.IsMatch(shortName, "^[a-z]+[a-z0-9-]*[a-z0-9]$");
        }
        
        /// <inheritdoc/>
        public bool IsValidWebsite(string website)
        {
            return Regex.IsMatch(website, "^[a-zA-Z0-9\\-._/:]*$");
        }
        
        /// <inheritdoc/>
        public async Task<string> TestPatTokenAsync(string patToken, string giteaBaseUrl)
        {
            if (!IsValidToken(patToken))
            {
                throw new ArgumentException("Invalid token format. Personal Access Tokens must be exactly 40 characters long.");
            }
            
            var userInfo = await _giteaApiClient.GetCurrentUserAsync(patToken, giteaBaseUrl);
            if (userInfo == null)
            {
                throw new UnauthorizedAccessException("Invalid PAT token or Gitea instance.");
            }
            
            return userInfo;
        }
        
        /// <inheritdoc/>
        public async Task<(bool success, string message, object results)> CreateOrganizationWithDefaultsAsync(
            string patToken, 
            string giteaBaseUrl, 
            string username, 
            string fullname, 
            string website)
        {
            // Validate inputs
            if (!IsValidToken(patToken))
            {
                return (false, "Invalid token format. Personal Access Tokens must be exactly 40 characters long.", null);
            }
            
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(fullname))
            {
                return (false, "Organization username and full name are required.", null);
            }
            
            if (!IsValidOrgShortName(username))
            {
                return (false, "Invalid organization username format. Username must start with a lowercase letter, " +
                      "contain only lowercase letters, numbers, or hyphens, and end with a letter or number.", null);
            }
            
            if (!string.IsNullOrWhiteSpace(website) && !IsValidWebsite(website))
            {
                return (false, "Invalid website format. Website must contain only letters, numbers, hyphens, underscores, periods, forward slashes, and colons.", null);
            }
            
            var results = new Dictionary<string, object>();
            
            try
            {
                // Step 1: Verify the token by getting user info (similar to SetupNewServiceOwnerFunction.Run in CLI option 9)
                string userInfoJson = await _giteaApiClient.GetCurrentUserAsync(patToken, giteaBaseUrl);
                if (userInfoJson == null)
                {
                    return (false, "Could not authenticate with the provided token.", null);
                }
                
                results.Add("userInfo", JsonDocument.Parse(userInfoJson).RootElement);
                
                // Step 2: Create the organization (similar to CreateOrgCommandHandler.Handle in CLI)
                string orgResultJson = await _giteaApiClient.CreateOrganizationAsync(
                    patToken, 
                    giteaBaseUrl, 
                    username, 
                    fullname, 
                    website);
                
                // Check if organization was created successfully
                var orgCreated = false;
                try 
                {
                    var jsonDoc = JsonDocument.Parse(orgResultJson);
                    orgCreated = jsonDoc.RootElement.TryGetProperty("id", out _);
                    results.Add("organization", jsonDoc.RootElement);
                }
                catch 
                {
                    return (false, $"Could not create organization {fullname}", new { details = orgResultJson });
                }
                
                if (!orgCreated)
                {
                    return (false, $"Could not create organization {fullname}", new { details = orgResultJson });
                }
                
                // Step 3: Create default teams (similar to CreateDefaultTeamsCommandHandler.Handle in CLI)
                var teamsResult = await CreateDefaultTeamsAsync(patToken, giteaBaseUrl, username);
                results.Add("teams", teamsResult.results);
                
                // Step 4: Create default repository (similar to CreateRepoForOrgsCommandHandler.Handle in CLI)
                var repoOption = GetDefaultRepositoryOption();
                var repoResult = await CreateRepositoryAsync(patToken, giteaBaseUrl, username, repoOption);
                results.Add("repository", repoResult.result);
                
                // Return successful result with all created resources
                return (true, $"Successfully created organization {username} with default teams and repository", results);
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred while creating the organization: {ex.Message}", results);
            }
        }
        
        /// <inheritdoc/>
        public async Task<(bool success, string message, object result)> CreateTeamAsync(
            string patToken,
            string giteaBaseUrl,
            string orgName,
            CreateTeamOptionModel teamOption)
        {
            if (!IsValidToken(patToken))
            {
                return (false, "Invalid token format. Personal Access Tokens must be exactly 40 characters long.", null);
            }
            
            try
            {
                string result = await _giteaApiClient.CreateTeamAsync(patToken, giteaBaseUrl, orgName, teamOption);
                
                // Handle empty responses or error cases
                if (string.IsNullOrWhiteSpace(result))
                {
                    return (false, $"Failed to create team {teamOption.Name}: Empty response from server", null);
                }
                
                try
                {
                    var jsonDoc = JsonDocument.Parse(result);
                    
                    // Check for id property to confirm success
                    bool isSuccess = jsonDoc.RootElement.TryGetProperty("id", out _);
                    
                    if (isSuccess)
                    {
                        return (true, $"Successfully created team {teamOption.Name}", jsonDoc.RootElement);
                    }
                    else
                    {
                        // Check if there's an error message in the response
                        if (jsonDoc.RootElement.TryGetProperty("message", out var errorMessage))
                        {
                            return (false, $"Failed to create team {teamOption.Name}: {errorMessage}", jsonDoc.RootElement);
                        }
                        else
                        {
                            return (false, $"Failed to create team {teamOption.Name}", jsonDoc.RootElement);
                        }
                    }
                }
                catch (JsonException)
                {
                    // Return the raw response if we can't parse it as JSON
                    return (false, $"Failed to create team {teamOption.Name}: Invalid JSON response", result);
                }
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred creating team: {ex.Message}", null);
            }
        }
        
        /// <inheritdoc/>
        public async Task<(bool success, string message, IList<object> results)> CreateDefaultTeamsAsync(
            string patToken,
            string giteaBaseUrl,
            string orgName)
        {
            if (!IsValidToken(patToken))
            {
                return (false, "Invalid token format. Personal Access Tokens must be exactly 40 characters long.", null);
            }
            
            var defaultTeams = GetDefaultTeamOptions();
            var results = new List<object>();
            var creationSuccess = true;
            
            foreach (var team in defaultTeams)
            {
                try
                {
                    var (success, message, result) = await CreateTeamAsync(patToken, giteaBaseUrl, orgName, team);
                    
                    // Store the actual result instead of just a URL
                    if (result != null)
                    {
                        results.Add(result);
                    }
                    else
                    {
                        results.Add(new { name = team.Name, message = message });
                    }
                    
                    if (!success)
                    {
                        creationSuccess = false;
                    }
                }
                catch (Exception ex)
                {
                    creationSuccess = false;
                    results.Add(new { name = team.Name, message = $"Exception: {ex.Message}" });
                }
            }
            
            if (creationSuccess)
            {
                return (true, $"Successfully created all default teams for {orgName}", results);
            }
            else
            {
                return (true, $"Some teams could not be created for {orgName}", results); // Return partial success
            }
        }
        
        /// <inheritdoc/>
        public async Task<(bool success, string message, object result)> CreateRepositoryAsync(
            string patToken,
            string giteaBaseUrl,
            string orgName,
            CreateRepositoryOptionModel repositoryOption,
            bool prefixWithOrgName = true)
        {
            if (!IsValidToken(patToken))
            {
                return (false, "Invalid token format. Personal Access Tokens must be exactly 40 characters long.", null);
            }
            
            try
            {
                string result = await _giteaApiClient.CreateRepositoryAsync(patToken, giteaBaseUrl, orgName, repositoryOption, prefixWithOrgName);
                var jsonDoc = JsonDocument.Parse(result);
                bool isSuccess = jsonDoc.RootElement.TryGetProperty("id", out _);
                
                string repoName = prefixWithOrgName ? 
                    $"{orgName}-{repositoryOption.Name}" : repositoryOption.Name;
                
                if (isSuccess)
                {
                    return (true, $"Successfully created repository {repoName}", jsonDoc.RootElement);
                }
                else
                {
                    return (false, $"Failed to create repository {repoName}", jsonDoc.RootElement);
                }
            }
            catch (Exception ex)
            {
                return (false, $"An error occurred creating repository: {ex.Message}", null);
            }
        }
        
        /// <inheritdoc/>
        public IList<CreateTeamOptionModel> GetDefaultTeamOptions()
        {
            // Match the teams in the CLI's CreateDefaultTeamsCommandHandler
            // The third parameter originally was 'includesAllRepositories' but is now 'canCreateRepo'
            // The fourth parameter is 'permission'
            return new List<CreateTeamOptionModel>
            {
                new CreateTeamOptionModel
                {
                    Name = "Deploy-Production",
                    Description = "Members can deploy to production",
                    Permission = Permission.Read,
                    CanCreateOrgRepo = false,
                    IncludesAllRepositories = true
                },
                new CreateTeamOptionModel
                {
                    Name = "Deploy-TT02",
                    Description = "Members can deploy to TT02",
                    Permission = Permission.Read,
                    CanCreateOrgRepo = false,
                    IncludesAllRepositories = true
                },
                new CreateTeamOptionModel
                {
                    Name = "Devs",
                    Description = "All application developers",
                    Permission = Permission.Write,
                    CanCreateOrgRepo = true,
                    IncludesAllRepositories = true
                },
                new CreateTeamOptionModel
                {
                    Name = "Datamodels",
                    Description = "Team for those who can work on an organizations shared data models.",
                    Permission = Permission.Write,
                    CanCreateOrgRepo = false,
                    IncludesAllRepositories = true
                }
            };
        }
        
        /// <inheritdoc/>
        public CreateRepositoryOptionModel GetDefaultRepositoryOption()
        {
            // Match the default repository configuration from the CLI tool
            // Removed license parameter as it was causing an error
            return CreateRepositoryOptionModel.GetCreateRepositoryOption(
                "datamodels",
                "Default repository for data models",
                false,
                true,
                null,
                "Default");
        }
    }
}
