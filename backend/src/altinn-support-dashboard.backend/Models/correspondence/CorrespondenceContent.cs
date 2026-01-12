

public class CorrespondenceContent
{

    public required string Language { get; set; }
    public required string MessageTitle { get; set; }
    public string? MessageSummary { get; set; }
    public required string MessageBody { get; set; }

    public List<CorrespondenceAttachment>? Attatchments { get; set; }
}
