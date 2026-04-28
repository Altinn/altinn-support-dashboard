using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Security;

internal class EasyAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public EasyAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder) { }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-MS-CLIENT-PRINCIPAL", out var header))
            return Task.FromResult(AuthenticateResult.NoResult());

        var decoded = Convert.FromBase64String(header!);
        var principal = JsonSerializer.Deserialize<AppServicePrincipal>(decoded);

        if (principal?.Claims == null)
            return Task.FromResult(AuthenticateResult.NoResult());

        var claims = principal.Claims.Select(c => new Claim(c.Typ, c.Val));
        var identity = new ClaimsIdentity(claims, Scheme.Name, principal.NameTyp, principal.RoleTyp);
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

public static class AzureAuthorizationExtensions
{
    private const string Scheme = "EasyAuth";

    public static IServiceCollection AddAzureEntraAuthenticationAndAuthorization(
        this IServiceCollection services, IConfiguration configuration)
    {
        bool enabled = configuration.GetValue<bool>("FeatureManagement:AzureEntra");

        if (enabled)
            services.AddAuthentication(Scheme)
                .AddScheme<AuthenticationSchemeOptions, EasyAuthHandler>(Scheme, null);

        // the policy name matches the Azure role name
        services.AddAuthorizationBuilder()
            .AddPolicy(AzureRoles.Authenticated, p =>
            {
                if (enabled) p.RequireAuthenticatedUser();
                else p.RequireAssertion(_ => true);
            })
            .AddPolicy(AzureRoles.TT02, p =>
            {
                if (enabled) p.RequireRole(AzureRoles.TT02);
                else p.RequireAssertion(_ => true);
            })
            .AddPolicy(AzureRoles.Production, p =>
            {
                // Production is always required
                p.RequireRole(AzureRoles.Production);
            });

        return services;
    }
}
