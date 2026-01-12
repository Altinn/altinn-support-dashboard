using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.Compliance.Redaction;
using Models.altinn3Dtos;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace altinn_support_dashboard.Server.Services;

public class AltinnApiService : IAltinnApiService
{
    private readonly IAltinnApiClient _client;
    private readonly IAltinn3ApiClient _altinn3client;
    private readonly IDataBrregService _breggService;
    private readonly JsonSerializerOptions jsonOptions;
    private readonly ISsnTokenService _ssnTokenService;
    private readonly IRedactorProvider _redactorProvider;

    public AltinnApiService(IAltinnApiClient altinn2Client, IAltinn3ApiClient altinn3Client, IDataBrregService dataBrregService, ISsnTokenService ssnTokenService, IRedactorProvider redactorProvider)
    {
        _breggService = dataBrregService;
        _client = altinn2Client;
        _altinn3client = altinn3Client;
        _ssnTokenService = ssnTokenService;
        _redactorProvider = redactorProvider;
        jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task<Organization> GetOrganizationInfo(string orgNumber, string environment)
    {
        if (!ValidationService.IsValidOrgNumber(orgNumber))
        {
            throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
        }

        var result = await _client.GetOrganizationInfo(orgNumber, environment);
        var organizationInfo = JsonSerializer.Deserialize<Organization>(result, jsonOptions);
        if (organizationInfo == null)
        {
            throw new Exception("Ingen data funnet for det angitte organisasjonsnummeret.");
        }
        var breggResult = await _breggService.GetUnderenhet(orgNumber, environment);

        if (breggResult != null)
        {
            organizationInfo.HeadUnit = new Organization { OrganizationNumber = breggResult.overordnetEnhet, Name = breggResult.navn };
        }

        return organizationInfo;
    }

    public async Task<List<Organization>> GetOrganizationsByPhoneNumber(string phoneNumber, string environment)
    {
        if (!ValidationService.IsValidPhoneNumber(phoneNumber))
        {
            throw new ArgumentException("Telefonnummeret er ugyldig.");
        }


        //strips country codes plus the two digits after when searching
        phoneNumber = phoneNumber.Trim();
        string strippedPhoneNumber = Regex.Replace(phoneNumber, @"^\+\d{1,2}", "");


        var result = await _client.GetOrganizationsByPhoneNumber(strippedPhoneNumber, environment);
        var organizations = JsonSerializer.Deserialize<List<Organization>>(result, jsonOptions);
        if (organizations == null)
        {
            throw new Exception("Ingen data funnet for det angitte telefonnummeret.");
        }

        organizations = RemoveOrganizationDuplicates(organizations);
        return organizations;
    }

    public async Task<List<Organization>> GetOrganizationsByEmail(string email, string environment)
    {
        if (!ValidationService.IsValidEmail(email))
        {
            throw new ArgumentException("E-postadressen er ugyldig.");
        }

        var result = await _client.GetOrganizationsByEmail(email, environment);
        var organizations = JsonSerializer.Deserialize<List<Organization>>(result, jsonOptions);
        if (organizations == null)
        {
            throw new Exception("Ingen data funnet for den angitte e-postadressen.");
        }
        organizations = RemoveOrganizationDuplicates(organizations);
        return organizations;
    }

    private List<Organization> RemoveOrganizationDuplicates(List<Organization> organizations)
    {
        return organizations.GroupBy(o => o.OrganizationNumber).Select(o => o.First()).ToList();
    }

    public async Task<List<PersonalContact>> GetPersonalContacts(string orgNumber, string environment)
    {
        if (!ValidationService.IsValidOrgNumber(orgNumber))
        {
            throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
        }

        var result = await _client.GetPersonalContacts(orgNumber, environment);
        var personalContacts = JsonSerializer.Deserialize<List<PersonalContact>>(result, jsonOptions);
        if (personalContacts == null)
        {
            throw new Exception("Ingen data funnet for det angitte organisasjonsnummeret.");
        }

        foreach (var contact in personalContacts)
            {
                try {
                    if (!string.IsNullOrEmpty(contact.SocialSecurityNumber))
                    {
                        contact.DisplayedSocialSecurityNumber = _redactorProvider.GetRedactor(CustomDataClassifications.SSN).Redact(contact.SocialSecurityNumber);
                        contact.SsnToken = _ssnTokenService.GenerateSsnToken(contact.SocialSecurityNumber);
                        contact.SocialSecurityNumber = null; 
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error redacting: {ex.Message}");
                }
            }
        return personalContacts;
    }

    public async Task<List<Role>> GetPersonRoles(string subject, string reportee, string environment)
    {
        if (!ValidationService.IsValidSubjectOrReportee(subject) || !ValidationService.IsValidSubjectOrReportee(reportee))
        {
            throw new ArgumentException("Reportee or subject is invalid.");
        }

        var ssn = _ssnTokenService.GetSsnFromToken(subject);

        if (string.IsNullOrWhiteSpace(ssn))
        {
            ssn=subject; //If the subject isn't a token, like with manual role search, use it as is
        }
        Console.WriteLine($"Retrieved SSN: {ssn}");
        var result = await _client.GetPersonRoles(ssn, reportee, environment);

        var roles = JsonSerializer.Deserialize<List<Role>>(result, jsonOptions);

        return roles ?? new List<Role>();

    }

    public async Task<List<OfficialContact>> GetOfficialContacts(string orgNumber, string environment)
    {
        if (!ValidationService.IsValidOrgNumber(orgNumber))
        {
            throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
        }

        var result = await _client.GetOfficialContacts(orgNumber, environment);
        List<OfficialContact> officialContacts = JsonSerializer.Deserialize<List<OfficialContact>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        return officialContacts;
    }


    public async Task<List<PersonalContact>> GetPersonalContactsByOrgAltinn3(string orgNumber, string environment)
    {
        if (!ValidationService.IsValidOrgNumber(orgNumber))
        {
            throw new ArgumentException("Organizationnumber invalid. It must be 9 digits long.");
        }
        var result = await _altinn3client.GetPersonalContactsByOrg(orgNumber, environment);
        var contactsAltinn3 = JsonSerializer.Deserialize<List<PersonalContactDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        List<PersonalContact> contacts = mapPersonalContactAltinn3ToAltinn2(contactsAltinn3);
        return contacts;
    }

    public async Task<List<PersonalContact>> GetPersonalContactsByEmailAltinn3(string email, string environment)
    {
        if (!ValidationService.IsValidEmail(email))
        {
            throw new ArgumentException("email is invalid");
        }
        var result = await _altinn3client.GetPersonalContactsByEmail(email, environment);
        var contactsAltinn3 = JsonSerializer.Deserialize<List<PersonalContactDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");


        List<PersonalContact> contacts = mapPersonalContactAltinn3ToAltinn2(contactsAltinn3);
        return contacts;

    }

    public async Task<List<PersonalContact>> GetPersonalContactsByPhoneAltinn3(string phoneNumber, string environment)
    {
        if (!ValidationService.IsValidPhoneNumber(phoneNumber))
        {
            throw new ArgumentException("Phone number is invalid");
        }
        var result = await _altinn3client.GetPersonalContactsByPhone(phoneNumber, environment);
        var contactsAltinn3 = JsonSerializer.Deserialize<List<PersonalContactDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        List<PersonalContact> contacts = mapPersonalContactAltinn3ToAltinn2(contactsAltinn3);

        return contacts;

    }

    //helper function to map from altinn3 to 2, temporary (will switch over to altinn3 permenantly in future)
    private List<PersonalContact> mapPersonalContactAltinn3ToAltinn2(List<PersonalContactDto> altinn3Contacts)
    {

        List<PersonalContact> contacts = [];

        foreach (PersonalContactDto contact in altinn3Contacts)
        {
            var newContact = new PersonalContact
            {
                Name = contact.Name,
                EMailAddress = contact.Email,
                MobileNumber = contact.Phone,
                SocialSecurityNumber = contact.NationalIdentityNumber,
                MobileNumberChanged = contact.LastChanged,
                EMailAddressChanged = contact.LastChanged
            };

            contacts.Add(newContact);
        }
        return contacts;

    }

    public async Task<List<NotificationAddressDto>> GetNotificationAddressesByOrgAltinn3(string orgNumber, string environment)
    {
        if (!ValidationService.IsValidOrgNumber(orgNumber))
        {
            throw new ArgumentException("Organization number invalid. It must be 9 digits long.");
        }
        var result = await _altinn3client.GetNotificationAddressesByOrg(orgNumber, environment);
        var notificationAddresses = JsonSerializer.Deserialize<List<NotificationAddressDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        return notificationAddresses;
    }
    public async Task<List<NotificationAddressDto>> GetNotificationAddressesByPhoneAltinn3(string phoneNumber, string environment)
    {
        if (!ValidationService.IsValidPhoneNumber(phoneNumber))
        {
            throw new ArgumentException("Organization number invalid. It must be 9 digits long.");
        }
        var result = await _altinn3client.GetNotificationAddressesByPhone(phoneNumber, environment);
        var notificationAddresses = JsonSerializer.Deserialize<List<NotificationAddressDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        return notificationAddresses;
    }

    public async Task<List<NotificationAddressDto>> GetNotificationAddressesByEmailAltinn3(string email, string environment)
    {
        if (!ValidationService.IsValidEmail(email))
        {
            throw new ArgumentException("Organization number invalid. It must be 9 digits long.");
        }
        var result = await _altinn3client.GetNotificationAddressesByEmail(email, environment);
        var notificationAddresses = JsonSerializer.Deserialize<List<NotificationAddressDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        return notificationAddresses;
    }
}
