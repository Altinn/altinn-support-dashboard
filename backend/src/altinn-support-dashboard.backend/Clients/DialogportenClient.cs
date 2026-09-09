using System.Net;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;

public class DialogportenClient : IDialogportenClient
{
    private readonly Dictionary<string, HttpClient> _clients = new();
    private readonly ILogger<INotificationsClient> _logger;

    public DialogportenClient(IOptions<Configuration> configuration, IHttpClientFactory clientFactory, ILogger<INotificationsClient> logger)
    {
        _logger = logger;
        InitClient(nameof(configuration.Value.TT02), configuration.Value.TT02, clientFactory);
        InitClient(nameof(configuration.Value.Production), configuration.Value.Production, clientFactory);
    }

    private void InitClient(string environmentName, EnvironmentConfiguration config, IHttpClientFactory clientFactory)
    {
        var client = clientFactory.CreateClient(environmentName);
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", config.Ocp_Apim_Subscription_Key);
        client.BaseAddress = new Uri(config.BaseAddressAltinn3);
        client.Timeout = TimeSpan.FromSeconds(config.Timeout);
        client.DefaultRequestHeaders.Add("ApiKey", config.ApiKey);
        _clients.Add(environmentName, client);
    }

    public async Task<string> GetDialogByUrn(string urn, string environmentName)
    {
        var client = _clients[environmentName];
        var response = await client.GetAsync($"dialogporten/api/v1/serviceowner/dialoglookup?instanceRef={urn}");
        var responseBody = await response.Content.ReadAsStringAsync();

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return "";

        }
        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(
                $"Api request failed with status code {response.StatusCode}: {responseBody}",
                inner: null,
                statusCode: response.StatusCode);
        }

        return responseBody;
    }

    public async Task<DeleteDialogResponse> DeleteDialogById(string dialogId, string revision, Boolean hardDelete, string environmentName)
    {
        var client = _clients[environmentName];
        string url = "";
        var request = new HttpRequestMessage();
        request.Headers.Add("If-Match", revision);


        if (!hardDelete)
        {
            //soft deletes dialog
            url = $"dialogporten/api/v1/serviceowner/dialogs/{dialogId}";
            request.Method = HttpMethod.Delete;
        }
        else
        {
            //permamently deletes dialog
            url = $"dialogporten/api/v1/serviceowner/dialogs/{dialogId}/actions/purge";
            request.Method = HttpMethod.Post;
        }

        request.RequestUri = new Uri(url, UriKind.Relative);

        var response = await client.SendAsync(request);

        // Excludes certain sensitive headers
        var excludeHeaders = new[] { "ApiKey", "authorization" };
        var filteredHeaders = response.Headers
            .Where(h => !excludeHeaders.Contains(h.Key, StringComparer.OrdinalIgnoreCase))
            .Select(h => $"{h.Key}: {string.Join(", ", h.Value)}");

        var responseHeaders = string.Join("\r\n", filteredHeaders);

        var deleteDialogResponse = new DeleteDialogResponse
        {
            StatusCode = response.StatusCode,
            ResponseBody = await response.Content.ReadAsStringAsync() ?? "",
            ResponseHeader = responseHeaders ?? "",
            RequestHeader = request.Headers.ToString(),
            RequestBody = request.Content != null ? await request.Content.ReadAsStringAsync() : ""
        };

        return deleteDialogResponse;
    }

    public async Task<string> GetDialogDetails(string dialogId, string environmentName)
    {
        var client = _clients[environmentName];
        var response = await client.GetAsync($"dialogporten/api/v1/serviceowner/dialogs/{dialogId}");
        var responseBody = await response.Content.ReadAsStringAsync();

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return String.Empty;
        }
        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(
                $"Api request failed with status code {response.StatusCode}: {responseBody}",
                inner: null,
                statusCode: response.StatusCode);
        }

        return responseBody;
    }
}
