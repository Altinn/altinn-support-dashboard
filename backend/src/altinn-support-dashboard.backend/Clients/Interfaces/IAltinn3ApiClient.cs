

public interface IAltinn3ApiClient
{
    Task<string> GetPersonalContactsByOrg(string orgNumber, string environmentName);
    Task<string> GetPersonalContactsByEmail(string email, string environmentName);
    Task<string> GetPersonalContactsByPhone(string phoneNumber, string environmentName);
    Task<string> GetNotificationAddresses(string orgNumber, string environmentName);
}
