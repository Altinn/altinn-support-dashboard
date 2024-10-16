using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace altinn_support_dashboard.Server.Services
{
    public class DataBrregClient
    {
        private readonly IHttpClientFactory _clientFactory;

        public DataBrregClient(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        private string GetBaseUrl(string environmentName)
        {
            return environmentName switch
            {
                "TT02" => "https://data.ppe.brreg.no",
                "Production" => "https://data.brreg.no",
                _ => throw new ArgumentException("Invalid environment name")
            };
        }

        public async Task<string> GetRolesAsync(string orgNumber, string environmentName)
        {
            var baseUrl = GetBaseUrl(environmentName);
            var client = _clientFactory.CreateClient();
            var requestUrl = $"{baseUrl}/enhetsregisteret/api/enheter/{orgNumber}/roller";

            try
            {
                var response = await client.GetAsync(requestUrl);
                response.EnsureSuccessStatusCode();

                return await response.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException ex)
            {
                throw new Exception($"Request to {requestUrl} failed: {ex.Message}");
            }
        }

        public async Task<string> GetUnderenheterAsync(string orgNumber, string environmentName)
        {
            var baseUrl = GetBaseUrl(environmentName);
            var client = _clientFactory.CreateClient();
            var requestUrl = $"{baseUrl}/enhetsregisteret/api/underenheter?overordnetEnhet={orgNumber}&registrertIMvaregisteret=false";

            try
            {
                var response = await client.GetAsync(requestUrl);
                response.EnsureSuccessStatusCode();

                return await response.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException ex)
            {
                throw new Exception($"Request to {requestUrl} failed: {ex.Message}");
            }
        }
    }
}
