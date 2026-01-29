using System.Text.Json.Serialization;

public class Organization
{
    public string? Name { get; set; }
    public string? OrganizationNumber { get; set; }
    public Organization? HeadUnit { get; set; }

}
