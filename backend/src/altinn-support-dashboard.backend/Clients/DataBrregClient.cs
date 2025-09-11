using altinn_support_dashboard.Server.Services.Interfaces;
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
        private readonly ILogger<IDataBrregService> _logger;

        public DataBrregClient(IHttpClientFactory clientFactory, IOptions<BrregConfiguration> brregConfiguration, ILogger<IDataBrregService> logger)
        {
            _clientFactory = clientFactory;
            _brregConfiguration = brregConfiguration.Value;
            _logger = logger;

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

                var requestUrl = $"enhetsregisteret/api/underenheter?overordnetEnhet={orgNumber}&registrertIMvaregisteret=false&size=10000";
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

        /// <summary>
        /// Henter detaljer om en bestemt enhet fra Brønnøysundregistrene
        /// </summary>
        /// <param name="orgNumber">Organisasjonsnummeret til enheten</param>
        /// <param name="environmentName">Miljøet å hente data fra (Production eller TT02)</param>
        /// <returns>JSON-streng med enhetsinformasjon</returns>
        public async Task<string> GetEnhetsdetaljer(string orgNumber, string environmentName)
        {
            try
            {
                var client = _clients[environmentName];
                var requestUrl = $"enhetsregisteret/api/enheter/{orgNumber}";
                Console.WriteLine($"Requesting URL: {client.BaseAddress}{requestUrl}");

                // Simplified HTTP request without problematic headers
                using (HttpClient httpClient = new HttpClient())
                {
                    // Set the base address for this request only
                    httpClient.BaseAddress = client.BaseAddress;
                    httpClient.Timeout = client.Timeout;

                    // Make a simple GET request
                    var response = await httpClient.GetAsync(requestUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        // Simple string reading without Base64 encoding issues
                        string result = await response.Content.ReadAsStringAsync();
                        Console.WriteLine("Brreg API returned successful response");
                        return result;
                    }
                    else
                    {
                        var responseBody = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"API call failed with status code {response.StatusCode}: {responseBody}");
                        throw new HttpRequestException($"Failed to retrieve organization details from Brreg. Status code: {response.StatusCode}, Response: {responseBody}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in GetEnhetsdetaljer: {ex.Message}");
                // We don't want mock data, so just throw the exception
                throw new Exception($"An error occurred while calling Brreg API for organization details: {ex.Message}", ex);
            }
        }



    }

    public class BrregConfiguration
    {
        public required EnvironmentConfiguration Production { get; set; }
        public required EnvironmentConfiguration TT02 { get; set; }
    }

    public class EnvironmentConfiguration
    {
        public required string BaseAddress { get; set; }
        public int Timeout { get; set; } = 100; // Default timeout in seconds
    }
}
