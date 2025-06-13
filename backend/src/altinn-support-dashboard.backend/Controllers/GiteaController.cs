using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Text.Json;
using System.Threading.Tasks;
using AltinnSupportDashboard.Interfaces;
using AltinnSupportDashboard.Models.Gitea;

namespace AltinnSupportDashboard.Controllers
{
    /// <summary>
    /// Controller for Gitea operations
    /// </summary>
    [ApiController]
    [Route("api/{environmentName}/gitea")]
    public class GiteaController : ControllerBase
    {
        private readonly IGiteaService _giteaService;

        /// <summary>
        /// Initializes a new instance of the <see cref="GiteaController"/> class
        /// </summary>
        public GiteaController(IGiteaService giteaService)
        {
            _giteaService = giteaService;
        }

        /// <summary>
        /// Gets the base URL for a Gitea environment
        /// </summary>
        /// <param name="environmentName">The name of the environment</param>
        /// <returns>The base URL for the environment</returns>
        private string GetGiteaBaseUrl(string environmentName)
        {
            return environmentName.ToLower() switch
            {
                "development" => "https://dev.altinn.studio/repos/",
                "staging" => "https://staging.altinn.studio/repos/",
                "production" => "https://altinn.studio/repos/",
                "local" => "http://studio.localhost/repos/",
                _ => throw new ArgumentException($"Unknown environment: {environmentName}")
            };
        }
        
        /// <summary>
        /// Validates if the environment name is valid
        /// </summary>
        /// <param name="environmentName">The environment name to validate</param>
        /// <returns>True if the environment is valid, otherwise false</returns>
        private bool IsValidEnvironment(string environmentName)
        {
            string normalizedEnv = environmentName.ToLower();
            return normalizedEnv == "development" ||
                   normalizedEnv == "staging" ||
                   normalizedEnv == "production" ||
                   normalizedEnv == "local";
        }

        /// <summary>
        /// Tests if a Personal Access Token (PAT) is valid for the specified Gitea environment
        /// </summary>
        /// <param name="environmentName">Name of the environment (development, staging, production, local)</param>
        /// <param name="request">Contains the PAT token</param>
        /// <returns>User information if token is valid, otherwise unauthorized</returns>
        [HttpPost("test-pat")]
        public async Task<IActionResult> TestPatToken([FromRoute] string environmentName, [FromBody] PatTokenRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(request.PatToken))
            {
                return BadRequest("PAT token is required.");
            }
            
            if (!IsValidEnvironment(environmentName))
            {
                return BadRequest("Invalid environment name. Must be one of: development, staging, production, local.");
            }
            
            try
            {
                string giteaBaseUrl = GetGiteaBaseUrl(environmentName);
                var userInfo = await _giteaService.TestPatTokenAsync(request.PatToken, giteaBaseUrl);
                return Ok(userInfo);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid PAT token or Gitea instance.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while testing the PAT token", error = ex.Message });
            }
        }

        /// <summary>
        /// Creates a new organization in Gitea with default teams and repositories.
        /// This implements the same functionality as option 9 in the CLI tool (SetupNewServiceOwnerFunction).
        /// </summary>
        /// <param name="environmentName">Name of the environment (development, staging, production, local)</param>
        /// <param name="request">Contains organization details and authentication</param>
        /// <returns>Result of organization creation process</returns>
        [HttpPost("create/orgwithteams")]
        public async Task<IActionResult> CreateOrganization([FromRoute] string environmentName, [FromBody] CreateOrganizationRequestModel request)
        {
            // Validate basic inputs
            if (string.IsNullOrWhiteSpace(request.PatToken))
            {
                return BadRequest("PAT token is required.");
            }
            
            if (!IsValidEnvironment(environmentName))
            {
                return BadRequest("Invalid environment name. Must be one of: development, staging, production, local.");
            }
            
            try
            {
                string giteaBaseUrl = GetGiteaBaseUrl(environmentName);
                var (success, message, results) = await _giteaService.CreateOrganizationWithDefaultsAsync(
                    request.PatToken,
                    giteaBaseUrl,
                    request.ShortName,
                    request.Fullname,
                    request.Website);

                if (success)
                {
                    return Ok(new { message, results });
                }
                else
                {
                    return BadRequest(new { message, results });
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Could not authenticate with the provided token.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the organization", error = ex.Message });
            }
        }

        /// <summary>
        /// Creates a team in an organization with specific options.
        /// </summary>
        /// <param name="environmentName">Name of the environment (development, staging, production, local)</param>
        /// <param name="orgName">Organization name</param>
        /// <param name="request">Team creation request with options</param>
        /// <returns>Result of team creation process</returns>
        [HttpPost("organizations/{orgName}/teams")]
        public async Task<IActionResult> CreateTeam([FromRoute] string environmentName, [FromRoute] string orgName, [FromBody] TeamRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(orgName))
            {
                return BadRequest("Organization name is required.");
            }
            
            if (string.IsNullOrWhiteSpace(request.PatToken))
            {
                return BadRequest("PAT token is required.");
            }
            
            if (request.TeamOption == null || string.IsNullOrWhiteSpace(request.TeamOption.Name))
            {
                return BadRequest("Team name is required.");
            }
            
            if (!IsValidEnvironment(environmentName))
            {
                return BadRequest("Invalid environment name. Must be one of: development, staging, production, local.");
            }
            
            try
            {
                string giteaBaseUrl = GetGiteaBaseUrl(environmentName);
                var (success, message, result) = await _giteaService.CreateTeamAsync(
                    request.PatToken,
                    giteaBaseUrl,
                    orgName,
                    request.TeamOption);

                if (success)
                {
                    return Ok(new { message, result });
                }
                else
                {
                    return BadRequest(new { message, result });
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Could not authenticate with the provided token.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the team", error = ex.Message });
            }
        }

        /// <summary>
        /// Creates default teams for an organization
        /// </summary>
        /// <param name="environmentName">Name of the environment (development, staging, production, local)</param>
        /// <param name="orgName">Organization name</param>
        /// <param name="request">Authentication details</param>
        /// <returns>Result of team creation process</returns>
        [HttpPost("organizations/{orgName}/default-teams")]
        public async Task<IActionResult> CreateDefaultTeams([FromRoute] string environmentName, [FromRoute] string orgName, [FromBody] PatTokenRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(orgName))
            {
                return BadRequest("Organization name is required.");
            }
            
            if (string.IsNullOrWhiteSpace(request.PatToken))
            {
                return BadRequest("PAT token is required.");
            }
            
            if (!IsValidEnvironment(environmentName))
            {
                return BadRequest("Invalid environment name. Must be one of: development, staging, production, local.");
            }
            
            try
            {
                string giteaBaseUrl = GetGiteaBaseUrl(environmentName);
                var (success, message, results) = await _giteaService.CreateDefaultTeamsAsync(
                    request.PatToken,
                    giteaBaseUrl,
                    orgName);

                if (success)
                {
                    return Ok(new { message, results });
                }
                else
                {
                    return BadRequest(new { message, results });
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Could not authenticate with the provided token.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating default teams", error = ex.Message });
            }
        }

        /// <summary>
        /// Gets the default team options that would be created for new organizations
        /// </summary>
        /// <returns>List of default team options</returns>
        [HttpGet("default-team-options")]
        public IActionResult GetDefaultTeamOptions()
        {
            try
            {
                var teamOptions = _giteaService.GetDefaultTeamOptions();
                return Ok(teamOptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting default team options", error = ex.Message });
            }
        }

        /// <summary>
        /// Creates a repository in an organization with specific options
        /// </summary>
        /// <param name="environmentName">Name of the environment (development, staging, production, local)</param>
        /// <param name="orgName">Organization name</param>
        /// <param name="request">Repository creation request with options</param>
        /// <returns>Result of repository creation process</returns>
        [HttpPost("organizations/{orgName}/repositories")]
        public async Task<IActionResult> CreateRepository([FromRoute] string environmentName, [FromRoute] string orgName, [FromBody] RepositoryRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(orgName))
            {
                return BadRequest("Organization name is required.");
            }
            
            if (string.IsNullOrWhiteSpace(request.PatToken))
            {
                return BadRequest("PAT token is required.");
            }
            
            if (request.RepositoryOption == null || string.IsNullOrWhiteSpace(request.RepositoryOption.Name))
            {
                return BadRequest("Repository name is required.");
            }
            
            if (!IsValidEnvironment(environmentName))
            {
                return BadRequest("Invalid environment name. Must be one of: development, staging, production, local.");
            }
            
            try
            {
                string giteaBaseUrl = GetGiteaBaseUrl(environmentName);
                var (success, message, result) = await _giteaService.CreateRepositoryAsync(
                    request.PatToken,
                    giteaBaseUrl,
                    orgName,
                    request.RepositoryOption,
                    request.PrefixWithOrgName);

                if (success)
                {
                    return Ok(new { message, result });
                }
                else
                {
                    return BadRequest(new { message, result });
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Could not authenticate with the provided token.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the repository", error = ex.Message });
            }
        }
        
        /// <summary>
        /// Gets the default repository option that would be created for new organizations
        /// </summary>
        /// <returns>Default repository option</returns>
        [HttpGet("default-repository-option")]
        public IActionResult GetDefaultRepositoryOption()
        {
            try
            {
                var repoOption = _giteaService.GetDefaultRepositoryOption();
                return Ok(repoOption);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting default repository option", error = ex.Message });
            }
        }
    }
}