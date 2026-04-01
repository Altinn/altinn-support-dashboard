using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/notifications")]
//added authorization temporary
[Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
[Authorize(AnsattportenConstants.AnsattportenTT02AuthorizationPolicy)]
public class NotificationsController : ControllerBase
{
    private readonly INotificationsService _service;

    public NotificationsController(INotificationsService service)
    {
        _service = service;
    }

    [HttpGet("email/{orderId}")]
    public async Task<IActionResult> GetEmailNotificationsByOrderId(string orderId)
    {
        var response = await _service.GetEmailNotificationsByOrderId(orderId);
        return Ok(response);
    }

    [HttpGet("sms/{orderId}")]
    public async Task<IActionResult> GetSmsNotificationsByOrderId(string orderId)
    {
        var response = await _service.GetSmsNotificationsByOrderId(orderId);
        return Ok(response);
    }
}
