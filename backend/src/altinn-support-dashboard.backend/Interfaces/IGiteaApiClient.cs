using System.Threading.Tasks;

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
    }
}
