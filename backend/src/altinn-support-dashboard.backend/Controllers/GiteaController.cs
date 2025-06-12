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
        [HttpPost("organizations")]
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
                    request.Username,
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
    }
}