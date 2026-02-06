// Models/EnvironmentConfiguration.cs

using System.Text.Json.Serialization;
using Altinn.ApiClients.Maskinporten.Config;

public class EnvironmentConfiguration
{
    public required string Name { get; set; }
    public required string ThemeName { get; set; }
    public required string ApiKey { get; set; }
    public required string BaseAddressAltinn2 { get; set; }
    public required string BaseAddressAltinn3 { get; set; }

    public required string Ocp_Apim_Subscription_Key { get; set; }

    public required MaskinportenSettings MaskinportenSettings { get; set; }
    public int Timeout { get; set; }
}
