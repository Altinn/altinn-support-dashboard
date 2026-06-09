using System.Text.Json;
using altinn_support_dashboard.Server.Clients;
using altinn_support_dashboard.Server.Models;
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
        var response = await GetCachedResourceList(environmentName);
        return response.Select(r => new ResourceDetailsDto
        {
            Identifier = r.Identifier ?? "",
            Title = new ResourceTitle
            {
                NB = r.Title?.GetValueOrDefault("nb"),
                NN = r.Title?.GetValueOrDefault("nn"),
                EN = r.Title?.GetValueOrDefault("en"),
            }
        }).ToList();
    }

    public async Task<List<ResourceSearchResult>> SearchResources(string environmentName, string query)
    {
        var response = await GetCachedResourceList(environmentName);

        return response.Where(r =>
            r.ResourceType == "AltinnApp" &&
            r.Title?.Values.Any(v => v.Contains(query, StringComparison.OrdinalIgnoreCase)) == true
        ).ToList();   
    }

    public async Task<Resource?> GetResourceByIdentifier(string environmentName, string identifier)
    {
        var json = await _resourceRegistryClient.GetResourceByIdentifier(environmentName, identifier);
        if (json == null)
        {
            return null;
        }
        return JsonSerializer.Deserialize<Resource>(json);
    }

    public async Task<List<PolicyRule>?> GetResourcePolicyRules(string environmentName, string identifier)
    {
        var json = await _resourceRegistryClient.GetResourcePolicyRules(environmentName, identifier);
        if (json == null)
        {
            return null;
        }
        return JsonSerializer.Deserialize<List<PolicyRule>>(json);
    }

    public async Task<List<PolicyRight>?> GetResourcePolicyRights(string environmentName, string identifier)
    {
        var json = await _resourceRegistryClient.GetResourcePolicyRights(environmentName, identifier);
        if (json == null)
        {
            return null;
        }
        return JsonSerializer.Deserialize<List<PolicyRight>>(json);
    }

    private async Task<List<ResourceSearchResult>> GetCachedResourceList(string environmentName)
    {
        return await _cache.GetOrCreateAsync<List<ResourceSearchResult>>($"resourceList_{environmentName}", async entry =>
        {
            var json = await _resourceRegistryClient.GetResourceList(environmentName);
            var result = JsonSerializer.Deserialize<List<ResourceSearchResult>>(json)
                ?? throw new Exception("Failed to deserialize resource list for caching");
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
            return result;
        }) ?? throw new Exception("Cache returned null");
    }

}