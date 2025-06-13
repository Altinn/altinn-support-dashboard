using System.Text.Json.Serialization;

namespace AltinnSupportDashboard.Models.Gitea
{
    /// <summary>
    /// Model for creating a repository in Gitea
    /// </summary>
    public class CreateRepositoryOptionModel
    {
        /// <summary>
        /// Name of the repository
        /// </summary>
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        /// <summary>
        /// Description of the repository
        /// </summary>
        [JsonPropertyName("description")]
        public string Description { get; set; }
        
        /// <summary>
        /// Whether the repository is private
        /// </summary>
        [JsonPropertyName("private")]
        public bool Private { get; set; }
        
        /// <summary>
        /// Whether to auto-initialize the repository
        /// </summary>
        [JsonPropertyName("auto_init")]
        public bool AutoInit { get; set; }
        
        /// <summary>
        /// License to use for the repository
        /// </summary>
        [JsonPropertyName("license")]
        public string License { get; set; }
        
        /// <summary>
        /// README content
        /// </summary>
        [JsonPropertyName("readme")]
        public string Readme { get; set; }
        
        /// <summary>
        /// Get a create repository option with default values
        /// </summary>
        /// <param name="name">Name of the repository</param>
        /// <param name="description">Description of the repository</param>
        /// <param name="isPrivate">Whether the repository is private</param>
        /// <param name="autoInit">Whether to auto-initialize the repository</param>
        /// <param name="license">License to use for the repository</param>
        /// <param name="readme">README content</param>
        /// <returns>A CreateRepositoryOptionModel configured with the specified parameters</returns>
        public static CreateRepositoryOptionModel GetCreateRepositoryOption(
            string name,
            string description = "Default repository",
            bool isPrivate = false,
            bool autoInit = true,
            string license = "mit",
            string readme = "Default")
        {
            return new CreateRepositoryOptionModel
            {
                Name = name,
                Description = description,
                Private = isPrivate,
                AutoInit = autoInit,
                License = license,
                Readme = readme
            };
        }
    }
}
