

public class CorrespondenceContent
{

    public required string Language { get; set; } = "no";
    public required string MessageTitle { get; set; } = "Test Title";
    public string? MessageSummary { get; set; }
    public required string MessageBody { get; set; } = "Test body";

    public List<CorrespondenceAttachment>? Attachments { get; set; }
}
