using Models.altinn3Dtos;
public interface IAltinn3ApiClient
{
    Task<string> GetPersonalContactsByOrg(string orgNumber, string environmentName);
    Task<string> GetUserContactInformationByNin(string nin, string environmentName);
    Task<string> GetPersonalContactsByEmail(string email, string environmentName);
    Task<string> GetPersonalContactsByPhone(string phoneNumber, string environmentName);
    Task<string> GetNotificationAddressesByOrg(string orgNumber, string environmentName);
    Task<string> GetNotificationAddressesByPhone(string phoneNumber, string environmentName);
    Task<string> GetNotificationAddressesByEmail(string email, string environmentName);
    Task<string> GetRolesAndRightsAltinn3(RolesAndRightsRequest dto, List<string>? AnyOfResourceIds, string environmentName);
    Task<string> GetOrganizationIdentifiers(List<string> orgNumbers, string environmentName);
    Task<string> GetOrganizationsPartyInfoByPartyId(List<int> partyIds, string environmentName);
    Task<string> GetAltinn2RolesList(string environmentName);
    Task<string> GetAccessPackagesList(string environmentName);
}




