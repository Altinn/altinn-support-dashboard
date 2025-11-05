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

        string registerSubscriptionKey = settingsConfiguration.GetSection("Configuration:Ocp-Apim-Subscription-Key").Get<string>();
        _client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", registerSubscriptionKey);
    }


    public async Task<string> GetParty(string orgNumber, bool isOrg)
    {
        try
        {
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

            var requestUrl = $"https://platform.tt02.altinn.no/register/api/v1/correspondence/parties/{partyUuid}/roles/correspondence-roles";




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
