namespace altinn_support_dashboard.Server.Models;


public class PersonalContactAltinn3
{
    public string? OrgNr { get; set; }
    public string? NationalIdentityNumber { get; set; }
    public string? Name { get; set; }
    public string? CountryCode { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public DateTime? LastChanged { get; set; }
    public string? DisplayedSocialSecurityNumber { get; set; }
    public string? SsnToken { get; set; }
}