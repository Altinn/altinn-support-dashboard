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

            services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                options.Prompt = "select_account";
            });

            services.Configure<CookieAuthenticationOptions>(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.None;
                //how long before new login is needed, automaticly resets timer on each request
                options.ExpireTimeSpan = TimeSpan.FromHours(4);
                options.SlidingExpiration = true;
            });
        }
        else
        {
            // Fallback scheme so enforced policies (e.g. Production) can return
            // proper 401/403 instead of crashing with no DefaultChallengeScheme.
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                    options.Cookie.SameSite = SameSiteMode.Strict;
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
            .AddPolicy(AzureRoles.CoreInternal, p =>
            {
                if (enabled) p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.CoreInternal));
                else p.RequireAssertion(_ => true);
            })
            .AddPolicy(AzureRoles.CoreExternal, p =>
            {
                if (enabled) p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.CoreExternal));
                else p.RequireAssertion(_ => true);
            })
            .AddPolicy(AzureRoles.Production, p =>
            {
                //Always required
                p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.Production));
            });

        return services;
    }

    private static bool HasRole(ClaimsPrincipal user, string role) =>
        user.Claims.Any(c => (c.Type == "roles" || c.Type == ClaimTypes.Role) && c.Value == role);
}
