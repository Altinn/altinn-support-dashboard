using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace altinn_support_dashboard.Server.Services
{
    public class AltinnApiService : IAltinnApiService
    {
        private readonly AltinnApiClient _client;

        public AltinnApiService(AltinnApiClient client)
        {
            _client = client;
        }

        public async Task<Organization> GetOrganizationInfo(string orgNumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            var result = await _client.GetOrganizationInfo(orgNumber);
            var organizationInfo = JsonSerializer.Deserialize<Organization>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return organizationInfo;
        }

        public async Task<List<OrganizationByPhoneMail>> GetOrganizationsByPhoneNumber(string phoneNumber)
        {
            if (!ValidationService.IsValidPhoneNumber(phoneNumber))
            {
                throw new ArgumentException("Telefonnummeret er ugyldig.");
            }

            var result = await _client.GetOrganizationsByPhoneNumber(phoneNumber);
            var organizations = JsonSerializer.Deserialize<List<OrganizationByPhoneMail>>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return organizations;
        }

        public async Task<List<OrganizationByPhoneMail>> GetOrganizationsByEmail(string email)
        {
            if (!ValidationService.IsValidEmail(email))
            {
                throw new ArgumentException("E-postadressen er ugyldig.");
            }

            var result = await _client.GetOrganizationsByEmail(email);
            var organizations = JsonSerializer.Deserialize<List<OrganizationByPhoneMail>>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return organizations;
        }

        public async Task<List<PersonalContact>> GetPersonalContacts(string orgNumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            var result = await _client.GetPersonalContacts(orgNumber);
            var personalContacts = JsonSerializer.Deserialize<List<PersonalContact>>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return personalContacts;
        }

        public async Task<string> GetPersonRoles(string subject, string reportee)
        {
            if (!ValidationService.IsValidSubjectOrReportee(subject) || !ValidationService.IsValidSubjectOrReportee(reportee))
            {
                throw new ArgumentException("Subject eller Reportee er ugyldig.");
            }

            return await _client.GetPersonRoles(subject, reportee);
        }

    }
}
