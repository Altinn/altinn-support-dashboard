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

        /// <summary>
        /// Henter detaljert informasjon om en organisasjon fra Brønnøysundregistrene
        /// </summary>
        /// <param name="orgNumber">Organisasjonsnummeret</param>
        /// <param name="environmentName">Miljøet å hente data fra</param>
        /// <returns>Detaljert informasjon om organisasjonen</returns>
        public async Task<object> GetEnhetsdetaljer(string orgNumber, string environmentName)
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
                var result = await _client.GetEnhetsdetaljer(orgNumber, environmentName);
                
                // Definerer klasse for å deserialisere Brreg API respons
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                
                // Deserialiserer organisasjonsinformasjonen fra Brreg
                var enhet = JsonSerializer.Deserialize<BrregEnhet>(result, options);
                
                // Plukker ut relevante data for organisasjonen
                var enhetsDetaljer = new 
                {
                    organisasjonsnummer = enhet.Organisasjonsnummer,
                    navn = enhet.Navn,
                    hjemmeside = enhet.Hjemmeside,
                    epostadresse = enhet.Epostadresse,
                    registreringsdatoEnhetsregisteret = enhet.RegistreringsdatoEnhetsregisteret,
                    forretningsadresse = enhet.Forretningsadresse != null ? new 
                    {
                        adresse = enhet.Forretningsadresse.Adresse?.FirstOrDefault(),
                        postnummer = enhet.Forretningsadresse.Postnummer,
                        poststed = enhet.Forretningsadresse.Poststed,
                        kommune = enhet.Forretningsadresse.Kommune,
                        land = enhet.Forretningsadresse.Land
                    } : null
                };
                
                return enhetsDetaljer;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Brreg API-kall feilet: {ex.Message}");
                throw;
            }
        }
        
        /// <summary>
        /// Oppretter en mock-respons for organisasjonsinformasjon
        /// </summary>
        /// <param name="orgNumber">Organisasjonsnummer</param>
        /// <returns>Et mock objekt med organisasjonsinformasjon</returns>
        private object CreateMockResponse(string orgNumber)
        {
            // Opprett en enkel mock-respons med grunnleggende informasjon
            return new
            {
                organisasjonsnummer = orgNumber,
                navn = $"Bedrift {orgNumber}",
                organisasjonsform = new { kode = "AS", beskrivelse = "Aksjeselskap" },
                hjemmeside = "https://www.example.com",
                registreringsdatoEnhetsregisteret = DateTime.Now.AddYears(-5).ToString("yyyy-MM-dd"),
                forretningsadresse = new
                {
                    adresse = "Testgata 123",
                    postnummer = "0123",
                    poststed = "OSLO",
                    kommunenummer = "0301",
                    kommune = "OSLO",
                    landkode = "NO",
                    land = "Norge"
                }
            };
        }
    }
}
