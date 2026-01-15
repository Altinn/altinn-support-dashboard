namespace altinn_support_dashboard.Server.Models.correspondence;

public class CorrespondenceContent
{
    public string Language { get; set; } = "no";
    public string MessageTitle { get; set; } = "Test Title";
    public string? MessageSummary { get; set; }
    public string MessageBody { get; set; } = "Test body";

    public List<CorrespondenceAttachment>? Attachments { get; set; }
}
