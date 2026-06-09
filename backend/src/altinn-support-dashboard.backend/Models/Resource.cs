using System.Text.Json.Serialization;

namespace altinn_support_dashboard.Server.Models;

public class Resource
{
    [JsonPropertyName("identifier")]
    public string? Identifier { get; set; }

    [JsonPropertyName("title")]
    public Dictionary<string, string>? Title { get; set; }

    [JsonPropertyName("resourceReferences")]
    public List<ResourceReference>? ResourceReferences { get; set; }

    [JsonPropertyName("delegable")]
    public bool? Delegable { get; set; }

    [JsonPropertyName("visible")]
    public bool? Visible { get; set; }

    [JsonPropertyName("hasCompetentAuthority")]
    public HasCompetentAuthority? HasCompetentAuthority { get; set; }

    [JsonPropertyName("accessListMode")]
    public string? AccessListMode { get; set; }

    [JsonPropertyName("selfIdentifiedUserEnabled")]
    public bool? SelfIdentifiedUserEnabled { get; set; }

    [JsonPropertyName("enterpriseUserEnabled")]
    public bool? EnterpriseUserEnabled { get; set; }

    [JsonPropertyName("resourceType")]
    public string? ResourceType { get; set; }

    [JsonPropertyName("authorizationReference")]
    public List<AuthorizationReferenceAttribute>? AuthorizationReference { get; set; }

    [JsonPropertyName("isOneTimeConsent")]
    public bool? IsOneTimeConsent { get; set; }

    [JsonPropertyName("versionId")]
    public int? VersionId { get; set; }
}

public class ResourceReference
{
    [JsonPropertyName("referenceSource")]
    public string? ReferenceSource { get; set; }

    [JsonPropertyName("reference")]
    public string? Reference { get; set; }

    [JsonPropertyName("referenceType")]
    public string? ReferenceType { get; set; }
}

public class HasCompetentAuthority
{
    [JsonPropertyName("name")]
    public Dictionary<string, string>? Name { get; set; }

    [JsonPropertyName("organization")]
    public string? Organization { get; set; }

    [JsonPropertyName("orgcode")]
    public string? Orgcode { get; set; }
}

public class AuthorizationReferenceAttribute
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("value")]
    public string? Value { get; set; }
}