namespace altinn_support_dashboard.Server.Models
{
    /// <summary>
    /// Konfigurasjon for Gitea API
    /// </summary>
    public class GiteaConfiguration
    {
        /// <summary>
        /// Development miljø konfigurasjon (dev.altinn.studio)
        /// </summary>
        public required GiteaEnvironmentConfiguration Development { get; set; }
        
        /// <summary>
        /// Production miljø konfigurasjon (altinn.studio)
        /// </summary>
        public required GiteaEnvironmentConfiguration Production { get; set; }
    }

    /// <summary>
    /// Konfigurasjon for et spesifikt Gitea miljø
    /// </summary>
    public class GiteaEnvironmentConfiguration
    {
        /// <summary>
        /// Base URL for Gitea API
        /// </summary>
        public required string BaseUrl { get; set; }
        
        /// <summary>
        /// Timeout i sekunder for API-kall
        /// </summary>
        public int Timeout { get; set; } = 100;
    }
}
