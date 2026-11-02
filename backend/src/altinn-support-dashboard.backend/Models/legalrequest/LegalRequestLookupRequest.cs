namespace Models.legalrequest;

public class LegalRequestLookupRequest
{
    public required string NationalIdentityNumber { get; set; }
    public string? OrganizationNumber { get; set; }
    public required DateTimeOffset From { get; set; }
    public required DateTimeOffset To { get; set; }
    public List<string>? Categories { get; set; }
    public required string CaseReference { get; set; }
}
