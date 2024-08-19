using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AltinnSupportDashboard.Controllers
{
    [ApiController]
    [Route("api/serviceowner/organizations")]
    public class AltinnController : ControllerBase
    {
        private readonly AltinnApiClient _altinnApiClient;

        public AltinnController(AltinnApiClient altinnApiClient)
        {
            _altinnApiClient = altinnApiClient;
        }

        [HttpGet("{orgNumber}")]
        public async Task<IActionResult> GetOrganizationInfo(string orgNumber)
        {
            if (string.IsNullOrEmpty(orgNumber))
            {
                return BadRequest("Organization number cannot be null or empty.");
            }

            try
            {
                var organizationInfo = await _altinnApiClient.GetOrganizationInfo(orgNumber);
                return Ok(organizationInfo);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
