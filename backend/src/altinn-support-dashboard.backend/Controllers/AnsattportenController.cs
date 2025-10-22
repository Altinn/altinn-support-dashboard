
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication;


namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/auth")]
public class AnsattportenController : ControllerBase
{
    [HttpGet("login")]
    public async Task<IActionResult> Login([FromQuery] string? returnUrl = "/")
    {
        await Task.CompletedTask;

        return Challenge(new AuthenticationProperties { RedirectUri = returnUrl }, OpenIdConnectDefaults.AuthenticationScheme);
    }

    [HttpGet("auth-status")]
    public async Task<IActionResult> AuthStatus()
    {
        await Task.CompletedTask;

        var result = await HttpContext.AuthenticateAsync("Cookies");

    }




}
