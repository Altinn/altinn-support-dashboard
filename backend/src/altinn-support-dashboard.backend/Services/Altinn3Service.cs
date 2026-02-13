using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.Compliance.Redaction;
using Microsoft.IdentityModel.Tokens;
using Models.altinn3Dtos;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace altinn_support_dashboard.Server.Services;

public class Altinn3Service : IAltinn3Service
{
    private readonly IAltinn3ApiClient _client;
    private readonly IDataBrregService _breggService;
    private readonly JsonSerializerOptions jsonOptions;
    private readonly ISsnTokenService _ssnTokenService;
    private readonly IRedactorProvider _redactorProvider;
    private readonly ILogger<IAltinn3Service> _logger;

    //temporary for altinn2 roles
    private readonly IAltinnApiService _altinn2Service;

    public Altinn3Service(IAltinn3ApiClient altinn3Client, IDataBrregService dataBrregService, ISsnTokenService ssnTokenService, IRedactorProvider redactorProvider, ILogger<IAltinn3Service> logger, IAltinnApiService altinnApiService)
    {
        _altinn2Service = altinnApiService;
        _logger = logger;
        _breggService = dataBrregService;
        _client = altinn3Client;
        _ssnTokenService = ssnTokenService;
        _redactorProvider = redactorProvider;
        jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };
    }


    public async Task<PartyNameDto> GetOrganizationPartyNameAltinn3(string orgNumber, string environment)
    {
        if (!ValidationService.IsValidOrgNumber(orgNumber))
        {
            throw new ArgumentException("Orgnumber invalid. It has to be 9 digits long");
        }

        var json = await _client.GetOrganizationInfo(orgNumber, environment);
        var result = JsonSerializer.Deserialize<PartyNamesResponseDto>(json, jsonOptions);

        if (result == null || string.IsNullOrEmpty(result.PartyNames[0].Name))
        {
            throw new Exception($"No data found for org with orgnumber: {orgNumber}");
        }



        return result.PartyNames[0];
    }


    public async Task<Organization> GetOrganizationByOrgNoAltinn3(string orgNumber, string environment)
    {
        PartyNameDto partyName = await GetOrganizationPartyNameAltinn3(orgNumber, environment);

        var organization = new Organization
        {
            OrganizationNumber = partyName.OrgNo,
            Name = partyName.Name
        };

        var breggResult = await _breggService.GetUnderenhet(orgNumber, environment);
        if (breggResult?.overordnetEnhet != null)
        {
            PartyNameDto headUnitPartyName = await GetOrganizationPartyNameAltinn3(breggResult.overordnetEnhet, environment);
            organization.HeadUnit = new Organization { OrganizationNumber = headUnitPartyName.OrgNo, Name = headUnitPartyName.Name };
        }
        return organization;
    }
    public async Task<List<Organization>> GetOrganizationsByEmailAltinn3(string email, string environment)
    {
        var personalContacts = await GetPersonalContactsByEmailAltinn3(email, environment);
        var notificationAddesses = await GetNotificationAddressesByEmailAltinn3(email, environment);
        var organizations = await GetOrganizationsFromProfileAltinn3(personalContacts, notificationAddesses, environment);


        return organizations;

    }

    public async Task<List<Organization>> GetOrganizationsByPhoneAltinn3(string phonenumber, string environment)
    {
        phonenumber = phonenumber.Trim();
        string strippedPhoneNumber = Regex.Replace(phonenumber, @"^\+\d{1,2}", "");
        var personalContacts = await GetPersonalContactsByPhoneAltinn3(strippedPhoneNumber, environment);
        var notificationAddesses = await GetNotificationAddressesByPhoneAltinn3(strippedPhoneNumber, environment);
        var organizations = await GetOrganizationsFromProfileAltinn3(personalContacts, notificationAddesses, environment);

        return organizations;
    }

    //Helper function to get organizations from personalcontacts and notificationaddresses
    private async Task<List<Organization>> GetOrganizationsFromProfileAltinn3(List<PersonalContactDto> personalContacts, List<NotificationAddressDto> notificationAddresses, string environment)
    {
        List<string> orgNumbers = [];

        // adds orgnumbers to list
        foreach (PersonalContactDto p in personalContacts)
        {
            if (p.OrgNr != null)
            {
                orgNumbers.Add(p.OrgNr);
            }
        }

        foreach (NotificationAddressDto n in notificationAddresses)
        {
            if (n.SourceOrgNumber != null && !orgNumbers.Contains(n.SourceOrgNumber))
            {
                orgNumbers.Add(n.SourceOrgNumber);
            }
        }
        List<PartyNameDto> partyNames = await GetPartyNamesByOrgAltinn3(orgNumbers, environment);
        List<Organization> organizations = [];

        foreach (PartyNameDto partyName in partyNames)
        {
            Organization newOrg = new Organization
            {
                OrganizationNumber = partyName.OrgNo,
                Name = partyName.Name
            };
            organizations.Add(newOrg);
        }
        return organizations;

    }


    public async Task<List<PartyNameDto>> GetPartyNamesByOrgAltinn3(List<string> orgNumbers, string environment)

    {
        foreach (string orgNumber in orgNumbers)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Orgnumber invalid. It has to be 9 digits long");
            }
        }
        var json = await _client.GetOrganizationsInfo(orgNumbers, environment);
        var result = JsonSerializer.Deserialize<PartyNamesResponseDto>(json, jsonOptions) ?? throw new Exception("Error serializing result");

        return result.PartyNames;
    }

    public async Task<List<PersonalContactAltinn3>> GetPersonalContactsByOrgAltinn3(string orgNumber, string environment)
    {
        if (!ValidationService.IsValidOrgNumber(orgNumber))
        {
            throw new ArgumentException("Organizationnumber invalid. It must be 9 digits long.");
        }
        var result = await _client.GetPersonalContactsByOrg(orgNumber, environment);
        var contactsAltinn3 = JsonSerializer.Deserialize<List<PersonalContactDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        var contacts = contactsAltinn3.Select(contact => new PersonalContactAltinn3
        {
            OrgNr = contact.OrgNr,
            NationalIdentityNumber = contact.NationalIdentityNumber,
            Name = contact.Name,
            Phone = contact.Phone,
            Email = contact.Email,
            LastChanged = contact.LastChanged,
        }).ToList();

        foreach (var contact in contacts)
        {
            try
            {
                if (!string.IsNullOrEmpty(contact.NationalIdentityNumber))
                {
                    contact.DisplayedSocialSecurityNumber = _redactorProvider.GetRedactor(CustomDataClassifications.SSN).Redact(contact.NationalIdentityNumber);
                    _logger.LogDebug($"Displayed ssn created {contact.DisplayedSocialSecurityNumber}");
                    contact.SsnToken = _ssnTokenService.GenerateSsnToken(contact.NationalIdentityNumber);
                    contact.NationalIdentityNumber = null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error redacting: {ex.Message}");
            }
        }

        return contacts;
    }

    public async Task<List<PersonalContactDto>> GetPersonalContactsByEmailAltinn3(string email, string environment)
    {
        if (!ValidationService.IsValidEmail(email))
        {
            throw new ArgumentException("email is invalid");
        }
        var result = await _client.GetPersonalContactsByEmail(email, environment);
        var contactsAltinn3 = JsonSerializer.Deserialize<List<PersonalContactDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");


        return contactsAltinn3;

    }

    public async Task<List<PersonalContactDto>> GetPersonalContactsByPhoneAltinn3(string phoneNumber, string environment)
    {
        if (!ValidationService.IsValidPhoneNumber(phoneNumber))
        {
            throw new ArgumentException("Phone number is invalid");
        }

        var result = await _client.GetPersonalContactsByPhone(phoneNumber, environment);
        var contactsAltinn3 = JsonSerializer.Deserialize<List<PersonalContactDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");


        return contactsAltinn3;

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
        var result = await _client.GetNotificationAddressesByOrg(orgNumber, environment);
        var notificationAddresses = JsonSerializer.Deserialize<List<NotificationAddressDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        return notificationAddresses;
    }
    public async Task<List<NotificationAddressDto>> GetNotificationAddressesByPhoneAltinn3(string phoneNumber, string environment)
    {
        if (!ValidationService.IsValidPhoneNumber(phoneNumber))
        {
            throw new ArgumentException("Organization number invalid. It must be 9 digits long.");
        }
        phoneNumber = phoneNumber.Trim();
        string strippedPhoneNumber = Regex.Replace(phoneNumber, @"^\+\d{1,2}", "");
        var result = await _client.GetNotificationAddressesByPhone(strippedPhoneNumber, environment);
        var notificationAddresses = JsonSerializer.Deserialize<List<NotificationAddressDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        return notificationAddresses;
    }

    public async Task<List<NotificationAddressDto>> GetNotificationAddressesByEmailAltinn3(string email, string environment)
    {
        if (!ValidationService.IsValidEmail(email))
        {
            throw new ArgumentException("Organization number invalid. It must be 9 digits long.");
        }
        var result = await _client.GetNotificationAddressesByEmail(email, environment);
        var notificationAddresses = JsonSerializer.Deserialize<List<NotificationAddressDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        return notificationAddresses;
    }

    public async Task<List<RolesAndRightsDto>> GetRolesAndRightsAltinn3(RolesAndRightsRequest rolesAndRights, string environment)
    {
        var ssn = _ssnTokenService.GetSsnFromToken(rolesAndRights.Value);


        if (string.IsNullOrWhiteSpace(ssn))
        {
            ssn = rolesAndRights.Value.Trim(); //If the subject isn't a token, use it as is
        }

        rolesAndRights.Value = ssn;
        rolesAndRights.Type = getTypeFromValue(ssn);

        foreach (PartyFilter party in rolesAndRights.PartyFilter)
        {
            party.Type = getTypeFromValue(party.Value);
        }

        var result = await _client.GetRolesAndRightsAltinn3(rolesAndRights, environment);
        var roles = JsonSerializer.Deserialize<List<RolesAndRightsDto>>(result, jsonOptions) ?? throw new Exception("Deserialization not valid");

        //Temporary for altinn2 roles, will be removed when altinn2 roles are deprecated
        if (roles.Count >= 1)
        {
            var altinn2Roles = await _altinn2Service.GetPersonRoles(rolesAndRights.Value.Replace(" ", ""), rolesAndRights.PartyFilter[0].Value.Replace(" ", ""), environment);
            if (altinn2Roles != null)
            {
                List<string> altinn2RolesList = [];
                foreach (Role role in altinn2Roles)
                {
                    if (!string.IsNullOrEmpty(role.RoleName) && role.RoleDefinitionCode != "Rights")
                    {
                        altinn2RolesList.Add(role.RoleName);
                    }
                }
                roles[0].AuthorizedRoles = altinn2RolesList;
            }



        }
        return roles;
    }
    private string getTypeFromValue(string value)
    {
        string trimmedValued = value.Replace(" ", "");
        if (ValidationService.isValidSsn(trimmedValued))
        {
            return "urn:altinn:person:identifier-no";
        }
        else if (ValidationService.IsValidOrgNumber(trimmedValued))
        {
            return "urn:altinn:organization:identifier-no";
        }
        throw new Exception("Not a valid format, needs to be either a orgnumber or ssn");
    }

}
