
using altinn_support_dashboard.Server.Models.correspondence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace AltinnSupportDashboard.Controllers;

/// <summary>
/// Provides API endpoints for managing correspondence operations.
/// </summary>
[ApiController]
[Route("api/correspondence")]
[Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
[Authorize(AnsattportenConstants.AnsattportenTT02AuthorizationPolicy)]
public class CorrespondenceController : ControllerBase
{
    private readonly ICorrespondenceService _service;


    public CorrespondenceController(ICorrespondenceService service)
    {
        _service = service;
    }


    /// <summary>
    /// Uploads correspondence data to the system.
    /// </summary>
    /// <param name="request">The correspondence upload request payload.</param>
    /// <returns>
    /// A response containing the result of the correspondence upload.
    /// </returns>
    [HttpPost]
    [Route("upload")]
    public async Task<IActionResult> PostCorrespondenceUpload(
        [FromBody] CorrespondenceUploadRequest request)
    {
        var response = await _service.UploadCorrespondence(request);

        return Ok(response);
    }

    [HttpGet("status/{correspondenceId}")]
    public async Task<IActionResult> GetCorrespondenceStatus(string correspondenceId)
    {
        var response = await _service.GetCorrespondenceStatus(correspondenceId);
        return Ok(response);
    }
}
