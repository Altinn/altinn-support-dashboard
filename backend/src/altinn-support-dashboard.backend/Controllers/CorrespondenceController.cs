
using System.Text.Json;
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
[Authorize(AzureRoles.Authenticated)]
[Authorize(AzureRoles.TT02)]
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
    /// <param name="requestJson">The correspondence upload request payload as JSON.</param>
    /// <param name="attachments">Uploaded attachment files.</param>
    /// <returns>
    /// A response containing the result of the correspondence upload.
    /// </returns>
    [HttpPost]
    [Route("upload")]
    [RequestSizeLimit(100_000_000)]
    public async Task<IActionResult> PostCorrespondenceUpload(
        [FromForm(Name = "request")] string requestJson,
        [FromForm(Name = "attachments")] List<IFormFile>? attachments)
    {
        if (string.IsNullOrWhiteSpace(requestJson))
        {
            throw new BadRequestException("Request payload is required");
        }

        var request = JsonSerializer.Deserialize<CorrespondenceUploadRequest>(
            requestJson,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        ) ?? throw new BadRequestException("Invalid request payload");

        request.AttachmentData = await MapAttachments(attachments);
        var response = await _service.UploadCorrespondence(request);

        return Ok(response);
    }

    [HttpGet("status/{correspondenceId}")]
    public async Task<IActionResult> GetCorrespondenceStatus(string correspondenceId)
    {
        var response = await _service.GetCorrespondenceStatus(correspondenceId);
        return Ok(response);
    }

    private static async Task<List<CorrespondenceAttachmentData>> MapAttachments(List<IFormFile>? attachments)
    {
        if (attachments == null || attachments.Count == 0)
        {
            return [];
        }

        var attachmentData = new List<CorrespondenceAttachmentData>();
        foreach (var attachment in attachments)
        {
            await using var stream = attachment.OpenReadStream();
            using var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream);

            attachmentData.Add(new CorrespondenceAttachmentData
            {
                FileName = attachment.FileName,
                Content = memoryStream.ToArray(),
                ContentType = attachment.ContentType
            });
        }

        return attachmentData;
    }
}
