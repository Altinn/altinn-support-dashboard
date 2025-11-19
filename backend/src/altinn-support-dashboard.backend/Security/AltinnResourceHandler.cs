using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

public class AltinnResourceHandler : AuthorizationHandler<AltinnResourceRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AltinnResourceRequirement requirement)
    {

        var claims = context.User.Claims.Where(c => c.Type == "authorization_details");

        foreach (Claim claim in claims)
        {
            var json = System.Text.Json.JsonDocument.Parse(claim.Value);
            if (json.RootElement.TryGetProperty("resource", out var resource))
            {
                string resourceString = resource.ToString();
                if (resourceString == requirement.resource)
                {
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                }
            }
        }

        return Task.CompletedTask;
    }
}
