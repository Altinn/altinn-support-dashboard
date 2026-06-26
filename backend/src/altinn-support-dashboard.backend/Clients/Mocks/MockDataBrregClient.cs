using altinn_support_dashboard.Server.Services;

public class MockDataBrregClient(DataBrregClient inner) : IDataBrregClient
{
    public Task<string> GetRolesAsync(string orgNumber, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("brreg-roles.json"))
            : inner.GetRolesAsync(orgNumber, environmentName);

    public Task<string> GetUnderenheter(string orgNumber, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("brreg-underenheter.json"))
            : inner.GetUnderenheter(orgNumber, environmentName);

    public Task<string?> GetUnderenhet(string orgNumber, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult<string?>(MockUtils.Read("brreg-underenhet.json"))
            : inner.GetUnderenhet(orgNumber, environmentName);

    public Task<string> GetEnhetsdetaljer(string orgNumber, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("brreg-enhetsdetaljer.json"))
            : inner.GetEnhetsdetaljer(orgNumber, environmentName);
}
