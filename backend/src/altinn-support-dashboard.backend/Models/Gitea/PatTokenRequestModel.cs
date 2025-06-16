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
    }
}
