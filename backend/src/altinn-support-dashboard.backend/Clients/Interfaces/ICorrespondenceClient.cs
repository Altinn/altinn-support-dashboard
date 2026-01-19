

using altinn_support_dashboard.Server.Models.correspondence;

public interface ICorrespondenceClient
{
    Task<CorrespondenceResponse> UploadCorrespondence(CorrespondenceUploadRequest correspondenceRequest);
}
