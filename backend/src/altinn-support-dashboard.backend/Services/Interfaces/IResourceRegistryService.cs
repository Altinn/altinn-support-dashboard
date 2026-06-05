using Models.altinn3Dtos;

namespace altinn_support_dashboard.Server.Services;

public interface IResourceRegistryService
{
    Task<List<ResourceDetailsDto>> GetResourceList(string environmentName);
    Task<List<ResourceSearchResult>> SearchResources(string environmentName, string query);
    Task<string> GetResourceByIdentifier(string environmentName, string identifier);
    Task<string> GetResourcePolicyRules(string environmentName, string identifier);
    Task<string> GetResourcePolicyRights(string environmentName, string identifier);
}