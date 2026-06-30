public class AuthorizedPartiesQueryParams
{
    public bool IncludeAltinn2 { get; set; } = false;
    public bool IncludeAltinn3 { get; set; } = true;
    public bool IncludeRoles { get; set; } = true;
    public bool IncludeAccessPackages { get; set; } = false;
    public bool IncludeResources { get; set; } = true;
    public bool IncludeInstances { get; set; } = false;
    public List<string> AnyOfResourceIds { get; set; } = [];
}
