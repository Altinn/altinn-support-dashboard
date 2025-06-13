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
    [Route("api/gitea")]
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
        /// Tests if a Personal Access Token (PAT) is valid for the specified Gitea instance
        /// </summary>
        /// <param name="request">Contains the PAT token and Gitea base URL</param>
        /// <returns>User information if token is valid, otherwise unauthorized</returns>
        [HttpPost("test-pat")]
        public async Task<IActionResult> TestPatToken([FromBody] PatTokenRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(request.PatToken) || string.IsNullOrWhiteSpace(request.GiteaBaseUrl))
            {
                return BadRequest("PAT token and Gitea base URL are required.");
            }
            
            try
            {
                var userInfo = await _giteaService.TestPatTokenAsync(request.PatToken, request.GiteaBaseUrl);
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
        /// <param name="request">Contains organization details and authentication</param>
        /// <returns>Result of organization creation process</returns>
        [HttpPost("create/orgwithteams")]
        public async Task<IActionResult> CreateOrganization([FromBody] CreateOrganizationRequestModel request)
        {
            // Validate basic inputs
            if (string.IsNullOrWhiteSpace(request.PatToken) || string.IsNullOrWhiteSpace(request.GiteaBaseUrl))
            {
                return BadRequest("PAT token and Gitea base URL are required.");
            }
            
            try
            {
                var (success, message, results) = await _giteaService.CreateOrganizationWithDefaultsAsync(
                    request.PatToken,
                    request.GiteaBaseUrl,
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
        /// <param name="orgName">Organization name</param>
        /// <param name="request">Team creation request with options</param>
        /// <returns>Result of team creation process</returns>
        [HttpPost("organizations/{orgName}/teams")]
        public async Task<IActionResult> CreateTeam([FromRoute] string orgName, [FromBody] TeamRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(orgName))
            {
                return BadRequest("Organization name is required.");
            }
            
            if (string.IsNullOrWhiteSpace(request.PatToken) || string.IsNullOrWhiteSpace(request.GiteaBaseUrl))
            {
                return BadRequest("PAT token and Gitea base URL are required.");
            }
            
            if (request.TeamOption == null || string.IsNullOrWhiteSpace(request.TeamOption.Name))
            {
                return BadRequest("Team name is required.");
            }
            
            try
            {
                var (success, message, result) = await _giteaService.CreateTeamAsync(
                    request.PatToken,
                    request.GiteaBaseUrl,
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
        /// <param name="orgName">Organization name</param>
        /// <param name="request">Authentication details</param>
        /// <returns>Result of team creation process</returns>
        [HttpPost("organizations/{orgName}/default-teams")]
        public async Task<IActionResult> CreateDefaultTeams([FromRoute] string orgName, [FromBody] PatTokenRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(orgName))
            {
                return BadRequest("Organization name is required.");
            }
            
            if (string.IsNullOrWhiteSpace(request.PatToken) || string.IsNullOrWhiteSpace(request.GiteaBaseUrl))
            {
                return BadRequest("PAT token and Gitea base URL are required.");
            }
            
            try
            {
                var (success, message, results) = await _giteaService.CreateDefaultTeamsAsync(
                    request.PatToken,
                    request.GiteaBaseUrl,
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
        /// <param name="orgName">Organization name</param>
        /// <param name="request">Repository creation request with options</param>
        /// <returns>Result of repository creation process</returns>
        [HttpPost("organizations/{orgName}/repositories")]
        public async Task<IActionResult> CreateRepository([FromRoute] string orgName, [FromBody] RepositoryRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(orgName))
            {
                return BadRequest("Organization name is required.");
            }
            
            if (string.IsNullOrWhiteSpace(request.PatToken) || string.IsNullOrWhiteSpace(request.GiteaBaseUrl))
            {
                return BadRequest("PAT token and Gitea base URL are required.");
            }
            
            if (request.RepositoryOption == null || string.IsNullOrWhiteSpace(request.RepositoryOption.Name))
            {
                return BadRequest("Repository name is required.");
            }
            
            try
            {
                var (success, message, result) = await _giteaService.CreateRepositoryAsync(
                    request.PatToken,
                    request.GiteaBaseUrl,
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