// Models/EnvironmentConfiguration.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Security;
using System.IdentityModel.Tokens.Jwt;
using altinn_support_dashboard.Server.Validation;
using altinn_support_dashboard.Server.Models.ansattporten;
using altinn_support_dashboard.Server.Services.Interfaces;


namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/auth")]
public class AnsattportenController : ControllerBase
{
    private bool ansattportenFeatureFlag;
    private string baseUrl;
    private IAnsattportenService _ansattportenService;
    public AnsattportenController(IConfiguration configuration, IAnsattportenService ansattportenService)
    {
        _ansattportenService = ansattportenService;
        ansattportenFeatureFlag = configuration.GetSection($"FeatureManagement:Ansattporten").Get<bool>();
        baseUrl = configuration.GetSection("RedirectConfiguration:RedirectUrl").Get<string>() ?? "";
    }

    [HttpGet("login")]
    public async Task<IActionResult> Login([FromQuery] string? redirectTo = "/")
    {

        string safeRedirectPath = baseUrl + ValidationService.SanitizeRedirectUrl(redirectTo ?? "");

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

        if (User == null || ansattportenFeatureFlag != true)
        {
            return Ok(new AuthDetails
            {
                IsLoggedIn = true,
                Name = null,
                AnsattportenActive = false,

            });
        }

        var result = await HttpContext.AuthenticateAsync(AnsattportenConstants.AnsattportenCookiesAuthenticationScheme);


        List<string> userPolicies = await _ansattportenService.GetUserPolicies(User);
        string orgName = await _ansattportenService.GetRepresentationOrgName(User);


        return Ok(new AuthDetails
        {
            IsLoggedIn = result.Succeeded,
            OrgName = orgName,
            Name = User?.Identity?.Name,
            AnsattportenActive = true,
            UserPolicies = userPolicies
        });
    }

    [HttpGet("claims")]
    public async Task<IActionResult> GetClaims()
    {
        await Task.CompletedTask;

        if (User == null || ansattportenFeatureFlag != true)
        {
            return BadRequest("No user found or ansattporten is not active");
        }
        return Ok(new
        {
            claims = User?.Claims.ToDictionary(c => c.Type, c => c.Value)
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


