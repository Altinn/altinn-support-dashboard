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

        public async Task<string> GetRolesAsync(string orgNumber)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://data.brreg.no/enhetsregisteret/api/enheter/{orgNumber}/roller");

            // Add headers to disable caching
            request.Headers.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue
            {
                NoCache = true,
                NoStore = true,
                MaxAge = TimeSpan.Zero,
                MustRevalidate = true
            };
            request.Headers.Pragma.Add(new System.Net.Http.Headers.NameValueHeaderValue("no-cache"));

            var client = _clientFactory.CreateClient();

            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                throw new HttpRequestException($"Failed to retrieve data from Brreg. Status code: {response.StatusCode}");
            }
        }
    }
}
