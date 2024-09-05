using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Services;

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

        [HttpGet("search")]
        public async Task<IActionResult> Search(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Søketerm kan ikke være tom.");
            }

            if (ValidationService.IsValidOrgNumber(query))
            {
                return await GetOrganizationInfo(query);
            }
            else if (ValidationService.IsValidPhoneNumber(query))
            {
                return await GetOrganizationsByPhoneNumber(query);
            }
            else if (ValidationService.IsValidEmail(query))
            {
                return await GetOrganizationsByEmail(query);
            }
            else
            {
                return BadRequest("Ugyldig søketerm. Angi et gyldig organisasjonsnummer, telefonnummer eller e-postadresse.");
            }
        }

        [HttpGet("{orgNumber}")]
        public async Task<IActionResult> GetOrganizationInfo(string orgNumber)
        {
            if (string.IsNullOrEmpty(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
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
            if (string.IsNullOrEmpty(email) || !ValidationService.IsValidEmail(email))
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

        [HttpGet("{orgNumber}/personalcontacts")]
        public async Task<IActionResult> GetPersonalContacts(string orgNumber)
        {
            if (string.IsNullOrEmpty(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            try
            {
                var personalContacts = await _altinnApiClient.GetPersonalContacts(orgNumber);
                return Ok(personalContacts);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }

    }
}
