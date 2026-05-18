namespace Security;

public class AzureEntraLoginSettings
{
    public string Authority { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string[] Scopes { get; set; } = ["openid", "profile"];
    public int CookieExpiryTimeInMinutes { get; set; } = 120;
}
