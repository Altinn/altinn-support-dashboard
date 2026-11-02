using System.Text.Json;
using System.Text.RegularExpressions;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.legalrequest;
using Security;

namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/{environmentName}/legalrequest")]
[Authorize(AzureRoles.Authenticated)]
//[Authorize(AzureRoles.LegalRequest)]
public class LegalRequestController : ControllerBase
{
    private const string XlsxContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private readonly ILegalRequestExportService _exportService;
    private readonly ITelemetryService _telemetryService;

    public LegalRequestController(ILegalRequestExportService exportService, ITelemetryService telemetryService)
    {
        _exportService = exportService;
        _telemetryService = telemetryService;
    }

    private string CurrentUserId => User.Identity?.Name ?? "unknown";

    [HttpPost("export")]
    public IActionResult Export([FromRoute] string environmentName, [FromBody] LegalRequestLookupRequest request)
    {
        if (!ValidationService.isValidSsn(request.NationalIdentityNumber))
        {
            return BadRequest("Not a valid nin");
        }
        if (!string.IsNullOrEmpty(request.OrganizationNumber) && !ValidationService.IsValidOrgNumberV2(request.OrganizationNumber))
        {
            return BadRequest("Not a valid organization number");
        }
        if (string.IsNullOrWhiteSpace(request.CaseReference))
        {
            return BadRequest("Case reference is required");
        }
        if (request.From >= request.To)
        {
            return BadRequest("From must be before to");
        }
        if (!MockUtils.IsMock(environmentName))
        {
            return StatusCode(StatusCodes.Status501NotImplemented, "Legal request is only available with mock data");
        }

        _telemetryService.TrackLegalRequestExport(request, CurrentUserId, environmentName);

        var responses = JsonSerializer.Deserialize<List<EventsResponse>>(MockUtils.Read("legalrequest-events.json"), JsonSerializerOptions.Web) ?? [];
        var exportedAt = DateTime.UtcNow;
        var file = _exportService.BuildWorkbook(request, CurrentUserId, exportedAt, responses);

        var fileReference = Regex.Replace(request.CaseReference, "[^A-Za-z0-9-]", "-");
        return File(file, XlsxContentType, $"rettslig-palegg-{fileReference}-{exportedAt:yyyyMMdd}.xlsx");
    }
}
