
using altinn_support_dashboard.Server.Models;

public class CorrespondenceUploadRequest
{
    public required Correspondence Correspondence { get; set; }
    public required List<string> Recipients { get; set; }
    public List<Guid>? ExistingAttachments { get; set; }
    public List<string>? Attachments { get; set; }
    public Guid? IdempotentKey { get; set; }

}
