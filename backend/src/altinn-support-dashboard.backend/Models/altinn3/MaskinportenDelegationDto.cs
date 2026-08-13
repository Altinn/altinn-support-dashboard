using System.Text.Json.Serialization;

namespace Models.altinn3Dtos;

public class MaskinportenDelegationDto
{
    [JsonPropertyName("consumer_org")]
    public required string ConsumerOrg { get; set; }
    [JsonPropertyName("supplier_org")]
    public required string SupplierOrg { get; set; }
    [JsonPropertyName("delegation_scheme_Id")]
    public string? DelegationSchemeId { get; set; }
    [JsonPropertyName("scopes")]
    public List<string>? Scopes { get; set; }
    [JsonPropertyName("created")]
    public DateTime? Created { get; set; }
    [JsonPropertyName("resourceid")]
    public string? ResourceId { get; set; }
}
