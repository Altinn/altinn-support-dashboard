using System.Threading.Tasks;
using AltinnSupportDashboard.Models.Gitea;

namespace AltinnSupportDashboard.Interfaces
{
    /// <summary>
    /// Interface for the Gitea API client
    /// </summary>
    public interface IGiteaApiClient
    {
        /// <summary>
        /// Gets current user information using a PAT token
        /// </summary>
        Task<string> GetCurrentUserAsync(string patToken, string giteaBaseUrl);

        /// <summary>
        /// Creates a new organization in Gitea
        /// </summary>
        Task<string> CreateOrganizationAsync(string patToken, string giteaBaseUrl, string username, string fullName, string website);

        /// <summary>
        /// Creates default teams for an organization
        /// </summary>
        Task<string> CreateDefaultTeamsAsync(string patToken, string giteaBaseUrl, string orgName);
        
        /// <summary>
        /// Creates a default repository for an organization prefixed with the organization name
        /// </summary>
        Task<string> CreateDefaultRepositoryAsync(string patToken, string giteaBaseUrl, string orgName);
        
        /// <summary>
        /// Creates a team in an organization with specific options
        /// </summary>
        /// <param name="patToken">Personal Access Token</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea instance</param>
        /// <param name="orgName">Organization name</param>
        /// <param name="teamOption">Team creation options</param>
        /// <returns>API response as string</returns>
        Task<string> CreateTeamAsync(string patToken, string giteaBaseUrl, string orgName, CreateTeamOptionModel teamOption);
        
        /// <summary>
        /// Creates a repository with specified options
        /// </summary>
        /// <param name="patToken">Personal Access Token</param>
        /// <param name="giteaBaseUrl">Base URL of the Gitea instance</param>
        /// <param name="orgName">Organization name</param>
        /// <param name="repositoryOption">Repository creation options</param>
        /// <param name="prefixWithOrgName">Whether to prefix the repository name with the organization name</param>
        /// <returns>API response as string</returns>
        Task<string> CreateRepositoryAsync(string patToken, string giteaBaseUrl, string orgName, CreateRepositoryOptionModel repositoryOption, bool prefixWithOrgName = true);
    }
}
