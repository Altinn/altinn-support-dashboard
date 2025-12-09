

public interface IAltinn3ApiClient
{
    Task<string> GetPersonalContactsAltinn3(string orgNumber, string environmentName);
    Task<string> GetNotificationAddresses(string orgNumber, string environmentName);
}