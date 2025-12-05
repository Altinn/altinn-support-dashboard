
using altinn_support_dashboard.Server.Models;
using Altinn.ApiClients.Maskinporten.Factories;
using Altinn.ApiClients.Maskinporten.Services;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text;
using System.Net;

public class AltinnApiClient : IAltinnApiClient
{
    private readonly IHttpClientFactory _clientFactory;
    private readonly Dictionary<string, HttpClient> _clients = new();

    public AltinnApiClient(IOptions<Configuration> configuration, IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
        InitClient(nameof(configuration.Value.Production), configuration.Value.Production);
        InitClient(nameof(configuration.Value.TT02), configuration.Value.TT02);
    }

    public void InitClient(string environmentName, EnvironmentConfiguration configuration)
    {
        var client = _clientFactory.CreateClient(environmentName);
        client.BaseAddress = new Uri(configuration.BaseAddressAltinn2);
        client.Timeout = TimeSpan.FromSeconds(configuration.Timeout);
        client.DefaultRequestHeaders.Add("ApiKey", configuration.ApiKey);
        Console.WriteLine($"API Key {configuration.ApiKey} added to request headers.");

        _clients.Add(environmentName, client);
    }

    public async Task<string> GetOrganizationInfo(string orgNumber, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];

            // Construct the full request URL
            var requestUrl = $"organizations/{orgNumber}";
            Console.WriteLine($"Requesting URL: {client.BaseAddress}{requestUrl}");

            var response = await client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetOrganizationsByPhoneNumber(string phoneNumber, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];

            var requestUrl = $"organizations?phoneNumber={phoneNumber}&ForceEIAuthentication";
            Console.WriteLine($"Requesting URL: {client.BaseAddress}{requestUrl}");

            var response = await client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                var unsortedResponse = await response.Content.ReadAsStringAsync();
                var sortedOrganizations = JsonSerializer.Deserialize<List<Organization>>(unsortedResponse)?.OrderBy(o => o.Name).ToList();
                return JsonSerializer.Serialize(sortedOrganizations);
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetOrganizationsByEmail(string email, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];

            var requestUrl = $"organizations?email={email}&ForceEIAuthentication";
            Console.WriteLine($"Requesting URL: {client.BaseAddress}{requestUrl}");

            var response = await client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {

                var unsortedResponse = await response.Content.ReadAsStringAsync();
                var sortedOrganizations = JsonSerializer.Deserialize<List<Organization>>(unsortedResponse)?.OrderBy(o => o.Name).ToList();
                return JsonSerializer.Serialize(sortedOrganizations);
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetPersonalContacts(string orgNumber, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];

            // Construct the full request URL
            var requestUrl = $"organizations/{orgNumber}/personalcontacts";
            Console.WriteLine($"Requesting URL: {client.BaseAddress}{requestUrl}");

            var response = await client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetPersonRoles(string subject, string reportee, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];

            var requestUrl = $"authorization/roles?subject={subject}&reportee={reportee}&language=1044&";
            Console.WriteLine($"Requesting URL: {client.BaseAddress}{requestUrl}");

            var response = await client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }


    public async Task<string> GetOfficialContacts(string orgNumber, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];

            // Construct the full request URL
            var requestUrl = $"organizations/{orgNumber}/officialcontacts";
            Console.WriteLine($"Requesting URL: {client.BaseAddress}{requestUrl}");

            var response = await client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

}
