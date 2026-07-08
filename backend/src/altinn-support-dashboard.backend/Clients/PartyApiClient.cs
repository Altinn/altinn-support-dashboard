using System.Net;
using System.Text;
using System.Text.Json;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;

public class PartyApiClient : IPartyApiClient
{
    private readonly Dictionary<string, HttpClient> _clients = new();
    private readonly ILogger<IPartyApiClient> _logger;

    public class LookupRequest
    {
        public string? OrgNo { get; set; }
        public string? Ssn { get; set; }
    }

    public PartyApiClient(IOptions<Configuration> configuration, IHttpClientFactory clientFactory, ILogger<IPartyApiClient> logger)
    {
        InitClient(nameof(configuration.Value.TT02), configuration.Value.TT02, clientFactory);
        InitClient(nameof(configuration.Value.Production), configuration.Value.Production, clientFactory);

        _logger = logger;
    }

    private void InitClient(string environmentName, EnvironmentConfiguration config, IHttpClientFactory clientFactory)
    {
        var client = clientFactory.CreateClient(environmentName);
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", config.Ocp_Apim_Subscription_Key);
        client.BaseAddress = new Uri(config.BaseAddressAltinn3 + "register/api/v1/");
        _clients.Add(environmentName, client);
    }

    public async Task<string> GetParty(string lookupValue, bool isOrg, string environmentName)
    {
        var client = _clients[environmentName];
        var requestBody = new LookupRequest();

        if (isOrg)
            requestBody.OrgNo = lookupValue;
        else
            requestBody.Ssn = lookupValue;

        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
        var response = await client.PostAsync("parties/lookup", content);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
            return responseBody;

        if (response.StatusCode == HttpStatusCode.NotFound)
            return string.Empty;

        if (response.StatusCode == HttpStatusCode.BadRequest)
            throw new BadRequestException($"Invalid lookup request: {responseBody}");

        throw new HttpRequestException($"API request failed with status code {response.StatusCode}: {responseBody}");
    }

    public async Task<string> GetPartyRoles(string partyUuid, string environmentName)
    {
        var client = _clients[environmentName];
        var response = await client.GetAsync($"correspondence/parties/{partyUuid}/roles/correspondence-roles");
        var responseBody = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
            return responseBody;

        if (response.StatusCode == HttpStatusCode.NotFound)
            return string.Empty;

        throw new HttpRequestException($"API request failed with status code {response.StatusCode}: {responseBody}");
    }

    public async Task<string> GetPartyByUuid(string partyUuid, string environmentName)
    {
        var client = _clients[environmentName];
        var response = await client.GetAsync($"parties/byuuid/{partyUuid}");
        var responseBody = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
            return responseBody;

        if (response.StatusCode == HttpStatusCode.NotFound)
            return string.Empty;

        throw new HttpRequestException($"API request failed with status code {response.StatusCode}: {responseBody}");
    }

    public async Task<string> GetPartyByid(string partyId, string environmentName)
    {
        var client = _clients[environmentName];
        var response = await client.GetAsync($"parties/{partyId}");
        var responseBody = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
            return responseBody;

        if (response.StatusCode == HttpStatusCode.NotFound)
            return string.Empty;

        throw new HttpRequestException($"API request failed with status code {response.StatusCode}: {responseBody}");
    }

    public async Task<string> GetPartyByid(string partyId, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];
            var request = new HttpRequestMessage(HttpMethod.Get, $"parties/{partyId}");
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
                return await response.Content.ReadAsStringAsync();

            var responseBody = await response.Content.ReadAsStringAsync();
            throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetPartyWithUserInformationByUuid(string partyUuid, string environmentName)
    {
        var client = _clients[environmentName];
        var response = await client.GetAsync($"support-dashboard/parties/{partyUuid}?fields=user");
        var responseBody = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
            return responseBody;

        if (response.StatusCode == HttpStatusCode.NotFound)
            return string.Empty;

        throw new HttpRequestException($"API request failed with status code {response.StatusCode}: {responseBody}");
    }
}
