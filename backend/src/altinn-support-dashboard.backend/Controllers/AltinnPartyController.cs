
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/tt02/platform")]
public class Altinn_party_APIController : ControllerBase
{
    private PartyApiClient _client;

    public Altinn_party_APIController(PartyApiClient client)
    {
        _client = client;

    }

    [HttpGet("parties/lookup/org/{orgNumber}")]
    public async Task<string> GetPartyOrg([FromRoute] string orgNumber)
    {
        return await _client.GetParty(orgNumber, true);
    }

    [HttpGet("parties/lookup/ssn/{orgNumber}")]
    public async Task<string> GetPartySsn([FromRoute] string orgNumber)
    {
        return await _client.GetParty(orgNumber, false);
    }

    [HttpGet("parties/roles/{Uuid}")]
    public async Task<string> GetDagligLeder([FromRoute] string Uuid)
    {
        return await _client.GetPartyRoles(Uuid);
    }
}
