
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
    [Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
    [ApiController]
    [Route("api/tt02/platform")]
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
        public async Task<PartyModel> GetPartyOrg([FromRoute] string orgNumber)
        {
            return await _service.GetPartyFromOrgAsync(orgNumber);
        }

        /// <summary>
        /// Retrieves a party based on the provided SSN.
        /// </summary>
        /// <param name="ssn">The SSN used to look up the party.</param>
        /// <returns>A <see cref="PartyModel"/> object representing the person party.</returns>
        [HttpGet("parties/lookup/ssn/{ssn}")]
        public async Task<PartyModel> GetPartySsn([FromRoute] string ssn)
        {
            return await _service.GetPartyFromSsnAsync(ssn);
        }

        /// <summary>
        /// Retrieves the roles associated with a specific party based on its UUID.
        /// </summary>
        /// <param name="Uuid">The UUID of the party.</param>
        /// <returns>A JSON string containing role information for the specified party.</returns>
        [HttpGet("parties/roles/uuid/{Uuid}")]
        public async Task<string> GetPartyRoles([FromRoute] string Uuid)
        {
            return await _service.GetRolesFromPartyAsync(Uuid);
        }
        /// <summary>
        /// Retrieves all external roles associated with an organization based on its organization number.
        /// </summary>
        /// <param name="orgNumber">The organization number used to look up associated roles.</param>
        /// <returns>
        /// An <see cref="ErRollerModel"/> object containing the roles linked to the specified organization.
        /// </returns>
        [HttpGet("parties/roles/org/{orgNumber}")]
        public async Task<ErRollerModel> GetRolesFromOrg([FromRoute] string orgNumber)
        {
            return await _service.GetRolesFromOrgAsync(orgNumber);
        }

        /// <summary>
        /// Retrieves detailed party information based on the provided UUID.
        /// </summary>
        /// <param name="Uuid">The UUID of the party.</param>
        /// <returns>A <see cref="PartyModel"/> object representing the party.</returns>
        [HttpGet("parties/lookup/uuid/{Uuid}")]
        public async Task<PartyModel> GetPartyUuid([FromRoute] string Uuid)
        {
            return await _service.GetPartyFromUuidAsync(Uuid);
        }
    }
}
