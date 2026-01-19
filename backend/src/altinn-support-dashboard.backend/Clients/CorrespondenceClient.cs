using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Models.correspondence;
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
    public async Task<CorrespondenceResponse> UploadCorrespondence(CorrespondenceUploadRequest correspondenceData)
    {
        string requestUrl = "correspondence/api/v1/correspondence/upload";


        // expects a flattened format
        var form = new MultipartFormDataContent();

        // Correspondence required fields
        form.Add(new StringContent(correspondenceData.Correspondence.ResourceId), "correspondence.resourceid");
        form.Add(new StringContent(correspondenceData.Correspondence.SendersReference), "correspondence.sendersreference");
        form.Add(new StringContent(correspondenceData.Correspondence.Content.Language), "correspondence.content.language");
        AddIfNotNull(form, correspondenceData.Correspondence.Content.MessageTitle, "correspondence.content.messagetitle");
        AddIfNotNull(form, correspondenceData.Correspondence.Content.MessageBody, "correspondence.content.messagebody");

        // Correspondence optional fields
        AddIfNotNull(form, correspondenceData.Correspondence.IsConfirmationNeeded.ToString(), "correspondence.isconfirmationneeded");
        AddIfNotNull(form, correspondenceData.Correspondence.DueDateTime.ToString("o", CultureInfo.InvariantCulture), "correspondence.duedatetime");


        AddIfNotNull(form, correspondenceData.Correspondence.Content.MessageSummary, "correspondence.content.messageSummary");


        // Recipients
        for (int i = 0; i < correspondenceData.Recipients.Count; i++)
        {

            // security reasons
            var encodedRecipient = WebUtility.HtmlEncode(correspondenceData.Recipients[i]);
            form.Add(new StringContent(encodedRecipient), $"recipients[{i}]");
        }

        //Attachments
        //In the future we might add the ability to upload custom attachments
        var content = "This is a test attachment";
        var bytes = Encoding.UTF8.GetBytes(content);

        var fileContent = new ByteArrayContent(bytes);
        fileContent.Headers.ContentType =
            new MediaTypeHeaderValue("text/plain");

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

        var request = new HttpRequestMessage(HttpMethod.Post, requestUrl);
        request.Content = form;

        var response = await _client.SendAsync(request);


        // Excludes certain sensitive headers
        var excludeHeaders = new[] { "ApiKey", "authorization" };
        var filteredHeaders = response.Headers
            .Where(h => !excludeHeaders.Contains(h.Key, StringComparer.OrdinalIgnoreCase))
            .Select(h => $"{h.Key}: {string.Join(", ", h.Value)}");

        var requestHeaders = string.Join("\r\n", filteredHeaders);

        CorrespondenceResponse correspondenceResponse = new CorrespondenceResponse
        {
            StatusCode = response.StatusCode,
            ResponseBody = await response.Content.ReadAsStringAsync() ?? "",
            ResponseHeader = response.Headers.ToString(),
            RequestHeader = requestHeaders ?? "",
            RequestBody = await request.Content.ReadAsStringAsync() ?? ""
        };

        return correspondenceResponse;

    }

    //helper function for all optional fields
    private static void AddIfNotNull(MultipartFormDataContent form, string? value, string name)
    {

        if (!string.IsNullOrEmpty(value))
        {
            form.Add(new StringContent(value), name);
        }
    }

    // Converts response to string
    public static async Task<string> GetRawResponseString(HttpResponseMessage response)
    {
        var sb = new StringBuilder();

        sb.AppendLine($"HTTP/{response.Version} {(int)response.StatusCode} {response.ReasonPhrase}");

        foreach (var header in response.Headers)
        {
            sb.AppendLine($"{header.Key}: {string.Join(", ", header.Value)}");
        }

        if (response.Content != null)
        {
            foreach (var header in response.Content.Headers)
            {
                sb.AppendLine($"{header.Key}: {string.Join(", ", header.Value)}");
            }

            var body = await response.Content.ReadAsStringAsync();
            sb.AppendLine();
            sb.AppendLine(body);
        }

        return sb.ToString();
    }
}
