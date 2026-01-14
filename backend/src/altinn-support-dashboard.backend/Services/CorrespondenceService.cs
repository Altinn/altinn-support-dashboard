


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
        return await _client.UploadCorrespondence(uploadRequest);
    }

}
