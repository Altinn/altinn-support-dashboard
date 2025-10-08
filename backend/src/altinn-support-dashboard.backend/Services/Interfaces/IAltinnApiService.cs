using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Models;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    public interface IAltinnApiService
    {
        Task<Organization> GetOrganizationInfo(string orgNumber, string environment);
        Task<List<OrganizationByPhoneMail>> GetOrganizationsByPhoneNumber(string phoneNumber, string environment);
        Task<List<OrganizationByPhoneMail>> GetOrganizationsByEmail(string email, string environment);
        Task<List<PersonalContact>> GetPersonalContacts(string orgNumber, string environment);

        Task<List<OfficialContact>> GetOfficialContacts(string orgNumber, string environment);

        Task<string> GetPersonRoles(string subject, string reportee, string environment);
    }
}
