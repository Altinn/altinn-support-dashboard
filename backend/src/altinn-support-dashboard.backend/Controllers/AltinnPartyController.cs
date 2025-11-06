
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/tt02/platform")]
public class Altinn_party_APIController : ControllerBase
{
    private IPartyApiService _service;

    public Altinn_party_APIController(IPartyApiService service)
    {
        _service = service;

    }

    [HttpGet("parties/lookup/org/{orgNumber}")]
    public async Task<PartyModel> GetPartyOrg([FromRoute] string orgNumber)
    {
        return await _service.GetPartyFromOrgAsync(orgNumber);
    }

    [HttpGet("parties/lookup/ssn/{ssn}")]
    public async Task<PartyModel> GetPartySsn([FromRoute] string ssn)
    {
        return await _service.GetPartyFromSsnAsync(ssn);
    }

    [HttpGet("parties/roles/{Uuid}")]
    public async Task<string> GetPartyRoles([FromRoute] string Uuid)
    {
        return await _service.GetRolesFromPartyAsync(Uuid);
    }

    [HttpGet("parties/lookup/uuid/{Uuid}")]
    public async Task<PartyModel> GetPartyUuid([FromRoute] string Uuid)
    {
        return await _service.GetPartyFromUuidAsync(Uuid);
    }
}
