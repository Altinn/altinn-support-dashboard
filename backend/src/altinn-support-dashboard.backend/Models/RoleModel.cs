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
    }
}
