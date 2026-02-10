using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Models;
using Models.altinn3Dtos;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
   public interface IAltinnApiService
   {
      Task<Organization> GetOrganizationInfo(string orgNumber, string environment);
      Task<List<Organization>> GetOrganizationsByPhoneNumber(string phoneNumber, string environment);
      Task<List<Organization>> GetOrganizationsByEmail(string email, string environment);
      Task<List<PersonalContact>> GetPersonalContacts(string orgNumber, string environment);

      Task<List<OfficialContact>> GetOfficialContacts(string orgNumber, string environment);

      Task<List<Role>> GetPersonRoles(string subject, string reportee, string environment);
   }
}
