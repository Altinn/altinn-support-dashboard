
namespace Models.altinn3Dtos;

public class OrgPartyInfoDto
{
    public required int PartyId { get; set; }
    public required Guid PartyUuid { get; set; }
    public int? PartyTypeName { get; set; }
    public string? UnitType { get; set; }
    public required string OrgNumber { get; set; }
    public required string Name { get; set; }
    public required bool IsDeleted { get; set; }
}
