// Models/EnvironmentConfiguration.cs

using Altinn.ApiClients.Maskinporten.Config;

public class EnvironmentConfiguration
{
    public required string Name { get; set; }
    public required string ThemeName { get; set; }
    public required string ApiKey { get; set; }
    public required string BaseAddressAltinn2 { get; set; }
    public required string BaseAddressAltinn3 { get; set; }

    public required MaskinportenSettings MaskinportenSettings { get; set; }
    public int Timeout { get; set; }
}
