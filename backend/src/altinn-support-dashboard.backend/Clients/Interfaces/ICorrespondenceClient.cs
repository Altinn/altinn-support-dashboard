

using altinn_support_dashboard.Server.Models.correspondence;

public interface ICorrespondenceClient
{
    Task<string> UploadCorrespondence(CorrespondenceUploadRequest correspondenceRequest);
}
