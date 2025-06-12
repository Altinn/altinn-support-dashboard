using System.Threading.Tasks;

namespace AltinnSupportDashboard.Interfaces
{
    /// <summary>
    /// Interface for Gitea service operations
    /// </summary>
    public interface IGiteaService
    {
        /// <summary>
        /// Validates a Personal Access Token format
        /// </summary>
        bool IsValidToken(string token);
        
        /// <summary>
        /// Validates the format of the organization short name
        /// </summary>
        bool IsValidOrgShortName(string shortName);
        
        /// <summary>
        /// Validates the format of a website URL
        /// </summary>
        bool IsValidWebsite(string website);
        
        /// <summary>
        /// Tests if a Personal Access Token is valid for the specified Gitea instance
        /// </summary>
        Task<string> TestPatTokenAsync(string patToken, string giteaBaseUrl);
        
        /// <summary>
        /// Creates a new organization in Gitea with default teams and repository
        /// </summary>
        Task<(bool success, string message, object results)> CreateOrganizationWithDefaultsAsync(
            string patToken, 
            string giteaBaseUrl, 
            string username, 
            string fullname, 
            string website);
    }
}
