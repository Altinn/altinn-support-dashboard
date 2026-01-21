using Models.altinn3Dtos;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface IAltinn3Service
{
    Task<string> GetOrganizationInfoAltinn3(string orgNumber, string environment);
    Task<List<PartyNameDto>> GetPartyNamesByOrgAltinn3(List<string> orgNumbers, string environment);

    Task<List<PersonalContact>> GetPersonalContactsByOrgAltinn3(string orgNumber, string environment);
    Task<List<PersonalContact>> GetPersonalContactsByEmailAltinn3(string email, string environment);
    Task<List<PersonalContact>> GetPersonalContactsByPhoneAltinn3(string phoneNumber, string environment);

    Task<List<NotificationAddressDto>> GetNotificationAddressesByOrgAltinn3(string orgNumber, string environment);
    Task<List<NotificationAddressDto>> GetNotificationAddressesByPhoneAltinn3(string phoneNumber, string environment);
    Task<List<NotificationAddressDto>> GetNotificationAddressesByEmailAltinn3(string email, string environment);

}
