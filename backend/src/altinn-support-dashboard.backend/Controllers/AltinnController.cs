using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AltinnSupportDashboard.Controllers
{
    [ApiController]
    [Route("api/serviceowner/organizations")]
    public class Altinn_Intern_APIController : ControllerBase
    {
        private readonly AltinnApiClient _altinnApiClient;

        public Altinn_Intern_APIController(AltinnApiClient altinnApiClient)
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

        [HttpGet("phonenumbers/{phoneNumber}")]
        public async Task<IActionResult> GetOrganizationsByPhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrEmpty(phoneNumber))
            {
                return BadRequest("Telefonnummeret er ugyldig. Det kan ikke være tomt.");
            }

            try
            {
                var organizations = await _altinnApiClient.GetOrganizationsByPhoneNumber(phoneNumber);
                return Ok(organizations);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
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
