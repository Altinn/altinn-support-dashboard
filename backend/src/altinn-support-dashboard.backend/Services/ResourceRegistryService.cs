using System.Text.Json;
using altinn_support_dashboard.Server.Clients;
using Microsoft.Extensions.Caching.Memory;
using Models.altinn3Dtos;

namespace altinn_support_dashboard.Server.Services;

public class ResourceRegistryService : IResourceRegistryService
{
    private readonly IResourceRegistryClient _resourceRegistryClient;
    private readonly IMemoryCache _cache;

    public ResourceRegistryService(IResourceRegistryClient resourceRegistryClient, IMemoryCache cache)
    {
        _resourceRegistryClient = resourceRegistryClient;
        _cache = cache;
    }


    public async Task<List<ResourceDetailsDto>> GetResourceList(string environmentName)
    {
        var response = await GetCachedResourceListJson(environmentName);
        return JsonSerializer.Deserialize<List<ResourceDetailsDto>>(response)
            ?? throw new Exception("Failed to deserialize resource list");
    }

    public async Task<List<ResourceSearchResult>> SearchResources(string environmentName, string query)
    {
        var response = await GetCachedResourceListJson(environmentName);
        var resources = JsonSerializer.Deserialize<List<ResourceSearchResult>>(response) ?? [];

        return resources.Where(r =>
            r.ResourceType == "AltinnApp" &&
            r.CompetentAuthority?.Name?.Values.Any(v => v == "Testdepartementet") != true &&
            r.Title?.Values.Any(v => v.Contains(query, StringComparison.OrdinalIgnoreCase)) == true
        ).ToList();   
    }

    public async Task<string> GetResourceByIdentifier(string environmentName, string identifier)
    {
        return await _resourceRegistryClient.GetResourceByIdentifier(environmentName, identifier);
    }

    public async Task<string> GetResourcePolicyRules(string environmentName, string identifier)
    {
        return await _resourceRegistryClient.GetResourcePolicyRules(environmentName, identifier);
    }

    public async Task<string> GetResourcePolicyRights(string environmentName, string identifier)
    {
        return await _resourceRegistryClient.GetResourcePolicyRights(environmentName, identifier);
    }

    private async Task<string> GetCachedResourceListJson(string environmentName)
    {
        return await _cache.GetOrCreateAsync($"resourceListJson_{environmentName}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
            return await _resourceRegistryClient.GetResourceList(environmentName);
        }) ?? throw new Exception("Cache returned null");
    }

}