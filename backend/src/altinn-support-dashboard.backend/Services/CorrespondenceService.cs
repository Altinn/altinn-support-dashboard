using altinn_support_dashboard.Server.Models.correspondence;

public class CorrespondenceService : ICorrespondenceService
{

    ICorrespondenceClient _client;
    ILogger<ICorrespondenceService> _logger;

    public CorrespondenceService(ICorrespondenceClient client, ILogger<ICorrespondenceService> logger)
    {
        _logger = logger;
        _client = client;
    }

    public async Task<string> UploadCorrespondence(CorrespondenceUploadRequest uploadRequest)
    {
        if (uploadRequest.Recipients.Count <= 0)
        {
            throw new Exception("Need at least one Recipient, this can be either a org or person");
        }
        return await _client.UploadCorrespondence(uploadRequest);
    }
}
