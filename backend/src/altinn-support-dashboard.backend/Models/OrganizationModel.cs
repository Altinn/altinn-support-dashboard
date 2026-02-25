using System.Text.Json.Serialization;

public class Organization
{
    public string? Name { get; set; }
    public string? UnitType { get; set; }
    public string? OrganizationNumber { get; set; }
    public Organization? HeadUnit { get; set; }
    public List<Organization>? SubUnits { get; set; }
    public bool? IsDeleted { get; set; }
}
