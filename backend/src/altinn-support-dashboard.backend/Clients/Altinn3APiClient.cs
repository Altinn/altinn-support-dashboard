
using altinn_support_dashboard.Server.Models;
using Altinn.ApiClients.Maskinporten.Factories;
using Altinn.ApiClients.Maskinporten.Services;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text;
using System.Net;

public class Altinn3ApiClient : IAltinn3ApiClient
{
    private readonly IHttpClientFactory _clientFactory;
    private readonly Dictionary<string, HttpClient> _clients = new();
    private readonly ILogger<IAltinn3ApiClient> _logger;

    public Altinn3ApiClient(IOptions<Configuration> configuration, IHttpClientFactory clientFactory, ILogger<IAltinn3ApiClient> logger)
    {
        _clientFactory = clientFactory;
        _logger = logger;


        InitClient(nameof(configuration.Value.Production), configuration.Value.Production);
        InitClient(nameof(configuration.Value.TT02), configuration.Value.TT02);
    }

    public void InitClient(string environmentName, EnvironmentConfiguration configuration)
    {
        var client = _clientFactory.CreateClient(environmentName);

        _logger.LogInformation(configuration.Ocp_Apim_Subscription_Key);
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", configuration.Ocp_Apim_Subscription_Key);

        client.BaseAddress = new Uri(configuration.BaseAddressAltinn3);
        client.Timeout = TimeSpan.FromSeconds(configuration.Timeout);
        client.DefaultRequestHeaders.Add("ApiKey", configuration.ApiKey);

        _clients.Add(environmentName, client);
    }

    public async Task<string> GetOrganizationInfo(string orgNumber, string environmentName)
    {
        var client = _clients[environmentName];

        var requestUrl = $"register/api/v1/organizations/{orgNumber}";

        var response = await client.GetAsync(requestUrl);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Api request failed with status code {response.StatusCode}: {responseBody}");
        }
        return responseBody;
    }
    public async Task<string> GetPersonalContactsByOrg(string orgNumber, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];

            var requestUrl = $"profile/api/v1/dashboard/organizations/{orgNumber}/contactinformation";

            var response = await client.GetAsync(requestUrl);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Api request failed with status code {response.StatusCode}: {responseBody}");
            }
            return responseBody;

        }
        catch (Exception ex)
        {
            throw new Exception($"An error occured while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetPersonalContactsByEmail(string email, string environmentName)
    {
        var client = _clients[environmentName];
        var requestUrl = $"profile/api/v1/dashboard/organizations/contactinformation/email/{email}";

        var response = await client.GetAsync(requestUrl);

        var responseBody = await response.Content.ReadAsStringAsync();
        _logger.LogInformation(responseBody);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Api request failed with status code {response.StatusCode}: {responseBody}");
        }

        return responseBody;

    }

    public async Task<string> GetPersonalContactsByPhone(string phoneNumber, string environmentName)
    {
        _logger.LogInformation("What");
        var client = _clients[environmentName];
        var requestUrl = $"profile/api/v1/dashboard/organizations/contactinformation/phonenumber/{phoneNumber}";

        var response = await client.GetAsync(requestUrl);

        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Api request failed with status code {response.StatusCode}: {responseBody}");
        }

        return responseBody;

    }

    public async Task<string> GetNotificationAddressesByOrg(string orgNumber, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];
            var requestUrl = $"profile/api/v1/dashboard/organizations/{orgNumber}/notificationaddresses";

            var response = await client.GetAsync(requestUrl);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Api request failed with status code {response.StatusCode}: {responseBody}");
            }
            return responseBody;
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetNotificationAddressesByPhone(string phoneNumber, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];
            var requestUrl = $"profile/api/v1/dashboard/organizations/notificationaddresses/phonenumber/{phoneNumber}";

            var response = await client.GetAsync(requestUrl);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Api request failed with status code {response.StatusCode}: {responseBody}");
            }
            return responseBody;
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetNotificationAddressesByEmail(string email, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];
            var requestUrl = $"profile/api/v1/dashboard/organizations/notificationaddresses/email/{email}";

            var response = await client.GetAsync(requestUrl);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Api request failed with status code {response.StatusCode}: {responseBody}");
            }
            return responseBody;
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }
}
