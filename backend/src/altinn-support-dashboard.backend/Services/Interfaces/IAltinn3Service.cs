using altinn_support_dashboard.Server.Models;
using Models.altinn3Dtos;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface IAltinn3Service
{

    Task<Organization> GetOrganizationByOrgNoAltinn3(string orgNumber, string environment);
    Task<List<Organization>> GetOrganizationsByEmailAltinn3(string email, string environment);
    Task<List<Organization>> GetOrganizationsByPhoneAltinn3(string phonenumber, string environment);
    Task<List<PartyIdentifierDto>> GetOrganizationsIdentifiers(List<string> orgNumbers, string environment);
    Task<List<OrgPartyInfoDto>> GetOrganizationspartyInfo(List<int> partyIds, string environment);
    Task<List<Organization>> GetOrganizationsByOrgNumbers(List<string> orgNumbers, string environment);

    Task<List<PersonalContactAltinn3>> GetPersonalContactsByOrgAltinn3(string orgNumber, string environment);
    Task<List<PersonalContactDto>> GetPersonalContactsByEmailAltinn3(string email, string environment);
    Task<List<PersonalContactDto>> GetPersonalContactsByPhoneAltinn3(string phoneNumber, string environment);

    Task<List<NotificationAddressDto>> GetNotificationAddressesByOrgAltinn3(string orgNumber, string environment);
    Task<List<NotificationAddressDto>> GetNotificationAddressesByPhoneAltinn3(string phoneNumber, string environment);
    Task<List<NotificationAddressDto>> GetNotificationAddressesByEmailAltinn3(string email, string environment);

    Task<List<RolesAndRightsDto>> GetRolesAndRightsAltinn3(RolesAndRightsRequest rolesAndRights, string environment);
    Task<List<ResourceDetailsDto>> GetResourceListFromResourceRegistry(string environmentName);
    Task<List<string>> GetResourceNamesFromCodes(List<string> resourceCodes, string environmentName);

}




