using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Security;


namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/auth")]
public class AnsattportenController : ControllerBase
{
    [Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
    [HttpGet("login")]
    public async Task<IActionResult> Login([FromQuery] string? redirectTo = "/")
    {
        await Task.CompletedTask;

        return Challenge(new AuthenticationProperties { RedirectUri = redirectTo }, AnsattportenConstants.AnsattportenAuthenticationScheme);
    }

    [HttpGet("auth-status")]
    public async Task<IActionResult> AuthStatus()
    {
        await Task.CompletedTask;

        var result = await HttpContext.AuthenticateAsync(AnsattportenConstants.AnsattportenCookiesAuthenticationScheme);

        return Ok(new { isLoggedIn = result.Succeeded });
    }




}
