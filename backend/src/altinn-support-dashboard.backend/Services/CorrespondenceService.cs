


public class CorrespondenceService : ICorrespondenceService
{

    ICorrespondenceClient _client;

    public CorrespondenceService(ICorrespondenceClient client)
    {
        _client = client;
    }

    public async Task<string> UploadCorrespondence(CorrespondenceUploadRequest uploadRequest)
    {
        return await _client.UploadCorrespondence(uploadRequest);
    }


}
