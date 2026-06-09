using altinn_support_dashboard.Server.Models;
using Models.altinn3Dtos;

namespace altinn_support_dashboard.Server.Services;

public interface IResourceRegistryService
{
    Task<List<ResourceDetailsDto>> GetResourceList(string environmentName);
    Task<List<ResourceSearchResult>> SearchResources(string environmentName, string query);
    Task<Resource?> GetResourceByIdentifier(string environmentName, string identifier);
    Task<List<PolicyRule>?> GetResourcePolicyRules(string environmentName, string identifier);
    Task<List<PolicyRight>?> GetResourcePolicyRights(string environmentName, string identifier);
}