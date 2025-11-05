
using altinn_support_dashboard.Server.Models;
using Altinn.ApiClients.Maskinporten.Factories;
using Altinn.ApiClients.Maskinporten.Services;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text;
using System.Net;

public class AltinnApiClient
{
    private readonly IHttpClientFactory _clientFactory;
    private readonly Dictionary<string, HttpClient> _clients = new();
    private readonly string registerSubscriptionKey;

    public AltinnApiClient(IOptions<Configuration> configuration, IHttpClientFactory clientFactory, IConfiguration settingsConfiguration)
    {
        _clientFactory = clientFactory;
        InitClient(nameof(configuration.Value.Production), configuration.Value.Production);
        InitClient(nameof(configuration.Value.TT02), configuration.Value.TT02);
        registerSubscriptionKey = settingsConfiguration.GetSection("Configuration:Ocp-Apim-Subscription-Key").Get<string>();
    }

    public void InitClient(string environmentName, EnvironmentConfiguration configuration)
    {
        var client = _clientFactory.CreateClient(environmentName);
        client.BaseAddress = new Uri(configuration.BaseAddress);
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

    public async Task<string> GetParty(string orgNumber, string environmentName, bool isOrg)
    {
        try
        {
            var client = _clients[environmentName];

            string requestUrl = "https://platform.tt02.altinn.no/register/api/v1/parties/lookup";
            var requestBody = new
            {
                OrgNo = (string)null,
                Ssn = (string)null
            };

            if (isOrg)
            {
                requestBody = new { OrgNo = orgNumber, Ssn = (string)null };
            }
            else
            {

                requestBody = new { OrgNo = (string)null, Ssn = orgNumber };
            }

            var jsonBody = JsonSerializer.Serialize(requestBody);

            var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, requestUrl)
            {
                Content = content
            };

            request.Headers.Add("Ocp-Apim-Subscription-Key", registerSubscriptionKey);

            var response = await client.SendAsync(request);

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
            throw new Exception($"An error occurred while calling the APILLL: {ex.Message}", ex);

        }

    }

    public async Task<string> GetPartyRole(string partyUuid)
    {

        try
        {
            var client = _clients["TT02"];

            var requestUrl = $"https://platform.tt02.altinn.no/register/api/v1/correspondence/parties/{partyUuid}/roles/correspondence-roles";




            var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);


            request.Headers.Add("Ocp-Apim-Subscription-Key", registerSubscriptionKey);

            var response = await client.SendAsync(request);

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
            throw new Exception($"An error occurred while calling the APILLL: {ex.Message}", ex);

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
