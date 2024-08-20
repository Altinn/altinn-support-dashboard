using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
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





        [HttpGet("emails/{email}")]
        public async Task<IActionResult> GetOrganizationsByEmail(string email)
        {
            if (string.IsNullOrEmpty(email) || !IsValidEmail(email))
            {
                return BadRequest("E-postadressen er ugyldig.");
            }

            try
            {
                var organizations = await _altinnApiClient.GetOrganizationsByEmail(email);
                return Ok(organizations);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }

        // Helper method to validate the organization number format
        private bool IsValidOrgNumber(string orgNumber)
        {
            // Norwegian organization numbers are typically 9 digits
            return Regex.IsMatch(orgNumber, @"^\d{9}$");
        }

        // Helper method to validate email format
        private bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }
    }
}
