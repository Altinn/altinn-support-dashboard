

using System.Security.Claims;
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
}


