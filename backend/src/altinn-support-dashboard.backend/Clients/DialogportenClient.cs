using System.Net;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;

public class DialogportenClient : IDialogportenClient
{
    private readonly Dictionary<string, HttpClient> _clients = new();
    private readonly ILogger<IDialogportenClient> _logger;

    public DialogportenClient(IOptions<Configuration> configuration, IHttpClientFactory clientFactory, ILogger<IDialogportenClient> logger)
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
            _logger.LogError("Failed to look up dialog {Urn} in environment {EnvironmentName}. Status code: {StatusCode}", urn, environmentName, response.StatusCode);
            throw new HttpRequestException(
                $"Api request failed with status code {response.StatusCode}: {responseBody}",
                inner: null,
                statusCode: response.StatusCode);
        }

        return responseBody;
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
            _logger.LogError("Failed to lookup dialog details for {DialogId} in environment {EnvironmentName}. Status code: {StatusCode}", dialogId, environmentName, response.StatusCode);
            throw new HttpRequestException(
                $"Api request failed with status code {response.StatusCode}: {responseBody}",
                inner: null,
                statusCode: response.StatusCode);
        }

        return responseBody;
    }
}
