using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/{environmentName}/notifications")]
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
    public async Task<IActionResult> GetEmailNotificationsByOrderId([FromRoute] string environmentName, string orderId)
    {
        if (!ValidationService.IsValidNotificationOrderId(orderId))
            return BadRequest(InvalidOrderIdMessage);

        var response = await _service.GetEmailNotificationsByOrderId(orderId, environmentName);
        return Ok(response);
    }

    [HttpGet("orderid/sms/{orderId}")]
    public async Task<IActionResult> GetSmsNotificationsByOrderId([FromRoute] string environmentName, string orderId)
    {
        if (!ValidationService.IsValidNotificationOrderId(orderId))
            return BadRequest(InvalidOrderIdMessage);

        var response = await _service.GetSmsNotificationsByOrderId(orderId, environmentName);
        return Ok(response);
    }

    [HttpGet("orderid/{orderId}")]
    public async Task<IActionResult> GetAllNotificationsByOrderId([FromRoute] string environmentName, string orderId)
    {
        if (!ValidationService.IsValidNotificationOrderId(orderId))
            return BadRequest(InvalidOrderIdMessage);

        var response = await _service.GetAllNotificationsByOrderId(orderId, environmentName);
        return Ok(response);
    }

    [HttpGet("future/nin")]
    public async Task<IActionResult> GetFutureNotificationsByNin(
        [FromRoute] string environmentName,
        [FromHeader(Name = "NationalIdentityNumber")] string nationalIdentityNumber,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var response = await _service.GetFutureNotificationsByNin(nationalIdentityNumber, from, to, environmentName);
        return Ok(response);
    }
}
