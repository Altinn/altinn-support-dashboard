using altinn_support_dashboard.Server.Services;
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
    private readonly IAuthorizationService _authorizationService;

    public DialogportenController(IDialogportenService service, ITelemetryService telemetryService, ILogger<DialogportenController> logger, IAuthorizationService authorizationService)
    {
        _logger = logger;
        _service = service;
        _telemetryService = telemetryService;
        _authorizationService = authorizationService;
    }

    [HttpGet("dialog/{*urn}")]
    public async Task<IActionResult> GetDialogByUrn([FromRoute] string environmentName, [FromRoute] string urn)
    {
        if (!ValidationService.IsValidDialogInput(urn))
        {
            return BadRequest("The input needs to be in the format 	urn:altinn:dialog-id:{uuid}, urn:altinn:correspondence-id:{uuid}, urn:altinn:instance-id:{partyId}/{uuid} ");
        }

        var authResult = await _authorizationService.AuthorizeAsync(User, AzureRoles.DialogportenAdmin);

        DialogDto? response = await _service.GetDialogByUrn(urn, environmentName, authResult.Succeeded);
        if (response == null)
        {
            return NotFound();
        }
        _telemetryService.TrackDialogSearchByUrn(urn, User.Identity?.Name ?? "unknown", environmentName);
        return Ok(response);
    }

    [HttpGet("dialogs/{dialogId}")]
    public async Task<IActionResult> GetDialogDetails([FromRoute] string environmentName, [FromRoute] string dialogId)
    {
        if (!ValidationService.IsValidGuid(dialogId))
        {
            return BadRequest("dialogId must be a valid GUID");
        }

        var authResult = await _authorizationService.AuthorizeAsync(User, AzureRoles.DialogportenAdmin);
        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        string? result = await _service.GetDialogDetails(dialogId, environmentName);
        if (result == null)
        {
            return NotFound();
        }
        return Content(result, "application/json");
    }
}
