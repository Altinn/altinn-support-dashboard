using System.Text.Json.Serialization;

namespace altinn_support_dashboard.Server.Models;

public class PolicyRule
{
    [JsonPropertyName("subject")]
    public List<XacmlAttribute>? Subject { get; set; }

    [JsonPropertyName("action")]
    public XacmlAttribute? Action { get; set; }

    [JsonPropertyName("resource")]
    public List<XacmlAttribute>? Resource { get; set; }
}

public class XacmlAttribute
{
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("value")]
    public string? Value { get; set; }
}