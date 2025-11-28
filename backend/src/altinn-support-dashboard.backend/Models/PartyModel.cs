
namespace altinn_support_dashboard.Server.Models;

public class PartyModel
{
    public required string PartyUuid { get; set; }
    public string? OrgNumber { get; set; }
    public string? Ssn { get; set; }
    public string? Name { get; set; }
    public PartyPerson? Person { get; set; }
}


public class PartyPerson
{

    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }

}


