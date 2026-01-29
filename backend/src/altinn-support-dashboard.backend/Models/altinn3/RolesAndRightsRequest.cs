
namespace Models.altinn3Dtos;

public class RolesAndRightsRequest
{
    public string? Type { get; set; }
    public required string Value { get; set; }
    public required List<PartyFilter> PartyFilter { get; set; }
}

public class PartyFilter
{
    public string? Type { get; set; }
    public required string Value { get; set; }
}
