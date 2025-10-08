using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using System.Text.Json;

namespace altinn_support_dashboard.Server.Services
{
    public class AltinnApiService : IAltinnApiService
    {
        private readonly AltinnApiClient _client;

        public AltinnApiService(AltinnApiClient client)
        {
            _client = client;
        }

        public async Task<Organization> GetOrganizationInfo(string orgNumber, string environment)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            var result = await _client.GetOrganizationInfo(orgNumber, environment);
            var organizationInfo = JsonSerializer.Deserialize<Organization>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });
            if (organizationInfo == null)
            {
                throw new Exception("Ingen data funnet for det angitte organisasjonsnummeret.");
            }
            return organizationInfo;
        }

        public async Task<List<OrganizationByPhoneMail>> GetOrganizationsByPhoneNumber(string phoneNumber, string environment)
        {
            if (!ValidationService.IsValidPhoneNumber(phoneNumber))
            {
                throw new ArgumentException("Telefonnummeret er ugyldig.");
            }

            var result = await _client.GetOrganizationsByPhoneNumber(phoneNumber, environment);
            var organizations = JsonSerializer.Deserialize<List<OrganizationByPhoneMail>>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });
            if (organizations == null)
            {
                throw new Exception("Ingen data funnet for det angitte telefonnummeret.");
            }
            return organizations;
        }

        public async Task<List<OrganizationByPhoneMail>> GetOrganizationsByEmail(string email, string environment)
        {
            if (!ValidationService.IsValidEmail(email))
            {
                throw new ArgumentException("E-postadressen er ugyldig.");
            }

            var result = await _client.GetOrganizationsByEmail(email, environment);
            var organizations = JsonSerializer.Deserialize<List<OrganizationByPhoneMail>>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });
            if (organizations == null)
            {
                throw new Exception("Ingen data funnet for den angitte e-postadressen.");
            }
            return organizations;
        }

        public async Task<List<PersonalContact>> GetPersonalContacts(string orgNumber, string environment)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            var result = await _client.GetPersonalContacts(orgNumber, environment);
            var personalContacts = JsonSerializer.Deserialize<List<PersonalContact>>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });
            if (personalContacts == null)
            {
                throw new Exception("Ingen data funnet for det angitte organisasjonsnummeret.");
            }
            return personalContacts;
        }

        public async Task<string> GetPersonRoles(string subject, string reportee, string environment)
        {
            if (!ValidationService.IsValidSubjectOrReportee(subject) || !ValidationService.IsValidSubjectOrReportee(reportee))
            {
                throw new ArgumentException("Subject eller Reportee er ugyldig.");
            }

            return await _client.GetPersonRoles(subject, reportee, environment);
        }

        public async Task<List<OfficialContact>> GetOfficialContacts(string orgNumber, string environment)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            var result = await _client.GetOfficialContacts(orgNumber, environment);
            List<OfficialContact> officialContacts = JsonSerializer.Deserialize<List<OfficialContact>>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return officialContacts;
        }

    }
}
