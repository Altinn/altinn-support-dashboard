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

        [HttpGet("{orgNumber}")]
        public async Task<IActionResult> GetOrganizationInfo(string orgNumber)
        {
            if (string.IsNullOrEmpty(orgNumber) || !IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            try
            {
                var organizationInfo = await _altinnApiClient.GetOrganizationInfo(orgNumber);
                return Ok(organizationInfo);
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains("BadRequest"))
                {
                    return BadRequest("Feil ved forespørsel: Organisasjonsnummeret er ugyldig eller forespørselen er feil formatert.");
                }
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }

        // Helper method to validate the organization number format
        private bool IsValidOrgNumber(string orgNumber)
        {
            // Norwegian organization numbers are typically 9 digits
            return Regex.IsMatch(orgNumber, @"^\d{9}$");
        }
    }
}
