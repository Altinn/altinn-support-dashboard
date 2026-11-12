using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.notifications;
using Security;

namespace AltinnSupportDashboard.Controllers;

/// <summary>
/// Send test notifications (instant email) in TT02.
/// </summary>
[ApiController]
[Route("api/notification-send")]
[Authorize(AzurePolicies.Authenticated)]
[Authorize(AzureRoles.TT02)]
public class NotificationSendController : ControllerBase
{
    private readonly INotificationSendService _service;

    public NotificationSendController(INotificationSendService service)
    {
        _service = service;
    }

    [HttpPost("email")]
    public async Task<IActionResult> SendTestEmail([FromBody] NotificationsSendRequest request)
    {
        var response = await _service.SendTestEmail(request);
        return Ok(response);
    }
}