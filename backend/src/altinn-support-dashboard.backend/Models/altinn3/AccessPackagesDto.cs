public class AccessPackageGroupDto
{
    public string? Name { get; set; }
    public List<AccessPackageAreaDto>? Areas {get; set; }
}

public class AccessPackageAreaDto
{
    public string? Name { get; set; }
    public List<AccessPackageDto>? Packages {get; set; }
}

public class AccessPackageDto
{
    public string? Name { get; set; }
    public string? Urn { get; set; }
    public string? Description { get; set; }
}