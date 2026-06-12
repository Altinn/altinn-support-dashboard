using System.Text;
using System.Text.Json;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;

public class PartyApiClient : IPartyApiClient
{
    private readonly Dictionary<string, HttpClient> _clients = new();

    public class LookupRequest
    {
        public string? OrgNo { get; set; }
        public string? Ssn { get; set; }
    }

    public PartyApiClient(IOptions<Configuration> configuration, IHttpClientFactory clientFactory)
    {
        InitClient(nameof(configuration.Value.TT02), configuration.Value.TT02, clientFactory);
        InitClient(nameof(configuration.Value.Production), configuration.Value.Production, clientFactory);
    }

    private void InitClient(string environmentName, EnvironmentConfiguration config, IHttpClientFactory clientFactory)
    {
        var client = clientFactory.CreateClient(environmentName);
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", config.Ocp_Apim_Subscription_Key);
        client.BaseAddress = new Uri(config.BaseAddressAltinn3 + "register/api/v1/");
        _clients.Add(environmentName, client);
    }

    public async Task<string> GetParty(string orgNumber, bool isOrg, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];
            var requestBody = new LookupRequest();

            if (isOrg)
                requestBody.OrgNo = orgNumber;
            else
                requestBody.Ssn = orgNumber;

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Post, "parties/lookup") { Content = content };
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
                return await response.Content.ReadAsStringAsync();

            var responseBody = await response.Content.ReadAsStringAsync();
            if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                throw new BadRequestException($"Invalid lookup request: {responseBody}");

            throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
        }
        catch (BadRequestException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetPartyRoles(string partyUuid, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];
            var request = new HttpRequestMessage(HttpMethod.Get, $"correspondence/parties/{partyUuid}/roles/correspondence-roles");
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

    public async Task<string> GetPartyByUuid(string partyUuid, string environmentName)
    {
        try
        {
            var client = _clients[environmentName];
            var request = new HttpRequestMessage(HttpMethod.Get, $"parties/byuuid/{partyUuid}");
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
}
