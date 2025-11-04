// Models/EnvironmentConfiguration.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Security;
using System.IdentityModel.Tokens.Jwt;
using altinn_support_dashboard.Server.Validation;
using altinn_support_dashboard.Server.Models.ansattporten;


namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/auth")]
public class AnsattportenController : ControllerBase
{
    private bool ansattportenFeatureFlag;
    private string baseUrl;
    public AnsattportenController(IConfiguration configuration)
    {
        ansattportenFeatureFlag = configuration.GetSection($"FeatureManagement:Ansattporten").Get<bool>();
        baseUrl = configuration.GetSection("RedirectConfiguration:RedirectUrl").Get<string>();
    }

    [HttpGet("login")]
    public async Task<IActionResult> Login([FromQuery] string? redirectTo = "/")
    {

        string safeRedirectPath = baseUrl + ValidationService.SanitizeRedirectUrl(redirectTo);

        if (ansattportenFeatureFlag != true)
        {
            return Redirect(safeRedirectPath);
        }

        await Task.CompletedTask;
        var props = new AuthenticationProperties { RedirectUri = safeRedirectPath };

        return Challenge(props, AnsattportenConstants.AnsattportenAuthenticationScheme);
    }

    [HttpGet("auth-status")]
    public async Task<IActionResult> AuthStatus()
    {
        await Task.CompletedTask;

        if (ansattportenFeatureFlag != true)
        {
            return Ok(new AuthDetails
            {
                IsLoggedIn = true,
                Name = null
            });
        }

        var result = await HttpContext.AuthenticateAsync(AnsattportenConstants.AnsattportenCookiesAuthenticationScheme);

        return Ok(new AuthDetails
        {
            IsLoggedIn = result.Succeeded,
            Name = User?.Identity?.Name
        });
    }

    [HttpGet("logout")]
    public async Task<IActionResult> Logout([FromQuery] string? redirectTo = "/")
    {

        string safeRedirectPath = baseUrl + ValidationService.SanitizeRedirectUrl(redirectTo);


        if (ansattportenFeatureFlag != true)
        {

            return Redirect(safeRedirectPath);
        }

        await Task.CompletedTask;

        //clears local cookies
        await HttpContext.SignOutAsync(AnsattportenConstants.AnsattportenCookiesAuthenticationScheme);

        //signs user out of ansattporten
        await HttpContext.SignOutAsync(AnsattportenConstants.AnsattportenAuthenticationScheme, new AuthenticationProperties
        {
            RedirectUri = safeRedirectPath
        });

        return Redirect(safeRedirectPath);

    }





}
