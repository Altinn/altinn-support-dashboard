
namespace Security;

public class AnsattportenLoginSettings
{
    public string ArcValues { get; set; }

    public AuthorizationDetail[] AuthorizationDetails { get; set; }

    /// <summary>
    /// Sets the cookie expiry time in minutes.
    /// </summary>
    public int CookieExpiryTimeInMinutes { get; set; } = 59;

    /// <summary>
    /// Url of the identity provider.
    /// </summary>
    public string Authority { get; set; }

    /// <summary>
    /// Client ID for the OpenID Connect provider.
    /// </summary>
    public string ClientId { get; set; }

    /// <summary>
    /// Client secret for the OpenID Connect provider.
    /// </summary>
    public string ClientSecret { get; set; }

    /// <summary>
    /// Scopes for the OpenID Connect provider.
    /// </summary>
    public string[] Scopes { get; set; }

    /// <summary>
    /// Flag to indicate if HTTPS metadata is required. In non-local environments this should be true.
    /// </summary>
    public bool RequireHttpsMetadata { get; set; } = true;

}

public class AuthorizationDetail
{
    public string Type { get; set; }
    public string Resource { get; set; }

    public bool? RepresentationIsRequierd { get; set; }
}

