using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
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
    [EnableRateLimiting(RateLimitPolicies.NotificationSend)]
    public async Task<IActionResult> SendTestEmail([FromRoute] string environmentName, [FromBody] NotificationSendRequest request)
    {
        // Generated here so both success and failure events can be traced to the order in Altinn, 
        // even when we never get a response (e.g timeout)
        var sendersReference = $"asd-test-{Guid.NewGuid()}";

        NotificationSendResponse response;
        try
        {
            response = await _service.SendTestEmail(request, environmentName, sendersReference);

        } catch (Exception ex)
        {
            _telemetryService.TrackTestEmailFailed(ex, sendersReference, CurrentUserId, environmentName);
            throw;
        }
        
        _telemetryService.TrackTestEmailSent(response, sendersReference, CurrentUserId, environmentName);
        return Ok(response);
    }
}
