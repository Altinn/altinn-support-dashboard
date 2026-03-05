namespace Models.altinn3Dtos;

public class RolesAndRightsDto
{
    public string? Name { get; set; }
    public string[]? AuthorizedAccessPackages { get; set; }
    public List<string>? AuthorizedResources { get; set; }
    public List<string>? AuthorizedRoles { get; set; }
    public string[]? AuthorizedInstances { get; set; }
}
