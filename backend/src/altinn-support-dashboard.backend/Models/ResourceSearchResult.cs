using System.Text.Json.Serialization;

namespace Models.altinn3Dtos;

public class ResourceSearchResult
{
    [JsonPropertyName("identifier")]
    public string? Identifier { get; set; }

    [JsonPropertyName("title")]
    public Dictionary<string, string>? Title { get; set; }

    [JsonPropertyName("description")]
    public Dictionary<string, string>? Description { get; set; }

    [JsonPropertyName("resourceType")]
    public string? ResourceType { get; set; }

    [JsonPropertyName("hasCompetentAuthority")]
    public CompetentAuthorityDto? CompetentAuthority { get; set; }
}

public class CompetentAuthorityDto
{
    [JsonPropertyName("name")]
    public Dictionary<string, string>? Name { get; set; }

    [JsonPropertyName("organizationNumber")]
    public string? OrganizationNumber { get; set; }
}