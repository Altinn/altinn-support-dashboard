using System.Text.Json.Serialization;

namespace altinn_support_dashboard.Server.Models.correspondence;

public class CorrespondenceContent
{
    public string Language { get; set; } = "nb";
    public string? MessageTitle { get; set; }
    public string? MessageSummary { get; set; }
    public string? MessageBody { get; set; }

    public List<CorrespondenceAttachment>? Attachments { get; set; }


}
