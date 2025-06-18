using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace altinn_support_dashboard.Server.Services
{
    public class DataBrregClient
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly Dictionary<string, HttpClient> _clients = new();
        private readonly BrregConfiguration _brregConfiguration;

        public DataBrregClient(IHttpClientFactory clientFactory, IOptions<BrregConfiguration> brregConfiguration)
        {
            _clientFactory = clientFactory;
            _brregConfiguration = brregConfiguration.Value;

            InitClient(nameof(_brregConfiguration.Production), _brregConfiguration.Production);
            InitClient(nameof(_brregConfiguration.TT02), _brregConfiguration.TT02);
        }

        private void InitClient(string environmentName, EnvironmentConfiguration configuration)
        {
            var client = _clientFactory.CreateClient(environmentName);
            client.BaseAddress = new Uri(configuration.BaseAddress);
            client.Timeout = TimeSpan.FromSeconds(configuration.Timeout);

            _clients.Add(environmentName, client);
        }

        public async Task<string> GetRolesAsync(string orgNumber, string environmentName)
        {
            try
            {
                var client = _clients[environmentName];

                var requestUrl = $"enhetsregisteret/api/enheter/{orgNumber}/roller";
                Console.WriteLine($"Requesting URL: {client.BaseAddress}{requestUrl}");

                var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);

                request.Headers.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue
                {
                    NoCache = true,
                    NoStore = true,
                    MaxAge = TimeSpan.Zero,
                    MustRevalidate = true
                };
                request.Headers.Pragma.Add(new System.Net.Http.Headers.NameValueHeaderValue("no-cache"));

                var response = await client.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"Failed to retrieve data from Brreg. Status code: {response.StatusCode}, Response: {responseBody}");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while calling Brreg API: {ex.Message}", ex);
            }
        }

        public async Task<string> GetUnderenheter(string orgNumber, string environmentName)
        {
            try
            {
                var client = _clients[environmentName];

                var requestUrl = $"enhetsregisteret/api/underenheter?overordnetEnhet={orgNumber}&registrertIMvaregisteret=false";
                Console.WriteLine($"Requesting URL: {client.BaseAddress}{requestUrl}");

                var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);

                request.Headers.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue
                {
                    NoCache = true,
                    NoStore = true,
                    MaxAge = TimeSpan.Zero,
                    MustRevalidate = true
                };
                request.Headers.Pragma.Add(new System.Net.Http.Headers.NameValueHeaderValue("no-cache"));

                var response = await client.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"Failed to retrieve data from Brreg. Status code: {response.StatusCode}, Response: {responseBody}");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while calling Brreg API: {ex.Message}", ex);
            }
        }
        
        public async Task<string> GetOrgInfoAsync(string orgNumber, string environmentName)
        {
            try
            {
                var client = _clients[environmentName];

                // Direct URL to the BRREG API with no params
                var requestUrl = $"enhetsregisteret/api/enheter/{orgNumber}";

                var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
                
                // Set headers for fresh content
                request.Headers.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue
                {
                    NoCache = true,
                    NoStore = true,
                    MaxAge = TimeSpan.Zero,
                    MustRevalidate = true
                };
                request.Headers.Pragma.Add(new System.Net.Http.Headers.NameValueHeaderValue("no-cache"));

                // Ensure we're getting JSON
                request.Headers.Accept.Clear();
                request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                // Don't use the default encoding
                HttpResponseMessage response = await client.SendAsync(request);
                
                response.EnsureSuccessStatusCode();
                
                // Read content directly as UTF-8 string
                return await response.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException ex)
            {
                if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    throw new HttpRequestException("NotFound: Organization not found", ex);
                }
                throw new Exception($"Error communicating with BRREG API: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while calling Brreg API: {ex.Message}", ex);
            }
        }
    }

    public class BrregConfiguration
    {
        public EnvironmentConfiguration Production { get; set; }
        public EnvironmentConfiguration TT02 { get; set; }
    }

    public class EnvironmentConfiguration
    {
        public string BaseAddress { get; set; }
        public int Timeout { get; set; } = 100; // Default timeout in seconds
    }
}
