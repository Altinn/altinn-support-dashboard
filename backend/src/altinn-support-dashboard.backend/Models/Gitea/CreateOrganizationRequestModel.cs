using System.ComponentModel.DataAnnotations;

namespace AltinnSupportDashboard.Models.Gitea
{
    /// <summary>
    /// Request model for creating a new organization in Gitea
    /// </summary>
    public class CreateOrganizationRequestModel
    {
        /// <summary>
        /// The short name for the organization
        /// Must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number
        /// </summary>
        [Required(ErrorMessage = "Organization short name is required")]
        [RegularExpression("^[a-z]+[a-z0-9-]*[a-z0-9]$", ErrorMessage = "Short name must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number")]
        public string ShortName { get; set; }
        
        /// <summary>
        /// The full name of the organization
        /// </summary>
        [Required(ErrorMessage = "Organization full name is required")]
        public string Fullname { get; set; }
        
        /// <summary>
        /// Optional website URL for the organization
        /// Must contain only letters, numbers, hyphens, underscores, periods, forward slashes, and colons
        /// </summary>
        [RegularExpression("^[a-zA-Z0-9\\-._/:]*$", ErrorMessage = "Website must contain only letters, numbers, hyphens, underscores, periods, forward slashes, and colons")]
        public string Website { get; set; }
        
        /// <summary>
        /// Personal Access Token (PAT) for authentication
        /// </summary>
        [Required(ErrorMessage = "PAT token is required")]
        public string PatToken { get; set; }
        
        /// <summary>
        /// Base URL of the Gitea instance
        /// </summary>
        [Required(ErrorMessage = "Gitea base URL is required")]
        public string GiteaBaseUrl { get; set; } = "https://dev.altinn.studio/repos";
    }
}