using System.Text.Json.Serialization;

namespace altinn_support_dashboard.Server.Models
{
    public class Role
    {
        public int? RoleId { get; set; }
        public string? RoleType { get; set; }
        public int? RoleDefinitionId { get; set; }
        public string? RoleName { get; set; }
        public string? RoleDescription { get; set; }
        public string? RoleDefinitionCode { get; set; }

        [JsonPropertyName("_links")]
        public List<RoleLink>? Links { get; set; }



    }
    public class RoleLink
    {
        public string? Rel { get; set; }
        public string? Href { get; set; }
        public string? Title { get; set; }
        public string? FileNameWithExtension { get; set; }
        public string? MimeType { get; set; }
        public bool IsTemplated { get; set; }
        public bool Encrypted { get; set; }
        public bool SigningLocked { get; set; }
        public bool SignedByDefault { get; set; }
        public int FileSize { get; set; }
    }

}
