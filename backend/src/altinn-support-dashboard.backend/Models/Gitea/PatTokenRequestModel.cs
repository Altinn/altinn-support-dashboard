using System.ComponentModel.DataAnnotations;

namespace AltinnSupportDashboard.Models.Gitea
{
    /// <summary>
    /// Request model for validating a Personal Access Token
    /// </summary>
    public class PatTokenRequestModel
    {
        /// <summary>
        /// Personal Access Token for authentication (must be 40 characters long)
        /// </summary>
        [Required(ErrorMessage = "PAT token is required")]
        public string PatToken { get; set; }
        
        /// <summary>
        /// Base URL of the Gitea instance including /repos/ path
        /// </summary>
        [Required(ErrorMessage = "Gitea base URL is required")]
        public string GiteaBaseUrl { get; set; } = "https://dev.altinn.studio/repos";
    }
}
