


public interface IResourceRegistryClient
{
    Task<string> GetResourceList(string environmentName);
}