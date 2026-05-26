using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/notifications")]
//added authorization temporary
[Authorize(AzureRoles.Authenticated)]
[Authorize(AzureRoles.CoreInternal)]
public class NotificationsController : ControllerBase
{
    private const string InvalidOrderIdMessage = "Ordre-ID is invalid. It should be in GUID format";

    private readonly INotificationsService _service;

    public NotificationsController(INotificationsService service)
    {
        _service = service;
    }

    [HttpGet("orderid/email/{orderId}")]
    public async Task<IActionResult> GetEmailNotificationsByOrderId(string orderId)
    {
        if (!ValidationService.IsValidNotificationOrderId(orderId))
        {
            return BadRequest(InvalidOrderIdMessage);
        }

        var response = await _service.GetEmailNotificationsByOrderId(orderId);
        return Ok(response);
    }

    [HttpGet("orderid/sms/{orderId}")]
    public async Task<IActionResult> GetSmsNotificationsByOrderId(string orderId)
    {
        if (!ValidationService.IsValidNotificationOrderId(orderId))
        {
            return BadRequest(InvalidOrderIdMessage);
        }

        var response = await _service.GetSmsNotificationsByOrderId(orderId);
        return Ok(response);
    }

    [HttpGet("orderid/{orderId}")]
    public async Task<IActionResult> GetAllNotificationsByOrderId(string orderId)
    {
        if (!ValidationService.IsValidNotificationOrderId(orderId))
        {
            return BadRequest(InvalidOrderIdMessage);
        }

        var response = await _service.GetAllNotificationsByOrderId(orderId);
        return Ok(response);
    }
}
