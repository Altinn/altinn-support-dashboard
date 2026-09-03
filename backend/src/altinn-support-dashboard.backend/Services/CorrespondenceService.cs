
using System.Text.Json;
using altinn_support_dashboard.Server.Models.correspondence;
using altinn_support_dashboard.Server.Utils;
using Microsoft.IdentityModel.Tokens;

public class CorrespondenceService : ICorrespondenceService
{

    ICorrespondenceClient _client;
    ILogger<ICorrespondenceService> _logger;

    public CorrespondenceService(ICorrespondenceClient client, ILogger<ICorrespondenceService> logger)
    {
        _logger = logger;
        _client = client;
    }

    public async Task<CorrespondenceResponse> UploadCorrespondence(CorrespondenceUploadRequest uploadRequest)
    {
        if (uploadRequest.Recipients.Count != 1)
        {
            throw new BadRequestException("Exactly one recipient is required");
        }

        var recipient = uploadRequest.Recipients[0];
        if (!ValidationService.IsValidCorrespondenceRecipientUrn(recipient))
        {
            throw new BadRequestException($"Recipient:{recipient} is not a valid recipient URN");
        }

        ValidateAttachments(uploadRequest.AttachmentData);

        //Sets defualt values if none are given
        if (string.IsNullOrEmpty(uploadRequest.Correspondence.Content.MessageTitle))
        {
            uploadRequest.Correspondence.Content.MessageTitle = "Test Title";
        }

        if (string.IsNullOrEmpty(uploadRequest.Correspondence.Content.MessageBody))
        {
            uploadRequest.Correspondence.Content.MessageBody = "Test Body";
        }

        return await _client.UploadCorrespondence(uploadRequest);
    }

    private static void ValidateAttachments(List<CorrespondenceAttachmentData>? attachments)
    {
        if (attachments == null || attachments.Count < CorrespondenceAttachmentRules.MinAttachments)
        {
            throw new BadRequestException($"At least {CorrespondenceAttachmentRules.MinAttachments} attachment is required");
        }

        if (attachments.Count > CorrespondenceAttachmentRules.MaxAttachments)
        {
            throw new BadRequestException($"A maximum of {CorrespondenceAttachmentRules.MaxAttachments} attachments is allowed");
        }

        foreach (var attachment in attachments)
        {
            if (string.IsNullOrWhiteSpace(attachment.FileName))
            {
                throw new BadRequestException("Attachment filename is required");
            }

            var extension = Path.GetExtension(attachment.FileName).ToLowerInvariant();
            if (!CorrespondenceAttachmentRules.AllowedFileTypes.Contains(extension))
            {
                throw new BadRequestException($"Attachment type {extension} is not allowed");
            }

            if (attachment.Content == null || attachment.Content.Length == 0)
            {
                throw new BadRequestException($"Attachment {attachment.FileName} is empty");
            }
        }
    }

    public async Task<object> GetCorrespondenceStatus(string correspondenceId)
    {
        var result = await _client.GetCorrespondenseStatus(correspondenceId);
        var json = JsonSerializer.Deserialize<object>(result) ?? throw new Exception("Error serializing");
        return json;

    }
}
