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
        var idempotencyId = ResolveIdempotencyId(request.IdempotencyId);
        // Generated here so both success and failure events can be traced to the order in Altinn, 
        // even when we never get a response (e.g timeout)
        var sendersReference = $"asd-test-{idempotencyId}";

        NotificationSendResponse response;
        try
        {
            response = await _service.SendTestEmail(request, environmentName, idempotencyId, sendersReference);

        } catch (Exception ex)
        {
            _telemetryService.TrackTestEmailFailed(ex, sendersReference, CurrentUserId, environmentName);

            // Timeout or dropped connection: Altinn may have already accepted the order
            // Retrying is safe because the frontend sends the same key again
            if (ex is TaskCanceledException or HttpRequestException)
            {
                return StatusCode(StatusCodes.Status504GatewayTimeout, new
                {
                    message = "Vi fikk ikke bekreftet at e-posten ble sendt. Det er trygt å prøve igjen."
                });
            }
            throw;
        }
        
        _telemetryService.TrackTestEmailSent(response, sendersReference, CurrentUserId, environmentName);
        return Ok(response);
    }

    // Falls back to a new key if the frontend didn't send one
    private static string ResolveIdempotencyId(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return Guid.NewGuid().ToString();
        }

        if (!Guid.TryParse(value, out var id))
        {
            throw new BadRequestException("IdempotencyId must be a GUID");
        }

        return id.ToString();
    }
}
