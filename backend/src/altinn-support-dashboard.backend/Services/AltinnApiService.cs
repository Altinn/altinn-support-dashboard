using System.Text.Json;
using System.Text.RegularExpressions;

namespace altinn_support_dashboard.Server.Services
{
    public class AltinnApiService
    {
        private readonly AltinnApiClient _client;

        public AltinnApiService(AltinnApiClient client)
        {
            _client = client;
        }

        public async Task<string> GetOrganizationInfo(string orgNumber)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || orgNumber.Length != 9 || !long.TryParse(orgNumber, out _))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            var result = await _client.GetOrganizationInfo(orgNumber);
            var organizationInfo = JsonSerializer.Deserialize<string>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return organizationInfo;
        }

        public async Task<string> GetOrganizationsByPhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber) || !ValidationService.IsValidPhoneNumber(phoneNumber))
            {
                throw new ArgumentException("Telefonnummeret er ugyldig. Det må være 8 sifre langt.");
            }

            var result = await _client.GetOrganizationsByPhoneNumber(phoneNumber);
            var organizations = JsonSerializer.Deserialize<string>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return organizations;
        }

        public async Task<string> GetOrganizationsByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email) || !ValidationService.IsValidEmail(email))
            {
                throw new ArgumentException("E-postadressen er ugyldig.");
            }

            var result = await _client.GetOrganizationsByEmail(email);
            var organizations = JsonSerializer.Deserialize<string>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return organizations;
        }

        public async Task<string> GetPersonalContacts(string orgNumber)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            var result = await _client.GetPersonalContacts(orgNumber);
            var personalContacts = JsonSerializer.Deserialize<string>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return personalContacts;
        }

    }
}
