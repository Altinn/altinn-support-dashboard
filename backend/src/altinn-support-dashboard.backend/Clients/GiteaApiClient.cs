using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AltinnSupportDashboard.Interfaces;
using AltinnSupportDashboard.Models.Gitea;

namespace AltinnSupportDashboard.Clients
{
    /// <summary>
    /// Client for interacting with the Gitea API
    /// </summary>
    public class GiteaApiClient : IGiteaApiClient
    {
        private readonly HttpClient _httpClient;

        public GiteaApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Gets current user info from Gitea API to validate token
        /// </summary>
        /// <param name="patToken">Personal Access Token for authentication</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea API</param>
        /// <returns>User info as string or null if token is invalid</returns>
        public async Task<string> GetCurrentUserAsync(string patToken, string giteaBaseUrl)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{giteaBaseUrl}/api/v1/user");
            request.Headers.Add("Authorization", $"token {patToken}");

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }
            return await response.Content.ReadAsStringAsync();
        }
    
        /// <summary>
        /// Creates a new organization in Gitea
        /// </summary>
        /// <param name="patToken">Personal Access Token for authentication</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea API</param>
        /// <param name="username">Organization username</param>
        /// <param name="fullName">Organization full name</param>
        /// <param name="website">Organization website (optional)</param>
        /// <returns>API response as string</returns>
        public async Task<string> CreateOrganizationAsync(string patToken, string giteaBaseUrl, string username, string fullName, string website)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{giteaBaseUrl}/api/v1/orgs");
            request.Headers.Add("Authorization", $"token {patToken}");
            
            var orgData = new
            {
                username = username,
                full_name = fullName,
                website = website,
                visibility = "public",
                repo_admin_change_team_access = false
            };
            
            var content = JsonSerializer.Serialize(orgData);
            request.Content = new StringContent(content, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            
            return responseContent;
        }
    
        /// <summary>
        /// Creates default teams for an organization
        /// </summary>
        /// <param name="patToken">Personal Access Token for authentication</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea API</param>
        /// <param name="orgName">Organization name</param>
        /// <returns>API response as string</returns>
        public async Task<string> CreateDefaultTeamsAsync(string patToken, string giteaBaseUrl, string orgName)
        {
            // Create the standard teams: Deploy-Production, Deploy-TT02, Devs, and Datamodels
            // These match the teams created in CreateOrgWithTeamsFunction.CreateTeams
            var teams = new[] 
            { 
                new { name = "Deploy-Production", permission = "read", description = "Members can deploy to production", canCreateRepo = false },
                new { name = "Deploy-TT02", permission = "read", description = "Members can deploy to TT02", canCreateRepo = false },
                new { name = "Devs", permission = "write", description = "All application developers", canCreateRepo = true },
                new { name = "Datamodels", permission = "write", description = "Team for those who can work on an organizations shared data models.", canCreateRepo = true }
            };
            
            var results = new StringBuilder();
            
            foreach (var team in teams)
            {
                var request = new HttpRequestMessage(HttpMethod.Post, $"{giteaBaseUrl}/api/v1/orgs/{orgName}/teams");
                request.Headers.Add("Authorization", $"token {patToken}");
                
                var teamData = new
                {
                    name = team.name,
                    description = team.description,
                    permission = team.permission,
                    can_create_org_repo = team.canCreateRepo,
                    includes_all_repositories = false
                };
                
                var content = JsonSerializer.Serialize(teamData);
                request.Content = new StringContent(content, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                results.AppendLine($"Team {team.name}: {response.StatusCode}");
                results.AppendLine(responseContent);
            }
            
            return results.ToString();
        }
        
        /// <summary>
        /// Creates a default datamodels repository for an organization
        /// </summary>
        /// <param name="patToken">Personal Access Token for authentication</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea API</param>
        /// <param name="orgName">Organization name</param>
        /// <returns>API response as string</returns>
        public async Task<string> CreateDefaultRepositoryAsync(string patToken, string giteaBaseUrl, string orgName)
        {
            var repoOption = new CreateRepositoryOptionModel
            {
                Name = "datamodels",
                Description = "Default repository for data models",
                Private = false,
                AutoInit = true,
                License = "mit",
                Readme = "Default"
            };
            
            return await CreateRepositoryAsync(patToken, giteaBaseUrl, orgName, repoOption, true);
        }
        
        /// <summary>
        /// Creates a team in an organization with specific options
        /// </summary>
        /// <param name="patToken">Personal Access Token</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea instance</param>
        /// <param name="orgName">Organization name</param>
        /// <param name="teamOption">Team creation options</param>
        /// <returns>API response as string</returns>
        public async Task<string> CreateTeamAsync(string patToken, string giteaBaseUrl, string orgName, CreateTeamOptionModel teamOption)
        {
            // In Gitea API v1, the team creation endpoint is POST /api/v1/orgs/{org}/teams
            var request = new HttpRequestMessage(HttpMethod.Post, $"{giteaBaseUrl}/api/v1/orgs/{orgName}/teams");
            request.Headers.Add("Authorization", $"token {patToken}");
            
            // The model now contains the Units property, so we can directly serialize it
            // This matches the CLI implementation that works
            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
            
            var content = JsonSerializer.Serialize(teamOption, jsonOptions);
            request.Content = new StringContent(content, Encoding.UTF8, "application/json");
            
            // For debugging
            Console.WriteLine($"Team creation payload: {content}");
            
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            
            // Log any error response for debugging
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Team creation failed with status: {response.StatusCode}, Response: {responseContent}");
            }
            
            return responseContent;
        }
        
        /// <summary>
        /// Creates a repository with specified options
        /// </summary>
        /// <param name="patToken">Personal Access Token</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea instance</param>
        /// <param name="orgName">Organization name</param>
        /// <param name="repositoryOption">Repository creation options</param>
        /// <param name="prefixWithOrgName">Whether to prefix the repository name with the organization name</param>
        /// <returns>API response as string</returns>
        public async Task<string> CreateRepositoryAsync(
            string patToken, 
            string giteaBaseUrl, 
            string orgName, 
            CreateRepositoryOptionModel repositoryOption, 
            bool prefixWithOrgName = true)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{giteaBaseUrl}/api/v1/orgs/{orgName}/repos");
            request.Headers.Add("Authorization", $"token {patToken}");
            
            // If prefixWithOrgName is true, add the org name as a prefix to the repository name
            // This matches the behavior of the CLI tool's CreateRepoForOrgsCommandHandler
            string repoName = prefixWithOrgName ? $"{orgName}-{repositoryOption.Name}" : repositoryOption.Name;
            
            // Create the repository data object - removing license if it's null or empty
            // to avoid the "license not found" error
            object repoData;
            
            if (string.IsNullOrWhiteSpace(repositoryOption.License))
            {
                repoData = new
                {
                    name = repoName,
                    description = repositoryOption.Description,
                    @private = repositoryOption.Private,
                    auto_init = repositoryOption.AutoInit,
                    readme = repositoryOption.Readme ?? "Default"
                };
            }
            else
            {
                repoData = new
                {
                    name = repoName,
                    description = repositoryOption.Description,
                    @private = repositoryOption.Private,
                    auto_init = repositoryOption.AutoInit,
                    license = repositoryOption.License,
                    readme = repositoryOption.Readme ?? "Default"
                };
            }
            
            var content = JsonSerializer.Serialize(repoData);
            request.Content = new StringContent(content, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            
            return responseContent;
        }
    }
}
