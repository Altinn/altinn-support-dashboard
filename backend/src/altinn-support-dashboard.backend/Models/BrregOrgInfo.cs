using System.Text.Json.Serialization;

namespace altinn_support_dashboard.Server.Models
{
    /// <summary>
    /// Model for organization information from BRREG API
    /// </summary>
    public class BrregOrgInfo
    {
        [JsonPropertyName("organisasjonsnummer")]
        public string OrganizationNumber { get; set; }

        [JsonPropertyName("navn")]
        public string Name { get; set; }

    }
}
