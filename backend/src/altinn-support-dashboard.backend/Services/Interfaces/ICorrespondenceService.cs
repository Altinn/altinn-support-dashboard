

public interface ICorrespondenceService
{
    Task<string> UploadCorrespondence(CorrespondenceUploadRequest request);
}
