using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Security;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Compliance.Redaction;
using Models.altinn3Dtos;

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
    [Authorize(AnsattportenConstants.AnsattportenTT02AuthorizationPolicy)]
    [Route("api/TT02/serviceowner")]
    public class AltinnTT02Controller : AltinnBaseController
    {
        public AltinnTT02Controller(IAltinnApiService altinnApiService, IAltinn3Service altinn3Service, ISsnTokenService ssnTokenService) : base(altinnApiService, altinn3Service, "TT02", ssnTokenService)
        {
        }

    }

    [ApiController]

    [Authorize(AnsattportenConstants.AnsattportenProductionAuthorizationPolicy)]
    [Route("api/Production/serviceowner")]
    public class AltinnProductionController : AltinnBaseController
    {
        public AltinnProductionController(IAltinnApiService altinnApiService, IAltinn3Service altinn3Service, ISsnTokenService ssnTokenService) : base(altinnApiService, altinn3Service, "Production", ssnTokenService)
        {
        }
    }



    //Made controller abstract to be able to authorize on different environments
    [Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
    [ApiController]
    public abstract class AltinnBaseController : ControllerBase
    {
        protected readonly IAltinnApiService _altinnApiService;
        protected readonly IAltinn3Service _altinn3Service;
        protected string environmentName;
        protected readonly ISsnTokenService _ssnTokenService;

        public AltinnBaseController(IAltinnApiService altinnApiService, IAltinn3Service altinn3Service, string environmentName, ISsnTokenService ssnTokenService)
        {
            _altinn3Service = altinn3Service;
            this.environmentName = environmentName;
            _altinnApiService = altinnApiService;
            _ssnTokenService = ssnTokenService;
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

        [HttpGet("organizations/altinn3/search")]
        public async Task<IActionResult> SearchAltinn3([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Søketerm kan ikke være tom.");
            }

            if (ValidationService.IsValidEmail(query))
            {
                return await GetOrganizationsFromEmailAltinn3(query);
            }
            if (ValidationService.IsValidOrgNumber(query))
            {
                return await GetOrganizationAltinn3(query);
            }

            if (ValidationService.IsValidPhoneNumber(query))
            {
                return await GetOrganizationsFromPhoneAltinn3(query);
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

        [HttpGet("organizations/altinn3/organizations/{orgnumber}")]
        public async Task<IActionResult> GetOrganizationAltinn3([FromRoute] string orgnumber)
        {

            var result = await _altinn3Service.GetOrganizationByOrgNoAltinn3(orgnumber, environmentName);
            return Ok(result);

        }

        [HttpPost("organizations/altinn3/organizations")]
        public async Task<IActionResult> GetOrganizationsInfoAltinn3([FromBody] OrgNumbersRequestDto orgnumbers)
        {
            var data = orgnumbers.OrgNumbers;

            var result = await _altinn3Service.GetPartyNamesByOrgAltinn3(data, environmentName);
            return Ok(result);
        }


        [HttpGet("organizations/altinn3/organizations/phonenumber/{phonenumber}")]
        public async Task<IActionResult> GetOrganizationsFromPhoneAltinn3([FromRoute] string phonenumber)
        {
            if (!ValidationService.IsValidPhoneNumber(phonenumber))
            {
                return BadRequest("phonenumber is invalid");
            }
            var result = await _altinn3Service.GetOrganizationsByPhoneAltinn3(phonenumber, environmentName);

            return Ok(result);
        }


        [HttpGet("organizations/altinn3/organizations/email/{email}")]
        public async Task<IActionResult> GetOrganizationsFromEmailAltinn3([FromRoute] string email)
        {
            if (!ValidationService.IsValidEmail(email))
            {
                return BadRequest("Email is invalid");
            }
            var result = await _altinn3Service.GetOrganizationsByEmailAltinn3(email, environmentName);

            return Ok(result);
        }


        [HttpGet("organizations/altinn3/personalcontacts/org/{orgnumber}")]
        public async Task<IActionResult> GetPersonalContactsAltinn3([FromRoute] string orgnumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgnumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }
            var result = await _altinn3Service.GetPersonalContactsByOrgAltinn3(orgnumber, environmentName);

            return Ok(result);

        }

        [HttpGet("organizations/altinn3/personalcontacts/email/{email}")]
        public async Task<IActionResult> GetPersonalContactsByEmailAltinn3([FromRoute] string email)
        {
            if (!ValidationService.IsValidEmail(email))
            {
                return BadRequest("Email is Invalid");
            }
            var result = await _altinn3Service.GetPersonalContactsByEmailAltinn3(email, environmentName);

            return Ok(result);


        }

        [HttpGet("organizations/altinn3/personalcontacts/phonenumber/{phonenumber}")]
        public async Task<IActionResult> GetPersonalContactsByPhoneAltinn3([FromRoute] string phonenumber)
        {
            if (!ValidationService.IsValidPhoneNumber(phonenumber))
            {
                return BadRequest("Phone number is Invalid");
            }
            var result = await _altinn3Service.GetPersonalContactsByPhoneAltinn3(phonenumber, environmentName);

            return Ok(result);

        }

        [HttpGet("organizations/{orgNumber}/altinn3/notificationaddresses")]
        public async Task<IActionResult> GetNotificationAddressesByOrg([FromRoute] string orgnumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgnumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }
            var result = await _altinn3Service.GetNotificationAddressesByOrgAltinn3(orgnumber, environmentName);

            return Ok(result);
        }

        [HttpGet("organizations/altinn3/notificationaddresses/phonenumber/{phonenumber}")]
        public async Task<IActionResult> GetNotificationAddressesByPhone([FromRoute] string phonenumber)
        {
            if (!ValidationService.IsValidPhoneNumber(phonenumber))
            {
                return BadRequest("Phonenumber not valid");
            }
            var result = await _altinn3Service.GetNotificationAddressesByPhoneAltinn3(phonenumber, environmentName);

            return Ok(result);
        }

        [HttpGet("organizations/altinn3/notificationaddresses/email/{email}")]
        public async Task<IActionResult> GetNotificationAddressesByEmail([FromRoute] string email)
        {
            if (!ValidationService.IsValidEmail(email))
            {
                return BadRequest("Email not valid");
            }
            var result = await _altinn3Service.GetNotificationAddressesByEmailAltinn3(email, environmentName);

            return Ok(result);
        }

        [HttpGet("personalcontacts/{ssnToken}/ssn")]
        public IActionResult GetSsnFromToken(string ssnToken)
        {
            var ssn = _ssnTokenService.GetSsnFromToken(ssnToken);
            if (string.IsNullOrEmpty(ssn))
            {
                throw new Exception("Invalid or expired SSN token.");
            }
            return Ok(new { socialSecurityNumber = ssn });
        }

        [HttpPost("organizations/altinn3/roles")]
        public async Task<IActionResult> PostRolesAndRightsAltinn3([FromBody] RolesAndRightsRequest request)
        {
            var result = await _altinn3Service.GetRolesAndRightsAltinn3(request, environmentName);

            return Ok(result);
        }

        [HttpGet("resourceRegistry/{resourceId}")]
        public async Task<IActionResult> GetResourceDetailsFromRegistry([FromRoute] string resourceId)
        {
            var result = await _altinn3Service.GetResourceDetailsFromRegistry(resourceId, environmentName);
            return Ok(result);
        }
    }
}
