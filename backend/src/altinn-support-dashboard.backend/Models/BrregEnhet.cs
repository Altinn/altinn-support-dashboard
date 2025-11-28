using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace altinn_support_dashboard.Server.Models
{
    /// <summary>
    /// Modell for enhetsdetaljer fra Brreg API
    /// </summary>
    public class BrregEnhet
    {
        [JsonPropertyName("organisasjonsnummer")]
        public required string Organisasjonsnummer { get; set; }

        [JsonPropertyName("navn")]
        public required string Navn { get; set; }

        [JsonPropertyName("organisasjonsform")]
        public required BrregOrganisasjonsform Organisasjonsform { get; set; }

        [JsonPropertyName("hjemmeside")]
        public string? Hjemmeside { get; set; }

        [JsonPropertyName("registreringsdatoEnhetsregisteret")]
        public string? RegistreringsdatoEnhetsregisteret { get; set; }

        [JsonPropertyName("forretningsadresse")]
        public BrregAdresse? Forretningsadresse { get; set; }

        [JsonPropertyName("epostadresse")]
        public string? Epostadresse { get; set; }

        [JsonPropertyName("telefon")]
        public string? Telefon { get; set; }

        [JsonPropertyName("aktivitet")]
        public List<string>? Aktivitet { get; set; }
    }

    /// <summary>
    /// Modell for organisasjonsform fra Brreg API
    /// </summary>
    public class BrregOrganisasjonsform
    {
        [JsonPropertyName("kode")]
        public required string Kode { get; set; }

        [JsonPropertyName("beskrivelse")]
        public required string Beskrivelse { get; set; }
    }

    /// <summary>
    /// Modell for adresse fra Brreg API
    /// </summary>
    public class BrregAdresse
    {
        [JsonPropertyName("adresse")]
        public required List<string> Adresse { get; set; }

        [JsonPropertyName("postnummer")]
        public required string Postnummer { get; set; }

        [JsonPropertyName("poststed")]
        public required string Poststed { get; set; }

        [JsonPropertyName("kommune")]
        public required string Kommune { get; set; }

        [JsonPropertyName("kommunenummer")]
        public string? Kommunenummer { get; set; }

        [JsonPropertyName("land")]
        public required string Land { get; set; }
    }
}
