using System.Collections.Generic;
using System.Threading.Tasks;
using AltinnSupportDashboard.Models.Gitea;

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
            
        /// <summary>
        /// Creates a single team in an organization
        /// </summary>
        /// <param name="patToken">Personal Access Token</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea instance</param>
        /// <param name="orgName">Organization name</param>
        /// <param name="teamOption">Team creation options</param>
        /// <returns>Operation result with success status, message, and response data</returns>
        Task<(bool success, string message, object result)> CreateTeamAsync(
            string patToken,
            string giteaBaseUrl,
            string orgName,
            CreateTeamOptionModel teamOption);
            
        /// <summary>
        /// Creates all default teams for an organization
        /// </summary>
        /// <param name="patToken">Personal Access Token</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea instance</param>
        /// <param name="orgName">Organization name</param>
        /// <returns>Operation result with success status, message, and response data</returns>
        Task<(bool success, string message, IList<object> results)> CreateDefaultTeamsAsync(
            string patToken,
            string giteaBaseUrl,
            string orgName);
            
        /// <summary>
        /// Creates a repository with specified options
        /// </summary>
        /// <param name="patToken">Personal Access Token</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea instance</param>
        /// <param name="orgName">Organization name</param>
        /// <param name="repositoryOption">Repository creation options</param>
        /// <param name="prefixWithOrgName">Whether to prefix the repository name with the organization name</param>
        /// <returns>Operation result with success status, message, and response data</returns>
        Task<(bool success, string message, object result)> CreateRepositoryAsync(
            string patToken,
            string giteaBaseUrl,
            string orgName,
            CreateRepositoryOptionModel repositoryOption,
            bool prefixWithOrgName = true);
            
        /// <summary>
        /// Gets a list of default team options
        /// </summary>
        /// <returns>List of default team options</returns>
        IList<CreateTeamOptionModel> GetDefaultTeamOptions();
        
        /// <summary>
        /// Gets default repository option for datamodels repository
        /// </summary>
        /// <returns>Repository options configured for datamodels repository</returns>
        CreateRepositoryOptionModel GetDefaultRepositoryOption();
    }
}
