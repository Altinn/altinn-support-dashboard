

using System.Text;
using System.Text.Json;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;

public class CorrespondenceClient : ICorrespondenceClient
{
    private readonly HttpClient _client;
    private readonly ILogger<ICorrespondenceClient> _logger;
    public CorrespondenceClient(IHttpClientFactory _clientFactory, IOptions<Configuration> configuration, ILogger<ICorrespondenceClient> logger)
    {
        _client = _clientFactory.CreateClient("TT02");
        _client.BaseAddress = new Uri(configuration.Value.TT02.BaseAddressAltinn3);
        _client.Timeout = TimeSpan.FromSeconds(configuration.Value.TT02.Timeout);
        _client.DefaultRequestHeaders.Add("ApiKey", configuration.Value.TT02.ApiKey);
        _logger = logger;

    }
    public async Task<string> UploadCorrespondence(CorrespondenceUploadRequest correspondenceRequest)
    {
        string requestUrl = "/correspondence/api/v1/correspondence/upload";
        var requestBody = correspondenceRequest;
        var jsonBody = JsonSerializer.Serialize(correspondenceRequest);

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
}
