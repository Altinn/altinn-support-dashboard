


using Models.altinn3Dtos;

public interface IResourceRegistryService
{
    Task<List<ResourceDetailsDto>> GetResourceList(string environmentName);
    Task<List<ResourceSearchResult>> SearchResources(string environmentName, string query);
    Task<string> GetResourceByIdentifier(string environmentName, string identifier);
}