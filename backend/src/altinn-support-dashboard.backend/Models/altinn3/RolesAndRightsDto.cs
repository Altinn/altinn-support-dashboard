
namespace Models.altinn3Dtos;

public class RolesAndRightsDto
{
    public required string Type { get; set; }
    public required string Value { get; set; }
    public required PartyFilter[] PartyFilter { get; set; }
}

public class PartyFilter
{
    public required string Type { get; set; }
    public required string Value { get; set; }
}
