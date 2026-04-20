namespace Models.altinn3Dtos;

public class RolesAndRightsDto
{
    public string? Name { get; set; }
    public string[]? AuthorizedAccessPackages { get; set; }
    public List<string>? AuthorizedResources { get; set; }
    public List<string>? AuthorizedRoles { get; set; }
    public List<AuthorizedInstanceDto>? AuthorizedInstances { get; set; }
}

public class AuthorizedInstanceDto
{
    public string? ResourceId { get; set; }
    public string? InstanceId { get; set; }
    public string? InstanceRef { get; set; }
}
