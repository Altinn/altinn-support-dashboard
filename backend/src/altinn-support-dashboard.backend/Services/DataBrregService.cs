using altinn_support_dashboard.Server.Models;
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

        public async Task<RollerMain> GetRolesAsync(string orgNumber)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || orgNumber.Length != 9 || !long.TryParse(orgNumber, out _))
            {
                throw new ArgumentException("ID must be exactly 9 digits.");
            }

            var result = await _client.GetRolesAsync(orgNumber);
            var rollerMain = JsonSerializer.Deserialize<RollerMain>(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });

            return rollerMain;
        }
    }
}
