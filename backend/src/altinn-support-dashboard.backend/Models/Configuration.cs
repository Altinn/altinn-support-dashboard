namespace altinn_support_dashboard.Server.Models;

public class Configuration
{
    public required EnvironmentConfiguration Production { get; set; }
    public required EnvironmentConfiguration TT02 { get; set; }
}
