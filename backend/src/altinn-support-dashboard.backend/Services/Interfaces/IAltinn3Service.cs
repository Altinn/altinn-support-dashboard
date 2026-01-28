using Models.altinn3Dtos;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface IAltinn3Service
{

    Task<PartyNameDto> GetOrganizationPartyNameAltinn3(string orgNumber, string environment);
    Task<Organization> GetOrganizationByOrgNoAltinn3(string orgNumber, string environment);
    Task<List<PartyNameDto>> GetPartyNamesByOrgAltinn3(List<string> orgNumbers, string environment);
    Task<List<Organization>> GetOrganizationsByEmailAltinn3(string email, string environment);
    Task<List<Organization>> GetOrganizationsByPhoneAltinn3(string phonenumber, string environment);

    Task<List<PersonalContactDto>> GetPersonalContactsByOrgAltinn3(string orgNumber, string environment);
    Task<List<PersonalContactDto>> GetPersonalContactsByEmailAltinn3(string email, string environment);
    Task<List<PersonalContactDto>> GetPersonalContactsByPhoneAltinn3(string phoneNumber, string environment);

    Task<List<NotificationAddressDto>> GetNotificationAddressesByOrgAltinn3(string orgNumber, string environment);
    Task<List<NotificationAddressDto>> GetNotificationAddressesByPhoneAltinn3(string phoneNumber, string environment);
    Task<List<NotificationAddressDto>> GetNotificationAddressesByEmailAltinn3(string email, string environment);

    Task<string> GetRolesAndRightsAltinn3(RolesAndRightsRequest rolesAndRights, string environment);

}
