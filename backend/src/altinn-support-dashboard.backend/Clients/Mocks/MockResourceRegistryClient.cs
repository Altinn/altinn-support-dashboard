using altinn_support_dashboard.Server.Clients;

public class MockResourceRegistryClient(ResourceRegistryClient inner) : IResourceRegistryClient
{
    public Task<string> GetResourceList(string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("resource-list.json"))
            : inner.GetResourceList(environmentName);

    public Task<string> GetResourceByIdentifier(string environmentName, string identifier) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("resource-by-identifier.json"))
            : inner.GetResourceByIdentifier(environmentName, identifier);

    public Task<string> GetResourcePolicyRules(string environmentName, string identifier) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("resource-policy-rules.json"))
            : inner.GetResourcePolicyRules(environmentName, identifier);
}
