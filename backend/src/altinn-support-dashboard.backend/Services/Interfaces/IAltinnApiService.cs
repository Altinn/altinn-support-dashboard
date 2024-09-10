using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Models;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    public interface IAltinnApiService
    {
        Task<Organization> GetOrganizationInfo(string orgNumber);
        Task<List<PersonalContact>> GetOrganizationsByPhoneNumber(string phoneNumber);
        Task<List<PersonalContact>> GetOrganizationsByEmail(string email);
        Task<List<PersonalContact>> GetPersonalContacts(string orgNumber);
    }
}
