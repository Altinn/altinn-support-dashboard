

using System.Security.Claims;
using System.Text.Json;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Security;

public class AnsattportenService : IAnsattportenService
{
    private IAuthorizationService _authorizationService;

    public AnsattportenService(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    public async Task<List<string>> GetUserPolicies(ClaimsPrincipal user)
    {
        List<string> policies = AnsattportenConstants.GetPolicies();

        List<string> userPolicies = new List<string>();

        foreach (string policy in policies)
        {
            AuthorizationResult result = await _authorizationService.AuthorizeAsync(user, policy);

            if (result.Succeeded)
            {
                userPolicies.Add(policy);

            }
        }
        return userPolicies;
    }

    public async Task<string> GetRepresentationOrgName(ClaimsPrincipal user)
    {
        var authDetailsClaim = user.Claims?.FirstOrDefault(c => c.Type == "authorization_details")?.Value;


        if (!string.IsNullOrEmpty(authDetailsClaim))
        {
            using var doc = JsonDocument.Parse(authDetailsClaim);

            // Navigate to authorized_parties[0].name
            var root = doc.RootElement;

            if (root.TryGetProperty("authorized_parties", out var parties) && parties.GetArrayLength() > 0)
            {
                var orgName = parties[0].GetProperty("name").GetString();

                return orgName ?? "";
            }
        }

        return "";
    }
}


