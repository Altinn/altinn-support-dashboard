using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/{environmentName}/dialogporten")]
[Authorize(AzureRoles.Authenticated)]
[Authorize(AzureRoles.Developer)]
public class DialogportenController : ControllerBase
{
    private readonly IDialogportenService _service;
    private readonly ITelemetryService _telemetryService;

    public DialogportenController(IDialogportenService service, ITelemetryService telemetryService)
    {
        _service = service;
        _telemetryService = telemetryService;
    }

    [HttpGet("dialog/{urn}")]
    public async Task<IActionResult> GetEmailNotificationsByOrderId([FromRoute] string environmentName, [FromRoute] string urn)
    {
        var response = await _service.GetDialogById(urn, environmentName);
        return Ok(response);
    }
}
