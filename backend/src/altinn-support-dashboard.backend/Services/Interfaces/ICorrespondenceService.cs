

using altinn_support_dashboard.Server.Models.correspondence;

public interface ICorrespondenceService
{
    Task<string> UploadCorrespondence(CorrespondenceUploadRequest request);
}
