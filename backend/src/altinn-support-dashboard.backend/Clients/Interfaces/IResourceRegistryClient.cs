


public interface IResourceRegistryClient
{
    Task<string> GetResourceList(string environmentName);
    Task<string> GetAltinnAppResources(string environmentName, string query);
}