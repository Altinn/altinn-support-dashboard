using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Models;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    public interface IAltinnApiService
    {
        Task<Organization> GetOrganizationInfo(string orgNumber);
        Task<List<OrganizationByPhoneMail>> GetOrganizationsByPhoneNumber(string phoneNumber);
        Task<List<OrganizationByPhoneMail>> GetOrganizationsByEmail(string email);
        Task<List<PersonalContact>> GetPersonalContacts(string orgNumber);

        Task<string> GetPersonRoles(string subject, string reportee);
    }
}
