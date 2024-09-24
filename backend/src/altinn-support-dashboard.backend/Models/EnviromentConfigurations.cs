// Models/EnvironmentConfiguration.cs
public class EnvironmentConfiguration
{
    public string Name { get; set; }
    public string ThemeName { get; set; }
    public string ApiKey { get; set; }
    public string BaseAddress { get; set; }
    public string Thumbprint { get; set; }
    public bool IgnoreSslErrors { get; set; }
    public int Timeout { get; set; }
}
// Models/EnvironmentConfigurations.cs
public class EnvironmentConfigurations
{
    public List<EnvironmentConfiguration> Environments { get; set; }
}
