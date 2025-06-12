using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AltinnSupportDashboard.Interfaces;

namespace AltinnSupportDashboard.Services
{
    /// <summary>
    /// Service for Gitea operations
    /// </summary>
    public class GiteaService : IGiteaService
    {
        private readonly IGiteaApiClient _giteaApiClient;
        
        /// <summary>
        /// Initializes a new instance of the <see cref="GiteaService"/> class
        /// </summary>
        public GiteaService(IGiteaApiClient giteaApiClient)
        {
            _giteaApiClient = giteaApiClient;
        }
        
        /// <inheritdoc/>
        public bool IsValidToken(string token)
        {
            return !string.IsNullOrWhiteSpace(token) && token.Trim().Length == 40;
        }
        
        /// <inheritdoc/>
        public bool IsValidOrgShortName(string shortName)
        {
            return Regex.IsMatch(shortName, "^[a-z]+[a-z0-9-]*[a-z0-9]$");
        }
        
        /// <inheritdoc/>
        public bool IsValidWebsite(string website)
        {
            return Regex.IsMatch(website, "^[a-zA-Z0-9\\-._/:]*$");
        }
        
        /// <inheritdoc/>
        public async Task<string> TestPatTokenAsync(string patToken, string giteaBaseUrl)
        {
            if (!IsValidToken(patToken))
            {
                throw new ArgumentException("Invalid token format. Personal Access Tokens must be exactly 40 characters long.");
            }
            
            var userInfo = await _giteaApiClient.GetCurrentUserAsync(patToken, giteaBaseUrl);
            if (userInfo == null)
            {
                throw new UnauthorizedAccessException("Invalid PAT token or Gitea instance.");
            }
            
            return userInfo;
        }
        
        /// <inheritdoc/>
        public async Task<(bool success, string message, object results)> CreateOrganizationWithDefaultsAsync(
            string patToken, 
            string giteaBaseUrl, 
            string username, 
            string fullname, 
            string website)
        {
            // Validate inputs
            if (!IsValidToken(patToken))
            {
                return (false, "Invalid token format. Personal Access Tokens must be exactly 40 characters long.", null);
            }
            
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(fullname))
            {
                return (false, "Organization username and full name are required.", null);
            }
            
            if (!IsValidOrgShortName(username))
            {
                return (false, "Invalid organization username format. Username must start with a lowercase letter, " +
                      "contain only lowercase letters, numbers, or hyphens, and end with a letter or number.", null);
            }
            
            if (!string.IsNullOrWhiteSpace(website) && !IsValidWebsite(website))
            {
                return (false, "Invalid website format. Website must contain only letters, numbers, hyphens, underscores, periods, forward slashes, and colons.", null);
            }
        }
    }
}
