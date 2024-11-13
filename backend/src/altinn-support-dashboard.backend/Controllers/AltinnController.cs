using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;

namespace AltinnSupportDashboard.Controllers
{
    [Authorize] // Securing the entire controller
    [ApiController]
    [Route("api/{environmentName}")]
    public class HealthController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult Health([FromRoute] string environmentName)
        {
            return Ok($"API is running in {environmentName} environment.");
        }
    }

    [Authorize] // Securing the entire controller
    [ApiController]
    [Route("api/{environmentName}/serviceowner/organizations")]
    public class Altinn_Intern_APIController : ControllerBase
    {
        private readonly IAltinnApiService _altinnApiService;

        public Altinn_Intern_APIController(IAltinnApiService altinnApiService)
        {
            _altinnApiService = altinnApiService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromRoute] string environmentName, string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Søketerm kan ikke være tom.");
            }

            if (ValidationService.IsValidEmail(query))
            {
                return await GetOrganizationsByEmail(environmentName, query);
            }
            if (ValidationService.IsValidOrgNumber(query))
            {
                return await GetOrganizationInfo(environmentName, query);
            }

            if (ValidationService.IsValidPhoneNumber(query))
            {
                return await GetOrganizationsByPhoneNumber(environmentName, query);
            }

            return BadRequest("Ugyldig søketerm. Angi et gyldig organisasjonsnummer, telefonnummer eller e-postadresse.");
        }

        [HttpGet("{orgNumber}")]
        public async Task<IActionResult> GetOrganizationInfo([FromRoute] string environmentName, string orgNumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            try
            {
                var organizationInfo = await _altinnApiService.GetOrganizationInfo(orgNumber, environmentName);
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
        public async Task<IActionResult> GetOrganizationsByPhoneNumber([FromRoute] string environmentName, string phoneNumber)
        {
            if (!ValidationService.IsValidPhoneNumber(phoneNumber))
            {
                return BadRequest("Telefonnummeret er ugyldig. Det kan ikke være tomt.");
            }

            try
            {
                var organizations = await _altinnApiService.GetOrganizationsByPhoneNumber(phoneNumber, environmentName);
                return Ok(organizations);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }

        [HttpGet("emails/{email}")]
        public async Task<IActionResult> GetOrganizationsByEmail([FromRoute] string environmentName, string email)
        {
            if (!ValidationService.IsValidEmail(email))
            {
                return BadRequest("E-postadressen er ugyldig.");
            }

            try
            {
                var organizations = await _altinnApiService.GetOrganizationsByEmail(email, environmentName);
                return Ok(organizations);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }

        [HttpGet("{orgNumber}/personalcontacts")]
        public async Task<IActionResult> GetPersonalContacts([FromRoute] string environmentName, string orgNumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            try
            {
                var personalContacts = await _altinnApiService.GetPersonalContacts(orgNumber, environmentName);
                return Ok(personalContacts);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }

        [HttpGet("/api/{environmentName}/serviceowner/{subject}/roles/{reportee}")]
        public async Task<IActionResult> GetPersonRoles([FromRoute] string environmentName, string subject, string reportee)
        {
            if (!ValidationService.IsValidSubjectOrReportee(subject) || !ValidationService.IsValidSubjectOrReportee(reportee))
            {
                return BadRequest("Subject eller reportee er ugyldig.");
            }

            try
            {
                var roles = await _altinnApiService.GetPersonRoles(subject, reportee, environmentName);
                return Ok(roles);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }
    }
}
