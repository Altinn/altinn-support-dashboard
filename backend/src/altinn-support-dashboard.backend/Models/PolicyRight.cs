using System.Text.Json.Serialization;

namespace altinn_support_dashboard.Server.Models;

public class PolicyRight
{
    [JsonPropertyName("action")]
    public XacmlAttribute? Action { get; set; }

    [JsonPropertyName("resource")]
    public List<XacmlAttribute>? Resource { get; set; }

    [JsonPropertyName("subjects")]
    public List<PolicyRightSubject>? Subjects { get; set; }

    [JsonPropertyName("rightKey")]
    public string? RightKey { get; set; }

    [JsonPropertyName("subjectTypes")]
    public List<string>? SubjectTypes { get; set; }
}

public class PolicyRightSubject
{
    [JsonPropertyName("subjectAttributes")]
    public List<XacmlAttribute>? SubjectAttributes { get; set; }
}