namespace Models.altinn3Dtos;

public class AuthorizedPartyDto
{
    public string? Name { get; set; }
    public string? OrganizationNumber { get; set; }
    public string[]? AuthorizedAccessPackages { get; set; }
    public List<string>? AuthorizedResources { get; set; }
    public List<string>? AuthorizedRoles { get; set; }
    public List<AuthorizedInstanceDto>? AuthorizedInstances { get; set; }
    public List<AuthorizedPartyDto>? Subunits { get; set; }
}
