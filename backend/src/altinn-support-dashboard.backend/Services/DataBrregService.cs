using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace altinn_support_dashboard.Server.Services
{
    public class DataBrregService : IDataBrregService
    {
        private readonly DataBrregClient _client;
        private readonly List<string> _validEnvironmentNames = new List<string> { "Production", "TT02" };

        public DataBrregService(DataBrregClient client)
        {
            _client = client;
        }

        public async Task<ErRollerModel> GetRolesAsync(string orgNumber, string environmentName)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            if (!_validEnvironmentNames.Contains(environmentName))
            {
                throw new ArgumentException("Ugyldig miljønavn.");
            }

            var result = await _client.GetRolesAsync(orgNumber, environmentName);
            var rollerMain = JsonSerializer.Deserialize<ErRollerModel>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return rollerMain;
        }

        public async Task<UnderenhetRootObject> GetUnderenheter(string orgNumber, string environmentName)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            if (!_validEnvironmentNames.Contains(environmentName))
            {
                throw new ArgumentException("Ugyldig miljønavn.");
            }

            var result = await _client.GetUnderenheter(orgNumber, environmentName);
            var underenheter = JsonSerializer.Deserialize<UnderenhetRootObject>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return underenheter;
        }
    }
}
