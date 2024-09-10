using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

public class PersonalContact
{
    public string PersonalContactId { get; set; }
    public string Name { get; set; }
    public string SocialSecurityNumber { get; set; }
    public string MobileNumber { get; set; }
    public DateTime MobileNumberChanged { get; set; }
    public string EMailAddress { get; set; }
    public DateTime EMailAddressChanged { get; set; }

    [JsonPropertyName("_links")]
    public List<PersonalContactLink> Links { get; set; }
}

public class PersonalContactLink
{
    public string Rel { get; set; }
    public string Href { get; set; }
    public string Title { get; set; }
    public string FileNameWithExtension { get; set; }
    public string MimeType { get; set; }
    public bool IsTemplated { get; set; }
    public bool Encrypted { get; set; }
    public bool SigningLocked { get; set; }
    public bool SignedByDefault { get; set; }
    public int FileSize { get; set; }
}
