using Models.altinn3Dtos;
public interface IAltinn3ApiClient
{
    Task<string> GetOrganizationInfo(string orgNumber, string environmentName);
    Task<string> GetOrganizationsInfo(List<string> orgNumbers, string environmentName);
    Task<string> GetPersonalContactsByOrg(string orgNumber, string environmentName);
    Task<string> GetPersonalContactsByEmail(string email, string environmentName);
    Task<string> GetPersonalContactsByPhone(string phoneNumber, string environmentName);
    Task<string> GetNotificationAddressesByOrg(string orgNumber, string environmentName);
    Task<string> GetNotificationAddressesByPhone(string phoneNumber, string environmentName);
    Task<string> GetNotificationAddressesByEmail(string email, string environmentName);
    Task<string> GetRolesAndRightsAltinn3(RolesAndRightsRequest dto, string environmentName);
    Task<string> GetOrganizationIdentifiers(List<string> orgNumbers, string environmentName);
    Task<string> GetOrganizationsPartyInfoByPartyId(List<int> partyIds, string environmentName);
}




