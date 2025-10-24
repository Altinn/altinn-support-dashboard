using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Security;
using System.IdentityModel.Tokens.Jwt;


namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/auth")]
public class AnsattportenController : ControllerBase
{
    private bool ansattportenFeatureFlag;
    public AnsattportenController(IConfiguration configuration)
    {
        ansattportenFeatureFlag = configuration.GetSection($"FeatureManagement:Ansattporten").Get<bool>();
    }

    [Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
    [HttpGet("login")]
    public async Task<IActionResult> Login([FromQuery] string? redirectTo = "/")
    {
        if (ansattportenFeatureFlag != true)
        {
            return Redirect(redirectTo);
        }

        await Task.CompletedTask;
        var props = new AuthenticationProperties { RedirectUri = redirectTo };

        return Challenge(props, AnsattportenConstants.AnsattportenAuthenticationScheme);
    }

    [HttpGet("auth-status")]
    public async Task<IActionResult> AuthStatus()
    {
        await Task.CompletedTask;

        if (ansattportenFeatureFlag != true)
        {
            return Ok(new
            {
                isLoggedIn = true,
                name = "no user"
            });
        }

        var result = await HttpContext.AuthenticateAsync(AnsattportenConstants.AnsattportenCookiesAuthenticationScheme);
        var user = HttpContext.User;


        string name = user?.FindFirst(JwtRegisteredClaimNames.Name)?.Value;

        return Ok(new
        {
            isLoggedIn = result.Succeeded,
            name = name
        });
    }

    [HttpGet("logout")]
    public async Task<IActionResult> Logout([FromQuery] string? redirectTo = "/")
    {
        if (ansattportenFeatureFlag != true)
        {

            return Redirect(redirectTo);
        }

        await Task.CompletedTask;

        //clears local cookies
        await HttpContext.SignOutAsync(AnsattportenConstants.AnsattportenCookiesAuthenticationScheme);

        //signs user out of ansattporten
        await HttpContext.SignOutAsync(AnsattportenConstants.AnsattportenAuthenticationScheme, new AuthenticationProperties
        {
            RedirectUri = redirectTo
        });

        return Redirect(redirectTo);

    }





}
