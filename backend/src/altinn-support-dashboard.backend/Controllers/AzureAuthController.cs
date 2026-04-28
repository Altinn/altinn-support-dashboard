using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/azure-auth")]
public class AzureAuthController : ControllerBase
{
    [HttpGet("auth-status")]
    public IActionResult AuthStatus()
    {
        var roles = User.Claims
            .Where(c => c.Type == ClaimTypes.Role || c.Type == "roles")
            .Select(c => c.Value)
            .ToList();

        return Ok(new
        {
            isLoggedIn = User.Identity?.IsAuthenticated ?? false,
            name = User.Identity?.Name,
            roles
        });
    }
}
