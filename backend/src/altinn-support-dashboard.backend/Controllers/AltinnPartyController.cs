
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace altinn_support_dashboard.Server.Controllers
{
    [ApiController]
    [Authorize(AzureRoles.TT02)]
    [Route("api/TT02")]
    public class AltinnPartyTT02Controller : AltinnPartyBaseController
    {
        public AltinnPartyTT02Controller(IPartyApiService service) : base(service, "TT02") { }
    }

    [ApiController]
    [Authorize(AzureRoles.Production)]
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
            try
            {
                var result = await _service.GetPartyFromOrgAsync(orgNumber, _environmentName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving party from org number: {ex.Message}");
            }
        }

        [HttpGet("parties/lookup/ssn/{ssn}")]
        public async Task<IActionResult> GetPartySsn([FromRoute] string ssn)
        {
            try
            {
                var result = await _service.GetPartyFromSsnAsync(ssn, _environmentName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving party from SSN: {ex.Message}");
            }
        }

        [HttpGet("parties/roles/uuid/{Uuid}")]
        public async Task<IActionResult> GetPartyRoles([FromRoute] string Uuid)
        {
            try
            {
                var result = await _service.GetRolesFromPartyAsync(Uuid, _environmentName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving roles from UUID: {ex.Message}");
            }
        }

        [HttpGet("parties/roles/org/{orgNumber}")]
        public async Task<IActionResult> GetRolesFromOrg([FromRoute] string orgNumber)
        {
            try
            {
                var result = await _service.GetRolesFromOrgAsync(orgNumber, _environmentName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving roles from org number: {ex.Message}");
            }
        }

        [HttpGet("parties/lookup/uuid/{Uuid}")]
        public async Task<IActionResult> GetPartyUuid([FromRoute] string Uuid)
        {
            try
            {
                var result = await _service.GetPartyFromUuidAsync(Uuid, _environmentName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving party from UUID: {ex.Message}");
            }
        }
    }
}
