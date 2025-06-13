using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AltinnSupportDashboard.Models.Gitea
{
    /// <summary>
    /// Model for creating a team in Gitea
    /// </summary>
    public class CreateTeamOptionModel
    {
        /// <summary>
        /// Name of the team
        /// </summary>
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        /// <summary>
        /// Description of the team
        /// </summary>
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        /// <summary>
        /// Whether the team is visible to all members
        /// </summary>
        [JsonPropertyName("includes_all_repositories")]
        public bool IncludesAllRepositories { get; set; } = true;
        
        /// <summary>
        /// Permission level for the team
        /// </summary>
        [JsonPropertyName("permission")]
        public string Permission { get; set; }
        
        /// <summary>
        /// Whether team members can create organization repositories
        /// </summary>
        [JsonPropertyName("can_create_org_repo")]
        public bool CanCreateOrgRepo { get; set; }
        
        /// <summary>
        /// Repository units that the team has access to
        /// This is a critical field for team creation in Gitea API
        /// </summary>
        [JsonPropertyName("units")]
        public List<string> Units { get; set; } = new List<string> { 
            "repo.code", "repo.issues", "repo.ext_issues", "repo.wiki", 
            "repo.pulls", "repo.releases", "repo.projects", "repo.ext_wiki" 
        };
        
        /// <summary>
        /// Get a create team option with default values
        /// </summary>
        /// <param name="name">Name of the team</param>
        /// <param name="description">Description of the team</param>
        /// <param name="canCreateRepo">Whether team members can create repositories</param>
        /// <param name="permission">Permission level for the team</param>
        /// <returns>A CreateTeamOptionModel configured with the specified parameters</returns>
        public static CreateTeamOptionModel GetCreateTeamOption(
            string name,
            string description,
            bool canCreateRepo,
            string permission)
        {
            return new CreateTeamOptionModel
            {
                Name = name,
                Description = description,
                CanCreateOrgRepo = canCreateRepo,
                IncludesAllRepositories = true,
                Permission = permission
            };
        }
    }
    
    /// <summary>
    /// Constants for team permissions
    /// </summary>
    public static class Permission
    {
        /// <summary>
        /// Read permission
        /// </summary>
        public const string Read = "read";
        
        /// <summary>
        /// Write permission
        /// </summary>
        public const string Write = "write";
        
        /// <summary>
        /// Admin permission
        /// </summary>
        public const string Admin = "admin";
    }
}
