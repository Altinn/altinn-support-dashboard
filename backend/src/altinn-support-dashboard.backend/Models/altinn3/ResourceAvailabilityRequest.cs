namespace Models.altinn3Dtos;

public class ResourceAvailabilityRequest
{
	public required string NationalIdentityNumber { get; set; }
	public required string OrganizationNumber { get; set; }
	public required string ResourceId { get; set; }
	public string ActionOnResource { get; set; } = "read";
}
