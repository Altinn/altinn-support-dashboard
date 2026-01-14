

using System.Net.Http.Headers;
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

    //Creates a correspondence with an attachment
    public async Task<string> UploadCorrespondence(CorrespondenceUploadRequest request)
    {
        string requestUrl = "correspondence/api/v1/correspondence/upload";


        var form = new MultipartFormDataContent();

        // Correspondence required fields
        form.Add(new StringContent(request.Correspondence.ResourceId), "correspondence.resourceid");
        form.Add(new StringContent(request.Correspondence.SendersReference), "correspondence.sendersreference");
        form.Add(new StringContent(request.Correspondence.Content.Language), "correspondence.content.language");
        form.Add(new StringContent(request.Correspondence.Content.MessageTitle), "correspondence.content.messagetitle");
        form.Add(new StringContent(request.Correspondence.Content.MessageBody), "correspondence.content.messagebody");

        // Correspondence optional fields
        AddIfNotNull(form, request.Correspondence.IsConfirmedNeeded.ToString(), "correspondence.isconfirmation needed");


        AddIfNotNull(form, request.Correspondence.Content.MessageSummary, "correspondence.content.messageSummary");


        // Recipients
        for (int i = 0; i < request.Recipients.Count; i++)
        {
            form.Add(new StringContent(request.Recipients[i]), $"recipients[{i}]");
        }




        //Attachments
        //In the future we might add the ability to upload custom attachments
        var filestream = File.OpenRead("test.txt");
        var fileContent = new StreamContent(filestream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        form.Add(fileContent, "Attachments", "testfile.txt");
        form.Add(
            new StringContent("testfile-1"),
            "correspondence.content.attachments[0].sendersReference"
        );

        form.Add(
            new StringContent("testfile.txt"),
            "correspondence.content.attachments[0].filename"
        );


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

    //helper function for all optional fields
    private static void AddIfNotNull(MultipartFormDataContent form, string? value, string name)
    {

        if (!string.IsNullOrEmpty(value))
        {
            form.Add(new StringContent(value), name);
        }
    }
}
