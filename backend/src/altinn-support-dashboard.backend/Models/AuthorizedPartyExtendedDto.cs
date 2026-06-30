public class AuthorizedPartyExtendedDto
{
    public Guid? PartyUuid { get; set; }
    public int? PartyId { get; set; }
    public string? Name { get; set; }
    public string? OrganizationNumber { get; set; }
    public string? PersonId { get; set; }
    public string? Type { get; set; }
    public string? UnitType { get; set; }
    public bool? IsDeleted { get; set; }
    public List<string>? AuthorizedResources { get; set; }
    public List<string>? AuthorizedRoles { get; set; }
    public string[]? AuthorizedAccessPackages { get; set; }
    public List<AuthorizedInstanceExtendedDto>? AuthorizedInstances { get; set; }
    public List<AuthorizedPartyExtendedDto>? Subunits { get; set; }
}

public class AuthorizedInstanceExtendedDto
{
    public string? ResourceId { get; set; }
    public string? InstanceId { get; set; }
    public string? InstanceRef { get; set; }
}
