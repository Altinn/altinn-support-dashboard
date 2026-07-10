namespace Models.altinn3Dtos;

public class AuthorizedPartyIdentifiersDto
{
    public string? OrganizationNumber { get; set; }
    public string? NationalIdentityNumber { get; set; }
    public required string Name { get; set; }
}
