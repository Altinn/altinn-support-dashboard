using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
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
        }
        else
        {
            //fallback to be able to still authenticate roles which has to be enforced like prod
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Events.OnRedirectToLogin = ctx =>
                    {
                        ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        return Task.CompletedTask;
                    };
                    options.Events.OnRedirectToAccessDenied = ctx =>
                    {
                        ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                        return Task.CompletedTask;
                    };
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
                if (enabled) p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.TT02));
                else p.RequireAssertion(_ => true);
            })
            .AddPolicy(AzureRoles.CoreClosed, p =>
            {
                if (enabled) p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.CoreClosed));
                else p.RequireAssertion(_ => true);
            })
            .AddPolicy(AzureRoles.Production, p =>
            {
                p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.Production));
            });

        return services;
    }

    private static bool HasRole(ClaimsPrincipal user, string role) =>
        user.Claims.Any(c => (c.Type == "roles" || c.Type == ClaimTypes.Role) && c.Value == role);
}
