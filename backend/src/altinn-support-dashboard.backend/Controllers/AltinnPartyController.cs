
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace altinn_support_dashboard.Server.Controllers
{
    /// <summary>
    /// Controller responsible for handling requests to the Altinn Party API.
    /// Provides endpoints to look up party information and roles by organization number, SSN, or UUID.
    /// </summary>
    [ApiController]
    [Route("api/tt02/platform")]
    [Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
    public class Altinn_party_APIController : ControllerBase
    {
        private readonly IPartyApiService _service;

        public Altinn_party_APIController(IPartyApiService service)
        {
            _service = service;
        }

        /// <summary>
        /// Retrieves a party based on the provided organization number.
        /// </summary>
        /// <param name="orgNumber">The organization number used to look up the party.</param>
        /// <returns>A <see cref="PartyModel"/> object representing the organization party.</returns>
        [HttpGet("parties/lookup/org/{orgNumber}")]
        public async Task<IActionResult> GetPartyOrg([FromRoute] string orgNumber)
        {
            try
            {

                var result = await _service.GetPartyFromOrgAsync(orgNumber);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving party from org number: {ex.Message}");
            }
        }

        /// <summary>
        /// Retrieves a party based on the provided SSN.
        /// </summary>
        /// <param name="ssn">The SSN used to look up the party.</param>
        /// <returns>A <see cref="PartyModel"/> object representing the person party.</returns>
        [HttpGet("parties/lookup/ssn/{ssn}")]
        public async Task<IActionResult> GetPartySsn([FromRoute] string ssn)
        {
            try
            {

                var result = await _service.GetPartyFromSsnAsync(ssn);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving party from SSN: {ex.Message}");
            }
        }

        /// <summary>
        /// Retrieves the roles associated with a specific party based on its UUID.
        /// </summary>
        /// <param name="Uuid">The UUID of the party.</param>
        /// <returns>A JSON string containing role information for the specified party.</returns>
        [HttpGet("parties/roles/uuid/{Uuid}")]
        public async Task<IActionResult> GetPartyRoles([FromRoute] string Uuid)
        {
            try
            {
                var result = await _service.GetRolesFromPartyAsync(Uuid);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving roles from UUID: {ex.Message}");
            }
        }

        /// <summary>
        /// Retrieves all external roles associated with an organization based on its organization number.
        /// </summary>
        /// <param name="orgNumber">The organization number used to look up associated roles.</param>
        /// <returns>
        /// An <see cref="ErRollerModel"/> object containing the roles linked to the specified organization.
        /// </returns>
        [HttpGet("parties/roles/org/{orgNumber}")]
        public async Task<IActionResult> GetRolesFromOrg([FromRoute] string orgNumber)
        {
            try
            {
                var result = await _service.GetRolesFromOrgAsync(orgNumber);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving roles from org number: {ex.Message}");
            }
        }

        /// <summary>
        /// Retrieves detailed party information based on the provided UUID.
        /// </summary>
        /// <param name="Uuid">The UUID of the party.</param>
        /// <returns>A <see cref="PartyModel"/> object representing the party.</returns>
        [HttpGet("parties/lookup/uuid/{Uuid}")]
        public async Task<IActionResult> GetPartyUuid([FromRoute] string Uuid)
        {
            try
            {

                var result = await _service.GetPartyFromUuidAsync(Uuid);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving party from UUID: {ex.Message}");
            }
        }
    }
}
