
using System.Text.Json.Serialization;

namespace Security;

public class AnsattportenLoginSettings
{
    public string? AcrValues { get; set; }

    public AuthorizationDetail[]? AuthorizationDetails { get; set; }


    /// <summary>
    /// Sets the cookie expiry time in minutes.
    /// </summary>
    public int CookieExpiryTimeInMinutes { get; set; } = 59;

    /// <summary>
    /// Url of the identity provider.
    /// </summary>
    public required string Authority { get; set; }

    /// <summary>
    /// Client ID for the OpenID Connect provider.
    /// </summary>
    public required string ClientId { get; set; }

    /// <summary>
    /// Client secret for the OpenID Connect provider.
    /// </summary>
    public required string ClientSecret { get; set; }

    /// <summary>
    /// Scopes for the OpenID Connect provider.
    /// </summary>
    public required string[] Scopes { get; set; }

    /// <summary>
    /// Flag to indicate if HTTPS metadata is required. In non-local environments this should be true.
    /// </summary>
    public bool RequireHttpsMetadata { get; set; } = true;

}

public class AuthorizationDetail
{

    public required string Type { get; set; }

    public required string Resource { get; set; }

    public required bool? representation_is_required { get; set; }

    public required string organizationform { get; set; }
}

