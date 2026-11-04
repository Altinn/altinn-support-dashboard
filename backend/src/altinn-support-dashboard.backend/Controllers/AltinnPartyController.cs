
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;
using altinn_support_dashboard.Server.Services;

namespace altinn_support_dashboard.Server.Controllers
{
    [ApiController]
    [Route("api/{environmentName}")]
    [Authorize(AzurePolicies.Authenticated)]
    [Authorize(AzureRoles.Developer)]
    [Authorize(AzurePolicies.EnvironmentAccess)]
    public class AltinnPartyController : ControllerBase
    {
        private readonly IPartyApiService _service;
        private readonly ITelemetryService _telemetryService;

        public AltinnPartyController(IPartyApiService service, ITelemetryService telemetryService)
        {
            _service = service;
            _telemetryService = telemetryService;
        }

        private string CurrentUserId => User.Identity?.Name ?? "unknown";

        [HttpGet("parties/lookup/org/{orgNumber}")]
        public async Task<IActionResult> GetPartyOrg([FromRoute] string environmentName, [FromRoute] string orgNumber)
        {
            _telemetryService.TrackPartyOrgLookup(orgNumber, CurrentUserId, environmentName);

            var result = await _service.GetPartyFromOrgAsync(orgNumber, environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/lookup/ssn")]
        public async Task<IActionResult> GetPartySsn([FromRoute] string environmentName, [FromHeader] string socialSecurityNumber)
        {
            if(!ValidationService.isValidSsn(socialSecurityNumber))
            {
                return BadRequest("The Social Security Number is not valid. It must contain exactly 11 digits");
            }
            _telemetryService.TrackPartySsnLookup(socialSecurityNumber, CurrentUserId, environmentName);

            var result = await _service.GetPartyFromSsnAsync(socialSecurityNumber, environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/roles/uuid/{Uuid}")]
        public async Task<IActionResult> GetPartyRoles([FromRoute] string environmentName, [FromRoute] string Uuid)
        {
            var result = await _service.GetRolesFromPartyAsync(Uuid, environmentName);
            return Ok(result);
        }

        [HttpGet("parties/roles/org/{orgNumber}")]
        public async Task<IActionResult> GetRolesFromOrg([FromRoute] string environmentName, [FromRoute] string orgNumber)
        {
            var result = await _service.GetRolesFromOrgAsync(orgNumber, environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/lookup/uuid/{Uuid}")]
        public async Task<IActionResult> GetPartyByUuid([FromRoute] string environmentName, [FromRoute] string Uuid)
        {
            _telemetryService.TrackPartyUuidLookup(Uuid, CurrentUserId, environmentName);
            var result = await _service.GetPartyByUuidAsync(Uuid, environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/lookup/partyId/{partyId}")]
        public async Task<IActionResult> GetPartyByPartyId([FromRoute] string environmentName, [FromRoute] string partyId)
        {
            _telemetryService.TrackPartyIdLookup(partyId, CurrentUserId, environmentName);
            var result = await _service.GetPartyByIdAsync(partyId, environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/lookup")]
        public async Task<IActionResult> GetPartyByValue([FromRoute] string environmentName, [FromHeader] string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return BadRequest("Value cannot be empty.");
            }

            if (ValidationService.IsValidGuid(value))
            {
                _telemetryService.TrackPartyUuidLookup(value, CurrentUserId, environmentName);
                var result = await _service.GetPartyByUuidAsync(value, environmentName);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }

            if (ValidationService.isValidSsn(value))
            {
                _telemetryService.TrackPartySsnLookup(value, CurrentUserId, environmentName);
                var result = await _service.GetPartyFromSsnAsync(value, environmentName);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }

            if (ValidationService.IsValidOrgNumberV2(value))
            {
                _telemetryService.TrackPartyOrgLookup(value, CurrentUserId, environmentName);
                var result = await _service.GetPartyFromOrgAsync(value, environmentName);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }

            if (ValidationService.IsValidPartyId(value))
            {
                _telemetryService.TrackPartyIdLookup(value, CurrentUserId, environmentName);
                var result = await _service.GetPartyByIdAsync(value, environmentName);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }

            return BadRequest("Value is not a valid SSN, organization number, party ID, or party UUID.");
        }
    }
}
