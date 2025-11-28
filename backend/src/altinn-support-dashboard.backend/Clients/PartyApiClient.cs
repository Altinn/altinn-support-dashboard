using System.Text;
using System.Text.Json;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;

public class PartyApiClient
{
    private readonly HttpClient _client;

    public PartyApiClient(IHttpClientFactory clientFactory, IConfiguration settingsConfiguration)
    {
        _client = clientFactory.CreateClient("TT02");

        string registerSubscriptionKey = settingsConfiguration.GetSection("Configuration:Ocp_Apim_Subscription_Key").Get<string>() ?? "";
        _client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", registerSubscriptionKey);

        _client.BaseAddress = new Uri("https://platform.tt02.altinn.no/register/api/v1/");
    }

    //request of party
    public class LookupRequest
    {
        public string? OrgNo { get; set; }
        public string? Ssn { get; set; }
    }

    public async Task<string> GetParty(string orgNumber, bool isOrg)
    {
        try
        {
            string requestUrl = "parties/lookup";
            var requestBody = new LookupRequest();


            if (isOrg)
            {
                requestBody.OrgNo = orgNumber;
            }
            else
            {
                requestBody.Ssn = orgNumber;

            }

            var jsonBody = JsonSerializer.Serialize(requestBody);

            var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, requestUrl)
            {
                Content = content
            };


            var response = await _client.SendAsync(request);

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

    public async Task<string> GetPartyRoles(string partyUuid)
    {

        try
        {

            var requestUrl = $"correspondence/parties/{partyUuid}/roles/correspondence-roles";




            var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);

            var response = await _client.SendAsync(request);

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
    public async Task<string> GetPartyByUuid(string partyUuid)
    {

        try
        {

            var requestUrl = $"parties/byuuid/{partyUuid}";


            var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);

            var response = await _client.SendAsync(request);

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



}
