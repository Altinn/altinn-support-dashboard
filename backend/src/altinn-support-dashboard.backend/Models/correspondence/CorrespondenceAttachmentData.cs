namespace altinn_support_dashboard.Server.Models.correspondence;

public class CorrespondenceAttachmentData
{
    public required string FileName { get; set; }
    public required byte[] Content { get; set; }
    public string? ContentType { get; set; }
}
