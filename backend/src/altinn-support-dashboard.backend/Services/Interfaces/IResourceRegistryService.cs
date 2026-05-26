


using Models.altinn3Dtos;

public interface IResourceRegistryService
{
    Task<List<ResourceDetailsDto>> GetResourceList(string environmentName);
    Task<List<ResourceDetailsDto>> SearchResources(string environmentName, string query);
}