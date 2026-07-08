
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace altinn_support_dashboard.Server.Controllers
{
    [ApiController]
    [Authorize(AzureRoles.Developer)]
    [Route("api/TT02")]
    public class AltinnPartyTT02Controller : AltinnPartyBaseController
    {
        public AltinnPartyTT02Controller(IPartyApiService service) : base(service, "TT02") { }
    }

    [ApiController]
    [Authorize(AzureRoles.Developer)]
    [Route("api/Production")]
    public class AltinnPartyProductionController : AltinnPartyBaseController
    {
        public AltinnPartyProductionController(IPartyApiService service) : base(service, "Production") { }
    }

    [Authorize(AzureRoles.Authenticated)]
    [ApiController]
    public abstract class AltinnPartyBaseController : ControllerBase
    {
        private readonly IPartyApiService _service;
        private readonly string _environmentName;

        protected AltinnPartyBaseController(IPartyApiService service, string environmentName)
        {
            _service = service;
            _environmentName = environmentName;
        }

        [HttpGet("parties/lookup/org/{orgNumber}")]
        public async Task<IActionResult> GetPartyOrg([FromRoute] string orgNumber)
        {
            var result = await _service.GetPartyFromOrgAsync(orgNumber, _environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/lookup/ssn/{ssn}")]
        public async Task<IActionResult> GetPartySsn([FromRoute] string ssn)
        {
            var result = await _service.GetPartyFromSsnAsync(ssn, _environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/roles/uuid/{Uuid}")]
        public async Task<IActionResult> GetPartyRoles([FromRoute] string Uuid)
        {
            var result = await _service.GetRolesFromPartyAsync(Uuid, _environmentName);
            return Ok(result);
        }

        [HttpGet("parties/roles/org/{orgNumber}")]
        public async Task<IActionResult> GetRolesFromOrg([FromRoute] string orgNumber)
        {
            var result = await _service.GetRolesFromOrgAsync(orgNumber, _environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/lookup/uuid/{Uuid}")]
        public async Task<IActionResult> GetPartyByUuid([FromRoute] string Uuid)
        {
            var result = await _service.GetPartyByUuidAsync(Uuid, _environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/lookup/partyId/{partyId}")]
        public async Task<IActionResult> GetPartyByPartyId([FromRoute] string partyId)
        {
            var result = await _service.GetPartyByIdAsync(partyId, _environmentName);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("parties/lookup/{value}")]
        public async Task<IActionResult> GetPartyByValue([FromRoute] string value)
        {
            if (Guid.TryParse(value, out _))
            {
                var result = await _service.GetPartyByUuidAsync(value, _environmentName);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }

            if (ValidationService.isValidSsn(value))
            {
                var result = await _service.GetPartyFromSsnAsync(value, _environmentName);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }

            if (ValidationService.IsValidOrgNumberV2(value))
            {
                var result = await _service.GetPartyFromOrgAsync(value, _environmentName);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }

            if (value.All(char.IsDigit) && value.Length == 8)
            {
                var result = await _service.GetPartyByIdAsync(value, _environmentName);
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
