

public interface ICorrespondenceClient
{
    Task<string> UploadCorrespondence(CorrespondenceUploadRequest correspondenceRequest);
}
