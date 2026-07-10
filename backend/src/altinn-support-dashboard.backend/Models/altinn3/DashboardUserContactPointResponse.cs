namespace Models.altinn3Dtos;

public class DashboardUserContactPointResponse
{
    public required string NationalIdentityNumber { get; set; }
    public bool IsReserved { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
    public DateTime? PhoneNumberLastUpdatedOrVerified { get; set; }
    public DateTime? EmailLastUpdatedOrVerified { get; set; }
}
