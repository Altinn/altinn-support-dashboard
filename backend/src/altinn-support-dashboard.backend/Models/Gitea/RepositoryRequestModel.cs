using System.ComponentModel.DataAnnotations;

namespace AltinnSupportDashboard.Models.Gitea
{
    /// <summary>
    /// Request model for repository creation operations
    /// </summary>
    public class RepositoryRequestModel
    {
        /// <summary>
        /// The personal access token for Gitea authentication
        /// </summary>
        [Required]
        public string PatToken { get; set; }
        
        /// <summary>
        /// Repository creation options
        /// </summary>
        [Required]
        public CreateRepositoryOptionModel RepositoryOption { get; set; }
        
        /// <summary>
        /// Whether to prefix the repository name with the organization name
        /// Default is true, matching CLI tool behavior
        /// </summary>
        public bool PrefixWithOrgName { get; set; } = true;
    }
}
