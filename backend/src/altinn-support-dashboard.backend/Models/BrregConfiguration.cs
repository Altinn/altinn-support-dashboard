namespace altinn_support_dashboard.Server.Models
{
    /// <summary>
    /// Konfigurasjon for Brønnøysundregistrene API
    /// </summary>
    public class BrregApiConfiguration
    {
        /// <summary>
        /// Base URL for Brønnøysundregistrene API
        /// </summary>
        public required string BaseUrl { get; set; }

        /// <summary>
        /// Timeout i sekunder for API-kall
        /// </summary>
        public int Timeout { get; set; } = 30;
    }
}
