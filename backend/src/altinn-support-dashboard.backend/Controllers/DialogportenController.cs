using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.dialogporten;
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
    private readonly ILogger<DialogportenController> _logger;

    public DialogportenController(IDialogportenService service, ITelemetryService telemetryService, ILogger<DialogportenController> logger)
    {
        _logger = logger;
        _service = service;
        _telemetryService = telemetryService;
    }

    [HttpGet("dialog/{*urn}")]
    public async Task<IActionResult> GetEmailNotificationsByOrderId([FromRoute] string environmentName, [FromRoute] string urn)
    {
        _logger.LogDebug(urn);
        if (!ValidationService.IsValidDialogInput(urn))
        {
            return BadRequest("The input needs to be in the format 	urn:altinn:dialog-id:{uuid}, urn:altinn:correspondence-id:{uuid}, urn:altinn:instance-id:{partyId}/{uuid} ");
        }

        DialogDto response;
        if (User.IsInRole(AzureRoles.DialogportenAdmin))
        {
            response = await _service.GetDialogById(urn, environmentName, true);
        }
        else
        {
            response = await _service.GetDialogById(urn, environmentName, false);
        }
        return Ok(response);
    }
}
