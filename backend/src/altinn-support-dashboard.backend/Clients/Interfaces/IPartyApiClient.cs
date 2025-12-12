

public interface IPartyApiClient
{
    Task<string> GetParty(string orgNumber, bool isOrg);
    Task<string> GetPartyRoles(string partyUuid);
    Task<string> GetPartyByUuid(string uuid);
}