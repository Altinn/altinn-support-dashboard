using System.Text.Json.Serialization;

namespace Models.altinn3Dtos;

public class ResourceDetailsDto
{
    [JsonPropertyName("title")]
    public required ResourceTitle Title { get; set; }
    [JsonPropertyName("identifier")]
    public required string Identifier { get; set; }
}

public class ResourceTitle
{
    [JsonPropertyName("nb")]
    public string? NB { get; set; }
    [JsonPropertyName("nn")]
    public string? NN { get; set; }
    [JsonPropertyName("en")]
    public string? EN { get; set; }

    //Returns first found title or null if none are given
    public string? FindFirstTitle()
    {
        return NB ?? NN ?? EN ?? null;
    }
}
