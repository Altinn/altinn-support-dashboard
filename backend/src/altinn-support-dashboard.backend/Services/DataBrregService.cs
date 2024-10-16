using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using System.Text.Json;

namespace altinn_support_dashboard.Server.Services
{
    public class DataBrregService : IDataBrregService
    {
        private readonly DataBrregClient _client;

        public DataBrregService(DataBrregClient client)
        {
            _client = client;
        }

        public async Task<ErRollerModel> GetRolesAsync(string orgNumber, string environmentName)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
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
            if (!ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            var result = await _client.GetUnderenheterAsync(orgNumber, environmentName);
            var underenheter = JsonSerializer.Deserialize<UnderenhetRootObject>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return underenheter;
        }
    }
}
