
public interface IPartyApiClient
{
    Task<string> GetParty(string lookupValue, bool isOrg, string environmentName);
    Task<string> GetPartyRoles(string partyUuid, string environmentName);
    Task<string> GetPartyByUuid(string uuid, string environmentName);
    Task<string> GetPartyWithUserInformationByUuid(string uuid, string environmentName);
}
