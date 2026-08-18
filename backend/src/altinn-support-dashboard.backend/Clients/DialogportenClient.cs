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

    public async Task<string> GetDialogById(string urn, string environmentName)
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
}
