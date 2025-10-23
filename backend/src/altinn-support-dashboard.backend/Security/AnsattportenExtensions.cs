using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Security;



//The configuration for Ansattporten has been taken from altinn studio, with tweeks to make it work well for ASD
namespace Altinn.Studio.Designer.Infrastructure.AnsattPorten;

public static class AnsattPortenExtensions
{
    public static IServiceCollection AddAnsattPortenAuthenticationAndAuthorization(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAnsattPortenAuthentication(configuration);
        services.AddAnsattPortenAuthorization(configuration);
        return services;
    }

    private static IServiceCollection AddAnsattPortenAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        //will ignore if flag has not been set
        bool ansattPortenFeatureFlag = configuration.GetSection($"FeatureManagement:Ansattporten").Get<bool>();
        if (!ansattPortenFeatureFlag)
        {
            return services;
        }

        AnsattportenLoginSettings oidcSettings = configuration.GetSection(nameof(AnsattportenLoginSettings)).Get<AnsattportenLoginSettings>();

        services
            .AddAuthentication(AnsattportenConstants.AnsattportenCookiesAuthenticationScheme)
            .AddCookie(AnsattportenConstants.AnsattportenCookiesAuthenticationScheme, options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.Cookie.IsEssential = true;

                options.ExpireTimeSpan = TimeSpan.FromMinutes(oidcSettings.CookieExpiryTimeInMinutes);
                options.SlidingExpiration = true;

                options.Events.OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                };
            })
            .AddOpenIdConnect(AnsattportenConstants.AnsattportenAuthenticationScheme,
                options =>
                {
                    options.Authority = oidcSettings.Authority;
                    options.ClientId = oidcSettings.ClientId;
                    options.ClientSecret = oidcSettings.ClientSecret;

                    options.ResponseType = OpenIdConnectResponseType.Code;
                    options.SignInScheme = AnsattportenConstants.AnsattportenCookiesAuthenticationScheme;
                    options.AuthenticationMethod = OpenIdConnectRedirectBehavior.RedirectGet;

                    options.Scope.Clear();
                    foreach (string scope in oidcSettings.Scopes)
                    {
                        options.Scope.Add(scope);
                    }

                    options.CallbackPath = "/dashboard";

                    options.UsePkce = true;
                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.SaveTokens = true;
                    options.MapInboundClaims = false;
                    options.RequireHttpsMetadata = true;

                    options.Events.OnRedirectToIdentityProvider = context =>
                    {
                        if (String.IsNullOrEmpty(oidcSettings.ArcValues))
                        {
                            context.ProtocolMessage.SetParameter("arc_values", oidcSettings.ArcValues);
                        }

                        return Task.CompletedTask;
                    };
                });

        return services;
    }

    private static IServiceCollection AddAnsattPortenAuthorization(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthorizationBuilder()
            .AddPolicy(AnsattportenConstants.AnsattportenAuthorizationPolicy, policy =>
                {
                    policy.AuthenticationSchemes.Add(AnsattportenConstants.AnsattportenAuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                }
            );
        return services;
    }
}
