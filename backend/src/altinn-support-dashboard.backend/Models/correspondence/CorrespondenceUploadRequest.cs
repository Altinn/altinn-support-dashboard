


public class CorrespondenceUploadRequest
{
    public required Correspondence Correspondence { get; set; }
    // Might be other object
    public required string[] Recipients { get; set; }
    public string[]? ExistingAttachments { get; set; }
    public string[]? Attachments { get; set; }
    public string? IdempotentKey { get; set; }




}
