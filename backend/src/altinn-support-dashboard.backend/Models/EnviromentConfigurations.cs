// Models/EnvironmentConfiguration.cs
public class EnvironmentConfiguration
{
    public required string Name { get; set; }
    public required string ThemeName { get; set; }
    public required string ApiKey { get; set; }
    public required string BaseAddress { get; set; }
    public required string Thumbprint { get; set; }
    public bool IgnoreSslErrors { get; set; }
    public int Timeout { get; set; }
}
// Models/EnvironmentConfigurations.cs
public class EnvironmentConfigurations
{
    public required List<EnvironmentConfiguration> Environments { get; set; }
}
