


public interface IAltinnApiClient
{

    Task<string> GetOrganizationInfo(string orgNumber, string environmentName);
    Task<string> GetOrganizationsByPhoneNumber(string phoneNumber, string environmentName);
    Task<string> GetOrganizationsByEmail(string email, string environmentName);
    Task<string> GetPersonalContacts(string contactInfo, string environmentName);
    Task<string> GetPersonRoles(string subject, string reportee, string environmentName);
    Task<string> GetOfficialContacts(string orgNumber, string environmentName);
}