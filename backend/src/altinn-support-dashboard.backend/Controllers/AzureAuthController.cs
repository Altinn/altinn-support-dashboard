using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using altinn_support_dashboard.Server.Utils;

namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/azure-auth")]
public class AzureAuthController : ControllerBase
{
    private readonly bool _isDev;

    public AzureAuthController(IWebHostEnvironment environment)
    {
        _isDev = environment.IsDevelopment();
    }

    [HttpGet("login")]
    public IActionResult Login([FromQuery] string redirectTo = "/dashboard")
    {
        var props = new AuthenticationProperties { RedirectUri = SanitizeUrl(redirectTo) };
        return Challenge(props, OpenIdConnectDefaults.AuthenticationScheme);
    }

    [HttpGet("logout")]
    public async Task<IActionResult> Logout([FromQuery] string redirectTo = "/")
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return SignOut(new AuthenticationProperties { RedirectUri = SanitizeUrl(redirectTo) }, OpenIdConnectDefaults.AuthenticationScheme);
    }

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
            azureAuthActive = true,
            roles
        });
    }

    private string SanitizeUrl(string url)
    {
        return _isDev
            ? "https://localhost:5173" + ValidationService.SanitizeRedirect(url ?? "/")
            : ValidationService.SanitizeRedirect(url ?? "/");
    }
}
