using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using Security;
using Microsoft.AspNetCore.Cors;
using System.Net;

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
    public class AltinnTT02Controller : AltinnBaseController<AltinnTT02Controller>
    {
        public AltinnTT02Controller(IAltinnApiService altinnApiService, ILogger<AltinnTT02Controller> logger) : base(altinnApiService, "TT02", logger)
        {
        }

    }

    [ApiController]
    [Route("api/Production/serviceowner")]
    public class AltinnProductionController : AltinnBaseController<AltinnProductionController>
    {
        public AltinnProductionController(IAltinnApiService altinnApiService, ILogger<AltinnProductionController> logger) : base(altinnApiService, "Production", logger)
        {
        }
    }



    //Made controller abstract to be able to authorize on different environments
    [Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
    [ApiController]
    public abstract class AltinnBaseController<T> : ControllerBase
    {
        protected readonly IAltinnApiService _altinnApiService;
        protected string environmentName;
        private ILogger<T> _logger;

        public AltinnBaseController(IAltinnApiService altinnApiService, string environmentName, ILogger<T> logger)
        {
            _logger = logger;
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

        [HttpGet("organizations/altinn3/personalcontacts/org/{orgnumber}")]
        public async Task<IActionResult> GetPersonalContactsAltinn3([FromRoute] string orgnumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgnumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }
            var result = await _altinnApiService.GetPersonalContactsByOrgAltinn3(orgnumber, environmentName);

            return Ok(result);

        }

        [HttpGet("organizations/altinn3/personalcontacts/email/{email}")]
        public async Task<IActionResult> GetPersonalContactsByEmailAltinn3([FromRoute] string email)
        {
            try
            {
                if (!ValidationService.IsValidEmail(email))
                {
                    return BadRequest("Email is Invalid");
                }
                var result = await _altinnApiService.GetPersonalContactsByEmailAltinn3(email, environmentName);

                return Ok(result);
            }
            catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return NotFound();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Personal contacts failed for email {email} with status {statuscode}", email, ex.StatusCode);
                return StatusCode(502, "upstream service failure");
            }
        }

        [HttpGet("organizations/altinn3/personalcontacts/phonenumber/{phonenumber}")]
        public async Task<IActionResult> GetPersonalContactsByPhoneAltinn3([FromRoute] string phonenumber)
        {
            if (!ValidationService.IsValidPhoneNumber(phonenumber))
            {
                return BadRequest("Phone number is Invalid");
            }
            var result = await _altinnApiService.GetPersonalContactsByPhoneAltinn3(phonenumber, environmentName);

            return Ok(result);


        }

        [HttpGet("organizations/{orgNumber}/altinn3/notificationaddresses")]
        public async Task<IActionResult> GetNotificationAddressesByOrg([FromRoute] string orgnumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgnumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }
            var result = await _altinnApiService.GetNotificationAddressesByOrgAltinn3(orgnumber, environmentName);

            return Ok(result);
        }

        [HttpGet("organizations/altinn3/notificationaddresses/phonenumber/{phonenumber}")]
        public async Task<IActionResult> GetNotificationAddressesByPhone([FromRoute] string phonenumber)
        {
            if (!ValidationService.IsValidPhoneNumber(phonenumber))
            {
                return BadRequest("Phonenumber not valid");
            }
            var result = await _altinnApiService.GetNotificationAddressesByPhoneAltinn3(phonenumber, environmentName);

            return Ok(result);
        }

        [HttpGet("organizations/altinn3/notificationaddresses/email/{email}")]
        public async Task<IActionResult> GetNotificationAddressesByEmail([FromRoute] string email)
        {
            if (!ValidationService.IsValidEmail(email))
            {
                return BadRequest("Email not valid");
            }
            var result = await _altinnApiService.GetNotificationAddressesByEmailAltinn3(email, environmentName);

            return Ok(result);
        }
    }
}
