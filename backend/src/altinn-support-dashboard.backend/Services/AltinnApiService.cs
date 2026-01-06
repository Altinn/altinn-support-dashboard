using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using Microsoft.AspNetCore.Http.Json;
using Models.altinn3Dtos;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace altinn_support_dashboard.Server.Services;

public class AltinnApiService : IAltinnApiService
{
    private readonly IAltinnApiClient _client;
    private readonly IAltinn3ApiClient _altinn3client;
    private readonly JsonSerializerOptions jsonOptions;

    public AltinnApiService(IAltinnApiClient altinn2Client, IAltinn3ApiClient altinn3Client)
    {
        _client = altinn2Client;
        _altinn3client = altinn3Client;

        jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };
    }


    public async Task<string> GetOrganizationInfoAltinn3(string orgNumber, string environment)
    {
        if (!ValidationService.IsValidOrgNumber(orgNumber))
        {
            throw new ArgumentException("Orgnumber invalid. It has to be 9 digits long");
        }

        var result = await _altinn3client.GetOrganizationInfo(orgNumber, environment);

        if (result == null)
        {
            throw new Exception($"No data found for org with orgnumber: {orgNumber}");
        }
        return result;
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
        return personalContacts;
    }

    public async Task<List<Role>> GetPersonRoles(string subject, string reportee, string environment)
    {
        if (!ValidationService.IsValidSubjectOrReportee(subject) || !ValidationService.IsValidSubjectOrReportee(reportee))
        {
            throw new ArgumentException("Subject eller Reportee er ugyldig.");
        }

        var result = await _client.GetPersonRoles(subject, reportee, environment);

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
