using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using System;
using System.Collections.Generic;
using System.Net.Http;
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

        public async Task<BrregOrgInfo> GetOrgInfoAsync(string orgNumber, string environmentName)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
            {
                throw new ArgumentException("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            if (!_validEnvironmentNames.Contains(environmentName))
            {
                throw new ArgumentException("Ugyldig miljønavn.");
            }

            try
            {
                // Use a direct approach with HttpClient instead
                using (var httpClient = new HttpClient())
                {
                    httpClient.BaseAddress = new Uri("https://data.brreg.no/");
                    
                    var requestUrl = $"enhetsregisteret/api/enheter/{orgNumber}";
                    var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
                    
                    // Add the Accept header
                    request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                    
                    var response = await httpClient.SendAsync(request);
                    response.EnsureSuccessStatusCode();
                    
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    
                    // Parse the JSON with JsonDocument to access specific properties
                    using (JsonDocument doc = JsonDocument.Parse(jsonResponse))
                    {
                        JsonElement root = doc.RootElement;
                        string navn = root.GetProperty("navn").GetString();
                        string orgnr = root.GetProperty("organisasjonsnummer").GetString();
                        
                        return new BrregOrgInfo 
                        {
                            OrganizationNumber = orgnr,
                            Name = navn
                        };
                    }
                }
            }
            catch (HttpRequestException ex)
            {
                throw new Exception($"Failed to retrieve organization information: {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                throw new Exception("Failed to parse the BRREG API response. The data format may have changed.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"An unexpected error occurred: {ex.Message}", ex);
            }
        }
    }
}
