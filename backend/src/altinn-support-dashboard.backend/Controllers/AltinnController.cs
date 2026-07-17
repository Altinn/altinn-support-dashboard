using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Security;
using Microsoft.Extensions.Compliance.Redaction;
using Models.altinn3Dtos;

namespace AltinnSupportDashboard.Controllers
{

    [Authorize(AzureRoles.Authenticated)]
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
    [Authorize(AzureRoles.Authenticated)]
    [Route("api/mock/serviceowner")]
    public class AltinnMockController : AltinnBaseController
    {
        public AltinnMockController(IAltinn3Service altinn3Service, ISsnTokenService ssnTokenService, ITelemetryService telemetryService, IConfiguration configuration) : base(altinn3Service, "mock", ssnTokenService, telemetryService, configuration)
        {
        }
    }

    [ApiController]
    [Authorize(AzureRoles.TT02)]
    [Route("api/TT02/serviceowner")]
    public class AltinnTT02Controller : AltinnBaseController
    {
        public AltinnTT02Controller(IAltinn3Service altinn3Service, ISsnTokenService ssnTokenService, ITelemetryService telemetryService, IConfiguration configuration) : base(altinn3Service, "TT02", ssnTokenService, telemetryService, configuration)
        {
        }

    }

    [ApiController]
    [Authorize(AzureRoles.Production)]
    [Route("api/Production/serviceowner")]
    public class AltinnProductionController : AltinnBaseController
    {
        public AltinnProductionController(IAltinn3Service altinn3Service, ISsnTokenService ssnTokenService, ITelemetryService telemetryService, IConfiguration configuration) : base(altinn3Service, "Production", ssnTokenService, telemetryService, configuration)
        {
        }
    }



    //Made controller abstract to be able to authorize on different environments
    [Authorize(AzureRoles.Authenticated)]
    [ApiController]
    public abstract class AltinnBaseController : ControllerBase
    {
        protected readonly IAltinn3Service _altinn3Service;
        protected string environmentName;
        protected readonly ISsnTokenService _ssnTokenService;
        protected readonly ITelemetryService _telemetryService;
        private readonly IConfiguration _configuration;

        public AltinnBaseController(IAltinn3Service altinn3Service, string environmentName, ISsnTokenService ssnTokenService, ITelemetryService telemetryService, IConfiguration configuration)
        {
            _altinn3Service = altinn3Service;
            this.environmentName = environmentName;
            _ssnTokenService = ssnTokenService;
            _telemetryService = telemetryService;
            _configuration = configuration;
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


        [HttpGet("organizations/altinn3/organizations/{orgnumber}")]
        public async Task<IActionResult> GetOrganizationAltinn3([FromRoute] string orgnumber)
        {

            var result = await _altinn3Service.GetOrganizationByOrgNoAltinn3(orgnumber, environmentName);
            return Ok(result);

        }

        [HttpPost("organizations/altinn3/organizations")]
        public async Task<IActionResult> GetOrganizationsAltinn3([FromBody] OrgNumbersRequestDto orgnumbers)
        {
            var data = orgnumbers.OrgNumbers;

            var result = await _altinn3Service.GetOrganizationsByOrgNumbers(data, environmentName);
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

        [HttpGet("users/altinn3/contactinformation/{nin}")]
        public async Task<IActionResult> GetUserContactInformationByNinAltinn3([FromRoute] string nin)
        {
            if (!ValidationService.isValidSsn(nin))
            {
                return BadRequest("The National Identity Number is not valid. It must contain exactly 11 digits");
            }
            var result = await _altinn3Service.GetUserContactInformationByNinAltinn3(nin, environmentName);

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

            var trackedEnvironments = _configuration.GetSection("LoggingConfiguration:TrackedEnvironments").Get<string[]>() ?? ["Production"];
            if (trackedEnvironments.Contains(environmentName))
            {
                _telemetryService.TrackSsnUnmasked(
                    User.Identity?.Name ?? "unknown",
                    environmentName,
                    ssn
                );
            }

            return Ok(new { socialSecurityNumber = ssn });
        }

        [HttpPost("organizations/altinn3/roles")]
        public async Task<IActionResult> PostRolesAndRightsAltinn3([FromBody] RolesAndRightsRequest request)
        {
            var result = await _altinn3Service.GetRolesAndRightsAltinn3(request, null, environmentName);

            return Ok(result);
        }

        [HttpPost("organizations/altinn3/identifiers")]
        public async Task<IActionResult> PostOrganizationsIdentifiers([FromBody] OrgNumbersRequestDto request)
        {
            var result = await _altinn3Service.GetOrganizationsIdentifiers(request.OrgNumbers, environmentName);
            return Ok(result);
        }

        [HttpPost("organizations/altinn3/partyinfo")]
        public async Task<IActionResult> PostOrganizationsPartyInfo([FromBody] OrgPartyInfoRequest partyIds)
        {
            var result = await _altinn3Service.GetOrganizationspartyInfo(partyIds.PartyIds, environmentName);
            return Ok(result);
        }

        [HttpGet("rolesList")]
        public async Task<IActionResult> GetAltinn2RolesList()
        {
            var result = await _altinn3Service.GetAltinn2RolesList(environmentName);
            return Ok(result);
        }

        [HttpGet("maskinporten/delegations")]
        public async Task<IActionResult> GetMaskinportenDelegations([FromQuery] string? supplierOrg, [FromQuery] string? consumerOrg, [FromQuery] string? scope)
        {
            var result = await _altinn3Service.GetMaskinportenDelegations(supplierOrg, consumerOrg, scope, environmentName);
            return Ok(result);
        }
    }
}
