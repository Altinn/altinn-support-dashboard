namespace altinn_support_dashboard.Server.Clients;

public interface IResourceRegistryClient
{
    Task<string> GetResourceList(string environmentName);
    Task<string> GetResourceByIdentifier(string environmentName, string identifier);
    Task<string> GetResourcePolicyRules(string environmentName, string identifier);
    Task<string> GetResourcePolicyRights(string environmentName, string identifier);
}