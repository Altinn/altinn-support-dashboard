using Models.altinn3Dtos;

public class MockAltinn3ApiClient(Altinn3ApiClient inner) : IAltinn3ApiClient
{
    public Task<string> GetPersonalContactsByOrg(string orgNumber, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-personal-contacts.json"))
            : inner.GetPersonalContactsByOrg(orgNumber, environmentName);

    public Task<string> GetUserContactInformationByNin(string nin, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-personal-contacts.json"))
            : inner.GetUserContactInformationByNin(nin, environmentName);

    public Task<string> GetPersonalContactsByEmail(string email, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-personal-contacts.json"))
            : inner.GetPersonalContactsByEmail(email, environmentName);

    public Task<string> GetPersonalContactsByPhone(string phoneNumber, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-personal-contacts.json"))
            : inner.GetPersonalContactsByPhone(phoneNumber, environmentName);

    public Task<string> GetNotificationAddressesByOrg(string orgNumber, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-notification-addresses.json"))
            : inner.GetNotificationAddressesByOrg(orgNumber, environmentName);

    public Task<string> GetNotificationAddressesByPhone(string phoneNumber, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-notification-addresses.json"))
            : inner.GetNotificationAddressesByPhone(phoneNumber, environmentName);

    public Task<string> GetNotificationAddressesByEmail(string email, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-notification-addresses.json"))
            : inner.GetNotificationAddressesByEmail(email, environmentName);

    public Task<string> GetRolesAndRightsAltinn3(RolesAndRightsRequest dto, List<string>? anyOfResourceIds, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-roles-and-rights.json"))
            : inner.GetRolesAndRightsAltinn3(dto, anyOfResourceIds, environmentName);

    public Task<string> GetAuthorizedParties(string value, string type, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-roles-and-rights.json"))
            : inner.GetAuthorizedParties(value, type, environmentName);

    public Task<string> GetOrganizationIdentifiers(List<string> orgNumbers, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-organization-identifiers.json"))
            : inner.GetOrganizationIdentifiers(orgNumbers, environmentName);

    public Task<string> GetOrganizationsPartyInfoByPartyId(List<int> partyIds, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-organization-party-info.json"))
            : inner.GetOrganizationsPartyInfoByPartyId(partyIds, environmentName);

    public Task<string> GetAltinn2RolesList(string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("altinn3-altinn2-roles.json"))
            : inner.GetAltinn2RolesList(environmentName);
    public Task<string> GetAccessPackagesList(string environmentName) =>
    MockUtils.IsMock(environmentName)
        ? Task.FromResult(MockUtils.Read("altinn3-accesspackages.json"))
        : inner.GetAccessPackagesList(environmentName);

}


