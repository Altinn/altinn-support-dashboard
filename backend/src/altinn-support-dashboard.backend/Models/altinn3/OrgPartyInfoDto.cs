
namespace Models.altinn3Dtos;

public class OrgPartyInfoDto
{
    public required string PartyId { get; set; }
    public required Guid PartyUuid { get; set; }
    public required string PartyTypeName { get; set; }
    public required string UnitType { get; set; }
    public required string OrgNumber { get; set; }
    public required string Name { get; set; }
    public required bool IsDeleted { get; set; }
}
