using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AltinnSupportDashboard.Controllers
{
    [ApiController]
    [Route("api/gitea")]
    public class GiteaController : ControllerBase
    {
        private readonly GiteaApiClient _giteaApiClient;

        public GiteaController(GiteaApiClient giteaApiClient)
        {
            _giteaApiClient = giteaApiClient;
        }

        /// <summary>
        /// Tests if a Personal Access Token (PAT) is valid for the specified Gitea instance
        /// </summary>
        /// <param name="request">Contains the PAT token and Gitea base URL</param>
        /// <returns>User information if token is valid, otherwise unauthorized</returns>
        [HttpPost("test-pat")]
        public async Task<IActionResult> TestPatToken([FromBody] PatTokenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.PatToken) || string.IsNullOrWhiteSpace(request.GiteaBaseUrl))
            {
                return BadRequest("PAT token and Gitea base URL are required.");
            }

            var userInfo = await _giteaApiClient.GetCurrentUserAsync(request.PatToken, request.GiteaBaseUrl);
            if (userInfo == null)
            {
                return Unauthorized("Invalid PAT token or Gitea instance.");
            }

            return Ok(userInfo);
        }
    }

    /// <summary>
    /// Request model for validating a Personal Access Token
    /// </summary>
    public class PatTokenRequest
    {
        /// <summary>
        /// Personal Access Token for authentication
        /// </summary>
        public string PatToken { get; set; }
        
        /// <summary>
        /// Base URL of the Gitea instance including /repos/ path
        /// </summary>
        public string GiteaBaseUrl { get; set; } = "https://dev.altinn.studio/repos";
    }
}