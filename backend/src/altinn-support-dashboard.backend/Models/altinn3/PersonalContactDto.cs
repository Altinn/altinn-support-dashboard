
namespace Models.altinn3Dtos;

public class PersonalContactDto
{
    public string? OrganizationNumber { get; set; }
    public required string NationalIdentityNumber { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Phone { get; set; }
    public DateTime? LastChanged { get; set; }
}


