using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.notifications;
using Security;

namespace AltinnSupportDashboard.Controllers;

/// <summary>
/// Send test notifications (instant email) 
/// </summary>
[ApiController]
[Route("api/{environmentName}/notification-send")]
[Authorize(AzurePolicies.Authenticated)]
[Authorize(AzurePolicies.EnvironmentAccess)]
public class NotificationSendController : ControllerBase
{
    private readonly INotificationSendService _service;

    public NotificationSendController(INotificationSendService service)
    {
        _service = service;
    }

    [HttpPost("email")]
    public async Task<IActionResult> SendTestEmail([FromRoute] string environmentName, [FromBody] NotificationSendRequest request)
    {
        var response = await _service.SendTestEmail(request, environmentName);
        return Ok(response);
    }
}