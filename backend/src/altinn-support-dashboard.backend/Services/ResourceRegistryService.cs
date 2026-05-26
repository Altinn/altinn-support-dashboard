

using System.Text.Json;
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
         return await _cache.GetOrCreateAsync($"resourceList_{environmentName}", async entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
        var response = await _resourceRegistryClient.GetResourceList(environmentName);
        return JsonSerializer.Deserialize<List<ResourceDetailsDto>>(response) 
            ?? throw new Exception("Error deserializing resource list");
    }) ?? throw new Exception("Cache returned null");
    }
}