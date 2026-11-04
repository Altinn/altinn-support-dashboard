using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Security;

namespace altinn_support_dashboard.backend.Tests.Security;

public class EnvironmentAccessPolicyTests
{
    private static IAuthorizationService CreateAuthorizationService(bool azureEntraEnabled)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["FeatureManagement:AzureEntra"] = azureEntraEnabled.ToString(),
                ["AzureAd:Instance"] = "https://login.microsoftonline.com/",
                ["AzureAd:TenantId"] = "00000000-0000-0000-0000-000000000000",
                ["AzureAd:ClientId"] = "00000000-0000-0000-0000-000000000000",
            })
            .Build();

        var services = new ServiceCollection();
        services.AddLogging();
        services.AddAzureEntraAuthenticationAndAuthorization(configuration);

        return services.BuildServiceProvider().GetRequiredService<IAuthorizationService>();
    }

    private static ClaimsPrincipal CreateUser(params string[] roles)
    {
        var claims = roles.Select(role => new Claim("roles", role));
        return new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));
    }

    private static HttpContext CreateHttpContext(string environmentName)
    {
        var httpContext = new DefaultHttpContext();
        httpContext.Request.RouteValues["environmentName"] = environmentName;
        return httpContext;
    }

    private static async Task<bool> IsAuthorized(bool azureEntraEnabled, string environmentName, params string[] roles)
    {
        var authorizationService = CreateAuthorizationService(azureEntraEnabled);
        var result = await authorizationService.AuthorizeAsync(CreateUser(roles), CreateHttpContext(environmentName), AzurePolicies.EnvironmentAccess);
        return result.Succeeded;
    }

    [Fact]
    public async Task Production_Succeeds_WhenUserHasProductionRole()
    {
        Assert.True(await IsAuthorized(true, "Production", AzureRoles.Production));
    }

    [Fact]
    public async Task Production_Fails_WhenUserLacksProductionRole()
    {
        Assert.False(await IsAuthorized(true, "Production", AzureRoles.TT02));
    }

    [Fact]
    public async Task Production_Fails_WhenUserLacksProductionRoleAndAzureEntraIsDisabled()
    {
        Assert.False(await IsAuthorized(false, "Production"));
    }

    [Fact]
    public async Task TT02_Succeeds_WhenUserHasTT02Role()
    {
        Assert.True(await IsAuthorized(true, "TT02", AzureRoles.TT02));
    }

    [Fact]
    public async Task TT02_Fails_WhenUserLacksTT02Role()
    {
        Assert.False(await IsAuthorized(true, "TT02", AzureRoles.Production));
    }

    [Fact]
    public async Task Mock_Succeeds_WithoutEnvironmentRole()
    {
        Assert.True(await IsAuthorized(true, "mock"));
    }

    [Theory]
    [InlineData("Foo")]
    [InlineData("production")]
    [InlineData("tt02")]
    [InlineData("")]
    public async Task UnknownOrWronglyCasedEnvironment_Fails(string environmentName)
    {
        Assert.False(await IsAuthorized(true, environmentName, AzureRoles.Production, AzureRoles.TT02));
    }
}
