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

        [HttpGet("{phoneNumber}")]
        public async Task<IActionResult> GetInfobyPhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrEmpty(phoneNumber))
            {
                return BadRequest("Telefonnummeret er ugyldig. Det må være 8 sifre langt.");
            }

            try
            {
                var organizationInfo = await _altinnApiClient.GetOrganizationInfoByPhonenumber(phoneNumber);
                return Ok(organizationInfo);
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains("BadRequest"))
                {
                    return BadRequest("Feil ved forespørsel: Telefonnummeret er ugyldig eller forespørselen er feil formatert.");
                }
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }

        // Helper method to validate the organization number format

    }
}
