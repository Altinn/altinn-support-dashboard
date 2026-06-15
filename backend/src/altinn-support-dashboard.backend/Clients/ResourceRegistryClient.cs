using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;
using Models.altinn3Dtos;

namespace altinn_support_dashboard.Server.Clients;

public class ResourceRegistryClient : IResourceRegistryClient
{
    private readonly IHttpClientFactory _clientFactory;
    private readonly ILogger<IResourceRegistryClient> _logger;
    private readonly Dictionary<string, HttpClient> _clients = new();

    public ResourceRegistryClient(IHttpClientFactory httpClientFactory, ILogger<IResourceRegistryClient> logger, IOptions<Configuration> configuration)
    {
        _clientFactory = httpClientFactory;
        _logger = logger;

        InitClient(nameof(configuration.Value.Production), configuration.Value.Production);
        InitClient(nameof(configuration.Value.TT02), configuration.Value.TT02);
    }

    private void InitClient(string environmentName, EnvironmentConfiguration config)
    {
        var client = _clientFactory.CreateClient(environmentName);
        client.BaseAddress = new Uri(config.BaseAddressAltinn3);
        client.Timeout = TimeSpan.FromSeconds(config.Timeout);
        client.DefaultRequestHeaders.Add("ApiKey", config.ApiKey);

        _clients.Add(environmentName, client);
    }

    public async Task<string> GetResourceList(string environmentName)
    {
        var client = _clients[environmentName];
        var requestUrl = "/resourceregistry/api/v1/resource/resourcelist";
        var response = await client.GetAsync(requestUrl);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();

        return responseBody;
    }

    public async Task<string> GetResourceByIdentifier(string environmentName, string identifier)
    {
        var client = _clients[environmentName];
        var requestUrl = $"/resourceregistry/api/v1/resource/{identifier}";

        var response = await client.GetAsync(requestUrl);
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        return responseBody;
    }

    public async Task<string> GetResourcePolicyRules(string environmentName, string identifier)
    {
        var client = _clients[environmentName];
        var response = await client.GetAsync($"/resourceregistry/api/v1/resource/{identifier}/policy/rules");
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();
        return responseBody;
    }
}