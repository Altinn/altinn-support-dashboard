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
        if (uploadRequest.Recipients.Count <= 0)
        {
            throw new BadRequestException("Need at least one Recipient, this can be either a org or person");
        }
        List<string> newRecipients = new List<string>();

        foreach (string r in uploadRequest.Recipients)
        {
            if (ValidationService.IsValidOrgNumber(r))
            {
                // Adds in correct format
                string newRecipient = $"urn:altinn:organization:identifier-no:{r}";
                newRecipients.Add(newRecipient);
                continue;
            }
            if (ValidationService.isValidSsn(r))
            {
                string newRecipient = $"urn:altinn:person:identifier-no:{r}";
                newRecipients.Add(newRecipient);
                continue;
            }
            throw new BadRequestException($"Recipient:{r} is not a valid org or ssn");
        }

        uploadRequest.Recipients = newRecipients;

        //Sets defualt values if none are given
        if (uploadRequest.Correspondence.Content.MessageTitle.IsNullOrEmpty())
        {
            uploadRequest.Correspondence.Content.MessageTitle = "Test Title";
        }

        if (uploadRequest.Correspondence.Content.MessageBody.IsNullOrEmpty())
        {
            uploadRequest.Correspondence.Content.MessageBody = "Test Body";
        }

        return await _client.UploadCorrespondence(uploadRequest);
    }
}
