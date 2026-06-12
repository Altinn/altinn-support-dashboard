
public interface IPartyApiClient
{
    Task<string> GetParty(string orgNumber, bool isOrg, string environmentName);
    Task<string> GetPartyRoles(string partyUuid, string environmentName);
    Task<string> GetPartyByUuid(string uuid, string environmentName);
}
