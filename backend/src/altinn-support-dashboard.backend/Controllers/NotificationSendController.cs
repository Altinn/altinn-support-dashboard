using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
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
[Authorize(AzureRoles.CoreExternal)]
[Authorize(AzurePolicies.EnvironmentAccess)]
public class NotificationSendController : ControllerBase
{
    private readonly INotificationSendService _service;
    private readonly ITelemetryService _telemetryService;

    public NotificationSendController(INotificationSendService service, ITelemetryService telemetryService)
    {
        _service = service;
        _telemetryService = telemetryService;
    }

    private string CurrentUserId => User.Identity?.Name ?? "unknown";

    [HttpPost("email")]
    public async Task<IActionResult> SendTestEmail([FromRoute] string environmentName, [FromBody] NotificationSendRequest request)
    {
        var response = await _service.SendTestEmail(request, environmentName);

        _telemetryService.TrackTestEmailSent(request.EmailAddress.Trim(), response, CurrentUserId, environmentName);

        return Ok(response);
    }
}
