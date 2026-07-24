using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.altinn3Dtos;
using Security;

namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/{environmentName}/notifications")]
[Authorize(AzureRoles.Authenticated)]
[Authorize(AzureRoles.CoreInternal)]
public class NotificationsController : ControllerBase
{
    private const string InvalidOrderIdMessage = "Order-ID is invalid. It should be in GUID format";

    private readonly INotificationsService _service;
    private readonly IAltinn3Service _altinn3Service;

    public NotificationsController(INotificationsService service, IAltinn3Service altinn3Service)
    {
        _service = service;
        _altinn3Service = altinn3Service;
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

    [HttpGet("future/nin/{nin}")]
    public async Task<IActionResult> GetFutureNotificationsByNin(
        [FromRoute] string environmentName,
        [FromRoute] string nin,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        if (!ValidationService.isValidSsn(nin))
        {
            return BadRequest("Not a valid nin");
        }
        var response = await _service.GetFutureNotificationsByNin(nin, from, to, environmentName);
        return Ok(response);
    }

    [HttpGet("future/orgNr/{orgNr}")]
    public async Task<IActionResult> GetFutureNotificationsByOrgNr(
        [FromRoute] string environmentName,
        [FromRoute] string orgNr,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        if (!ValidationService.IsValidOrgNumberV2(orgNr))
        {
            return BadRequest("Not a valid Organization number");
        }
        var response = await _service.GetFutureNotificationsByOrgNr(orgNr, from, to, environmentName);
        return Ok(response);
    }

    [HttpGet("future/partytId/{partyId}")]
    public async Task<IActionResult> GetFutureNotificationsByPartyId(
        [FromRoute] string environmentName,
        [FromRoute] string partyId,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        if (!ValidationService.IsValidPartyId(partyId))
        {
            return BadRequest("Not a valid PartyId");
        }
        var response = await _service.GetFutureNotificationsByPartyId(partyId, from, to, environmentName);
        return Ok(response);
    }

    [HttpGet("future/partyUuid/{partyId}")]
    public async Task<IActionResult> GetFutureNotificationsByPartyUuid(
        [FromRoute] string environmentName,
        [FromRoute] string partyUuid,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        if (!ValidationService.IsValidGuid(partyUuid))
        {
            return BadRequest("Not in a valid Guid format");
        }
        var response = await _service.GetFutureNotificationsByPartyUuid(partyUuid, from, to, environmentName);
        return Ok(response);
    }

    [HttpGet("future/{query}")]
    public async Task<IActionResult> GetFutureNofifications([FromRoute] string environmentName,
        [FromRoute] string query,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        if (ValidationService.IsValidOrgNumberV2(query))
        {
            return await GetFutureNotificationsByOrgNr(environmentName, query, from, to);
        }

        if (ValidationService.isValidSsn(query))
        {
            return await GetFutureNotificationsByNin(environmentName, query, from, to);
        }

        if (ValidationService.IsValidPartyId(query))
        {
            return await GetFutureNotificationsByPartyId(environmentName, query, from, to);
        }

        if (ValidationService.IsValidGuid(query))
        {
            return await GetFutureNotificationsByPartyUuid(environmentName, query, from, to);
        }
        return BadRequest("Not a valid nin, org number, partyid or partyuuid");
    }

    [HttpPost("availability")]
    public async Task<IActionResult> GetNotificationAvailabilityForResource([FromRoute] string environmentName, [FromBody] NotificationAvailabilityRequest request)
    {
        var result = await _altinn3Service.GetNotificationAvailabilityForResourceAsync(request, environmentName);
        return Ok(result);
    }
}
