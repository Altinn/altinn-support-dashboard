


using Models.altinn3Dtos;

public interface IResourceRegistryService
{
    Task<List<ResourceDetailsDto>> GetResourceList(string environmentName);
}