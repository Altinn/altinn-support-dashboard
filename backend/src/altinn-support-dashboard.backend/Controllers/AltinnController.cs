using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using Security;
using Microsoft.AspNetCore.Cors;

namespace AltinnSupportDashboard.Controllers
{

    [Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
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


    [ApiController]
    [Route("api/TT02/serviceowner")]
    public class AltinnTT02Controller : AltinnBaseController
    {
        public AltinnTT02Controller(IAltinnApiService altinnApiService) : base(altinnApiService, "TT02")
        {
        }
    }

    [ApiController]
    [Route("api/Production/serviceowner")]
    public class AltinnProductionController : AltinnBaseController
    {
        public AltinnProductionController(IAltinnApiService altinnApiService) : base(altinnApiService, "Production")
        {
        }
    }



    //Made controller abstract to be able to authorize on different environments
    [Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
    [ApiController]
    public abstract class AltinnBaseController : ControllerBase
    {
        private readonly IAltinnApiService _altinnApiService;
        protected string environmentName;

        public AltinnBaseController(IAltinnApiService altinnApiService, string environmentName)
        {
            this.environmentName = environmentName;
            _altinnApiService = altinnApiService;
        }

        [HttpGet("organizations/search")]
        public async Task<IActionResult> Search([FromQuery] string query)
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

            if (ValidationService.IsValidPhoneNumber(query))
            {
                return await GetOrganizationsByPhoneNumber(query);
            }

            return BadRequest("Ugyldig søketerm. Angi et gyldig organisasjonsnummer, telefonnummer eller e-postadresse.");
        }

        [HttpGet("organizations/{orgNumber}")]
        public async Task<IActionResult> GetOrganizationInfo([FromRoute] string orgNumber)
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

        [HttpGet("organizations/phonenumbers/{phoneNumber}")]
        public async Task<IActionResult> GetOrganizationsByPhoneNumber([FromRoute] string phoneNumber)
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

        [HttpGet("organizations/emails/{email}")]
        public async Task<IActionResult> GetOrganizationsByEmail([FromRoute] string email)
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

        [HttpGet("organizations/{orgNumber}/personalcontacts")]
        public async Task<IActionResult> GetPersonalContacts([FromRoute] string orgNumber)
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

        [HttpGet("{subject}/roles/{reportee}")]
        public async Task<IActionResult> GetPersonRoles([FromRoute] string subject, [FromRoute] string reportee)
        {
            Console.WriteLine(subject);
            Console.WriteLine(reportee);
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

        [HttpGet("organizations/{orgNumber}/officialcontacts")]
        public async Task<IActionResult> GetOfficialContacts([FromRoute] string orgNumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            try
            {
                var officialcontacts = await _altinnApiService.GetOfficialContacts(orgNumber, environmentName);
                return Ok(officialcontacts);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Intern serverfeil: {ex.Message}");
            }
        }
    }
}
