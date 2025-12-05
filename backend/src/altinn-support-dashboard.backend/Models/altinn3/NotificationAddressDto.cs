namespace Models.altinn3Dtos;

public class NotificationAddressDto
{
    public required int NotificationAddressId { get; set; }
    public required string CountryCode { get; set; }
    public required string Email { get; set; }
    public required string Phone { get; set; }
    public required string SourceOrgNumber { get; set; }
    public required string RequestedOrgNumber { get; set; }
    public DateTime? LastChanged { get; set; }
}