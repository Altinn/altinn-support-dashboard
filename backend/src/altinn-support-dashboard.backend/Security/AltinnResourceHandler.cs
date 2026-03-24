using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

public class AltinnResourceHandler : AuthorizationHandler<AltinnResourceRequirement>
{
    private readonly ILogger<AltinnResourceHandler> _logger;

    public AltinnResourceHandler(ILogger<AltinnResourceHandler> logger)
    {
        _logger = logger;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AltinnResourceRequirement requirement)
    {
        var userName = context.User.Identity?.Name ?? "unknown";
        _logger.LogInformation("[AltinnResourceHandler] Evaluating policy for resource '{Resource}' | User: {User}", requirement.resource, userName);

        var claims = context.User.Claims.Where(c => c.Type == "authorization_details").ToList();

        if (!claims.Any())
        {
            _logger.LogWarning("[AltinnResourceHandler] No 'authorization_details' claims found in token | User: {User}", userName);
            return Task.CompletedTask;
        }

        _logger.LogInformation("[AltinnResourceHandler] Found {Count} 'authorization_details' claim(s) | User: {User}", claims.Count, userName);

        foreach (Claim claim in claims)
        {
            var json = System.Text.Json.JsonDocument.Parse(claim.Value);

            string claimResource = json.RootElement.TryGetProperty("resource", out var resourceEl) ? resourceEl.ToString() : "(no resource)";

            int partyCount = 0;
            if (json.RootElement.TryGetProperty("authorized_parties", out var partiesEl))
            {
                partyCount = partiesEl.GetArrayLength();
                var partyNames = Enumerable.Range(0, partyCount)
                    .Select(i => partiesEl[i].TryGetProperty("name", out var n) ? n.GetString() : "(no name)")
                    .ToList();
                _logger.LogInformation("[AltinnResourceHandler] Claim: resource='{ClaimResource}', authorized_parties=[{Parties}] | User: {User}",
                    claimResource, string.Join(", ", partyNames), userName);
            }
            else
            {
                _logger.LogInformation("[AltinnResourceHandler] Claim: resource='{ClaimResource}', authorized_parties=(missing) | User: {User}",
                    claimResource, userName);
            }

            if (claimResource == requirement.resource)
            {
                if (partyCount > 0)
                {
                    _logger.LogInformation("[AltinnResourceHandler] ACCESS GRANTED: resource matches and authorized_parties is non-empty | User: {User} | Resource: {Resource}", userName, requirement.resource);
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                }
                else
                {
                    _logger.LogWarning("[AltinnResourceHandler] ACCESS DENIED: resource matches but authorized_parties is empty | User: {User} | Resource: {Resource}", userName, requirement.resource);
                }
            }
        }

        _logger.LogWarning("[AltinnResourceHandler] ACCESS DENIED: no matching claim granted access | User: {User} | Resource: {Resource}", userName, requirement.resource);
        return Task.CompletedTask;
    }
}
