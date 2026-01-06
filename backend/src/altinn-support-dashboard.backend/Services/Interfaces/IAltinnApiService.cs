using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Models;
using Models.altinn3Dtos;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    public interface IAltinnApiService
    {
        Task<string> GetOrganizationInfoAltinn3(string orgNumber, string environment);
        Task<Organization> GetOrganizationInfo(string orgNumber, string environment);
        Task<List<Organization>> GetOrganizationsByPhoneNumber(string phoneNumber, string environment);
        Task<List<Organization>> GetOrganizationsByEmail(string email, string environment);
        Task<List<PersonalContact>> GetPersonalContacts(string orgNumber, string environment);

        Task<List<OfficialContact>> GetOfficialContacts(string orgNumber, string environment);

        Task<List<Role>> GetPersonRoles(string subject, string reportee, string environment);

        Task<List<PersonalContact>> GetPersonalContactsByOrgAltinn3(string orgNumber, string environment);
        Task<List<PersonalContact>> GetPersonalContactsByEmailAltinn3(string email, string environment);
        Task<List<PersonalContact>> GetPersonalContactsByPhoneAltinn3(string phoneNumber, string environment);

        Task<List<NotificationAddressDto>> GetNotificationAddressesByOrgAltinn3(string orgNumber, string environment);
        Task<List<NotificationAddressDto>> GetNotificationAddressesByPhoneAltinn3(string phoneNumber, string environment);
        Task<List<NotificationAddressDto>> GetNotificationAddressesByEmailAltinn3(string email, string environment);
    }
}
