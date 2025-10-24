using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Security;



//The configuration for Ansattporten has been taken from altinn studio, with a few tweeks to make it work well for ASD
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

                    options.CallbackPath = "/ansattporten-signin-oidc";
                    options.SignedOutCallbackPath = "/ansattporten-signout-oidc";

                    options.UsePkce = true;
                    options.GetClaimsFromUserInfoEndpoint = true;
                    options.SaveTokens = true;
                    options.MapInboundClaims = false;
                    options.RequireHttpsMetadata = true;

                    options.TokenValidationParameters.NameClaimType = JwtRegisteredClaimNames.Name;

                    options.Events.OnRedirectToIdentityProvider = context =>
                    {
                        var user = context.HttpContext.User;
                        if (user?.Identity?.IsAuthenticated != true)
                        {

                            //forces login
                            context.ProtocolMessage.Prompt = "login";
                        }

                        if (oidcSettings.AuthorizationDetails is not null)
                        {
                            context.ProtocolMessage.SetParameters(
                                new System.Collections.Specialized.NameValueCollection
                                {
                                    ["authorization_details"] = JsonSerializer.Serialize(oidcSettings.AuthorizationDetails, new JsonSerializerOptions()
                                    {
                                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                                    }),
                                    ["acr_values"] = oidcSettings.ArcValues
                                }
                            );
                        }

                        return Task.CompletedTask;
                    };
                });

        return services;
    }

    private static IServiceCollection AddAnsattPortenAuthorization(this IServiceCollection services, IConfiguration configuration)
    {

        //only authorizes if flag is set to true
        bool ansattPortenFeatureFlag = configuration.GetSection($"FeatureManagement:Ansattporten").Get<bool>();
        if (ansattPortenFeatureFlag)
        {
            services.AddAuthorizationBuilder()
                .AddPolicy(AnsattportenConstants.AnsattportenAuthorizationPolicy, policy =>
                    {
                        policy.AuthenticationSchemes.Add(AnsattportenConstants.AnsattportenAuthenticationScheme);
                        policy.RequireAuthenticatedUser();
                    }
                );
        }
        else
        {
            services.AddAuthorization(options =>
                   {
                       options.AddPolicy(AnsattportenConstants.AnsattportenAuthorizationPolicy, policy =>
                       {
                           policy.RequireAssertion(_ => true);
                       });
                   });
        }

        return services;
    }
}
