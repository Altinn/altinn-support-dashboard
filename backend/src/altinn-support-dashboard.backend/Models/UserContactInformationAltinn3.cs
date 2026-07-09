namespace altinn_support_dashboard.Server.Models;

public class UserContactInformationAltinn3
{
    public string? NationalIdentityNumber { get; set; }
    public bool IsReserved { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
    public DateTime? PhoneNumberLastUpdatedOrVerified { get; set; }
    public DateTime? EmailLastUpdatedOrVerified { get; set; }
    public string? DisplayedSocialSecurityNumber { get; set; }
    public string? SsnToken { get; set; }
}
