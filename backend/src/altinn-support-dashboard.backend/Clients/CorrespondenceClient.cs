

using System.Text;
using System.Text.Json;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

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
    public async Task<string> UploadCorrespondence(CorrespondenceUploadRequest request)
    {
        string requestUrl = "correspondence/api/v1/correspondence/upload";


        var form = new MultipartFormDataContent();

        // Correspondence fields
        form.Add(new StringContent(request.Correspondence.ResourceId), "correspondence.resourceid");
        form.Add(new StringContent(request.Correspondence.SendersReference), "correspondence.sendersreference");
        form.Add(new StringContent(request.Correspondence.Content.Language), "correspondence.content.language");
        form.Add(new StringContent(request.Correspondence.Content.MessageTitle), "correspondence.content.messagetitle");
        form.Add(new StringContent(request.Correspondence.Content.MessageBody), "correspondence.content.messagebody");

        // Recipients
        for (int i = 0; i < request.Recipients.Count; i++)
        {
            form.Add(new StringContent(request.Recipients[i]), $"recipients[{i}]");
        }

        var response = await _client.PostAsync(requestUrl, form);
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
