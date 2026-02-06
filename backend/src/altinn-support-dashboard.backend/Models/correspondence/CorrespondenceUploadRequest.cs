namespace altinn_support_dashboard.Server.Models.correspondence;

public class CorrespondenceUploadRequest
{
    public Correspondence Correspondence { get; set; } = new Correspondence();
    public required List<string> Recipients { get; set; }
    public List<Guid>? ExistingAttachments { get; set; }
    public List<string>? Attachments { get; set; }
    public Guid? IdempotentKey { get; set; }
}
