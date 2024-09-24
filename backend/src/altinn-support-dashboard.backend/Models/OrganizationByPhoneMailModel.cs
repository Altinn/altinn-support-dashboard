using System;
using System.Collections.Generic;

public class OrganizationByPhoneMail
{
    public string? Name { get; set; }
    public string? OrganizationNumber { get; set; }
    public string? Type { get; set; }
    public DateTime? LastChanged { get; set; }
    public DateTime? LastConfirmed { get; set; }
    public List<OrganizationLinkPhoneMail>? Links { get; set; }
}

public class OrganizationLinkPhoneMail
{
    public string? Rel { get; set; }
    public string? Href { get; set; }
    public string? Title { get; set; }
    public string? FileNameWithExtension { get; set; }
    public string? MimeType { get; set; }
    public bool? IsTemplated { get; set; }
    public bool? Encrypted { get; set; }
    public bool? SigningLocked { get; set; }
    public bool? SignedByDefault { get; set; }
    public int? FileSize { get; set; }
}
