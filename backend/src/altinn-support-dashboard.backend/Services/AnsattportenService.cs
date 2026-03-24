using System.Security.Claims;
using System.Text.Json;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Security;

public class AnsattportenService : IAnsattportenService
{
    private IAuthorizationService _authorizationService;
    private ILogger<AnsattportenService> _logger;

    public AnsattportenService(IAuthorizationService authorizationService, ILogger<AnsattportenService> logger)
    {
        _authorizationService = authorizationService;
        _logger = logger;
    }
    public async Task<List<string>> GetUserPolicies(ClaimsPrincipal user)
    {
        List<string> policies = AnsattportenConstants.GetPolicies();
        var userName = user.Identity?.Name ?? "unknown";

        _logger.LogInformation("[AnsattportenService] Evaluating {Count} policies for user: {User}", policies.Count, userName);

        List<string> userPolicies = new List<string>();

        foreach (string policy in policies)
        {
            AuthorizationResult result = await _authorizationService.AuthorizeAsync(user, policy);

            if (result.Succeeded)
            {
                _logger.LogInformation("[AnsattportenService] Policy '{Policy}' => GRANTED | User: {User}", policy, userName);
                userPolicies.Add(policy);
            }
            else
            {
                _logger.LogInformation("[AnsattportenService] Policy '{Policy}' => DENIED | User: {User}", policy, userName);
            }
        }

        _logger.LogInformation("[AnsattportenService] User {User} has {Count} active policy/policies: [{Policies}]",
            userName, userPolicies.Count, string.Join(", ", userPolicies));

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


