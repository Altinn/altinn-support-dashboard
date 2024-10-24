using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize] // This ensures the endpoint requires basic authentication
[ApiController]
[Route("api/{environmentName}/auth")]
public class AuthController : ControllerBase
{
    [HttpGet("check")]
    public IActionResult CheckAuthentication([FromRoute] string environmentName)
    {
        // Check the environment if needed (e.g., log it or add environment-specific logic)
        if (string.IsNullOrWhiteSpace(environmentName))
        {
            return BadRequest(new { message = "Environment name is required." });
        }

        // This method only returns success if authentication is successful
        return Ok(new { message = "Authenticated", environment = environmentName });
    }
}
