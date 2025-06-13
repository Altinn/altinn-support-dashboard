using System.ComponentModel.DataAnnotations;

namespace AltinnSupportDashboard.Models.Gitea
{
    /// <summary>
    /// Request model for team creation operations
    /// </summary>
    public class TeamRequestModel
    {
        /// <summary>
        /// The personal access token for Gitea authentication
        /// </summary>
        [Required]
        public string PatToken { get; set; }
        
        /// <summary>
        /// The base URL of the Gitea instance
        /// </summary>
        [Required]
        public string GiteaBaseUrl { get; set; }
        
        /// <summary>
        /// Team creation options
        /// </summary>
        [Required]
        public CreateTeamOptionModel TeamOption { get; set; }
    }
}
