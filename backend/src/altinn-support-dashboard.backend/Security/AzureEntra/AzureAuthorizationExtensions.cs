using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
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

        var accessTokenEnvironments = configuration.GetSection("Configuration:AccessToken:Environments")
            .GetChildren()
            .Select(section => section.Key)
            .ToHashSet(StringComparer.Ordinal);

        services.AddAuthorizationBuilder()
            .AddPolicy(AzurePolicies.Authenticated, p =>
            {
                if (enabled) p.RequireAuthenticatedUser();
                else p.RequireAssertion(_ => true);
            })
            .AddPolicy(AzureRoles.TT02, p =>
            {
                if (enabled) p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.TT02));
                else p.RequireAssertion(_ => true);
            }).AddPolicy(AzureRoles.Developer, p =>
            {
                if (enabled) p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.Developer));
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
            }).AddPolicy(AzureRoles.DialogportenAdmin, p =>
            {
                //Always required
                p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.DialogportenAdmin));
            })
            .AddPolicy(AzureRoles.Production, p =>
            {
                //Always required
                p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.Production));
            }).AddPolicy(AzureRoles.LegalRequest, p =>
            {
                //Always required
                p.RequireAssertion(ctx => HasRole(ctx.User, AzureRoles.LegalRequest));
            }).AddPolicy(AzurePolicies.EnvironmentAccess, p =>
            {
                p.RequireAssertion(ctx => HasEnvironmentAccess(ctx, enabled, accessTokenEnvironments));
            });

        return services;
    }

    private static bool HasEnvironmentAccess(AuthorizationHandlerContext ctx, bool enabled, HashSet<string> accessTokenEnvironments)
    {
        var environmentName = (ctx.Resource as HttpContext)?.GetRouteValue("environmentName") as string;

        return environmentName switch
        {
            "Production" => HasRole(ctx.User, AzureRoles.Production),
            "TT02" => !enabled || HasRole(ctx.User, AzureRoles.TT02),
            "mock" => true,
            not null when accessTokenEnvironments.Contains(environmentName) => !enabled || HasRole(ctx.User, AzureRoles.Developer),
            _ => false
        };
    }

    private static bool HasRole(ClaimsPrincipal user, string role) =>
        user.Claims.Any(c => (c.Type == "roles" || c.Type == ClaimTypes.Role) && c.Value == role);
}
