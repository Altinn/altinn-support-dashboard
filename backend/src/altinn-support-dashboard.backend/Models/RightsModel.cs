public class Reportee
{
    public string? PartyUUID { get; set; }
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string? OrganizationNumber { get; set; }
    public string? OrganizationForm { get; set; }
    public string? Status { get; set; }
}

public class Right
{
    public int RightID { get; set; }
    public string? RightType { get; set; }
    public string? ServiceCode { get; set; }
    public int ServiceEditionCode { get; set; }
    public string? Action { get; set; }
    public string? RightSourceType { get; set; }
    public bool IsDelegatable { get; set; }
}

public class RightsModel
{
    public Subject? Subject { get; set; }
    public Reportee? Reportee { get; set; }
    public List<Right>? Rights { get; set; }
}

public class Subject
{
    public string? PartyUUID { get; set; }
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string? SocialSecurityNumber { get; set; }
}

