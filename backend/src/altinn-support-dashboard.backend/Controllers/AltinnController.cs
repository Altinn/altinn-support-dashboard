using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;

namespace AltinnSupportDashboard.Controllers
{
    [ApiController]
    [Route("api/serviceowner/organizations")]
    public class Altinn_Intern_APIController : ControllerBase
    {
        private readonly IAltinnApiService _altinnApiService;

        public Altinn_Intern_APIController(IAltinnApiService altinnApiService)
        {
            _altinnApiService = altinnApiService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Søketerm kan ikke være tom.");
            }

            if (ValidationService.IsValidEmail(query))
            {
                return await GetOrganizationsByEmail(query);
            }
            if (ValidationService.IsValidOrgNumber(query))
            {
                return await GetOrganizationInfo(query);
            }
            else if (ValidationService.IsValidPhoneNumber(query))
            {
                return await GetOrganizationsByPhoneNumber(query);
            }

            else
            {
                return BadRequest("Ugyldig søketerm. Angi et gyldig organisasjonsnummer, telefonnummer eller e-postadresse.");
            }
        }

        [HttpGet("{orgNumber}")]
        public async Task<IActionResult> GetOrganizationInfo(string orgNumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            try
            {
                var organizationInfo = await _altinnApiService.GetOrganizationInfo(orgNumber);
                if (organizationInfo == null)
                {
                    return NotFound("Ingen data funnet for det angitte organisasjonsnummeret.");
                }
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
            if (!ValidationService.IsValidPhoneNumber(phoneNumber))
            {
                return BadRequest("Telefonnummeret er ugyldig. Det kan ikke være tomt.");
            }

            try
            {
                var organizations = await _altinnApiService.GetOrganizationsByPhoneNumber(phoneNumber);
                if (organizations == null || !organizations.Any())
                {
                    return NotFound("Ingen data funnet for det angitte telefonnummeret.");
                }
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
            if (!ValidationService.IsValidEmail(email))
            {
                return BadRequest("E-postadressen er ugyldig.");
            }

            try
            {
                var organizations = await _altinnApiService.GetOrganizationsByEmail(email);
                if (organizations == null || !organizations.Any())
                {
                    return NotFound("Ingen data funnet for den angitte e-postadressen.");
                }
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
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            try
            {
                var personalContacts = await _altinnApiService.GetPersonalContacts(orgNumber);
                if (personalContacts == null || !personalContacts.Any())
                {
                    return NotFound("Ingen data funnet for det angitte organisasjonsnummeret.");
                }
                return Ok(personalContacts);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }

        [HttpGet("/api/serviceowner/{subject}/roles/{reportee}")]
        public async Task<IActionResult> GetPersonRoles(string subject, string reportee)
        {
            if (!ValidationService.IsValidSubjectOrReportee(subject) || !ValidationService.IsValidSubjectOrReportee(reportee))
            {
                return BadRequest("Subject eller reportee er ugyldig.");
            }

            try
            {
                var roles = await _altinnApiService.GetPersonRoles(subject, reportee);
                return Ok(roles);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }

    }
}
