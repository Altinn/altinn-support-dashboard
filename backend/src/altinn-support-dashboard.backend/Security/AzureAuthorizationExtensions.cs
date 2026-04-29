using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web;

namespace Security;

public static class AzureAuthorizationExtensions
{
    public static IServiceCollection AddAzureEntraAuthenticationAndAuthorization(
        this IServiceCollection services, IConfiguration configuration)
    {
        bool enabled = configuration.GetValue<bool>("FeatureManagement:AzureEntra");

        if (enabled)
        {
            services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApp(configuration.GetSection("AzureAd"));

            services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                options.TokenValidationParameters.RoleClaimType = "roles";
            });
        }

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
                p.RequireRole(AzureRoles.Production);
            });

        return services;
    }
}
