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
        public string Organisasjonsnummer { get; set; }

        [JsonPropertyName("navn")]
        public string Navn { get; set; }

        [JsonPropertyName("organisasjonsform")]
        public BrregOrganisasjonsform Organisasjonsform { get; set; }

        [JsonPropertyName("hjemmeside")]
        public string Hjemmeside { get; set; }

        [JsonPropertyName("registreringsdatoEnhetsregisteret")]
        public string RegistreringsdatoEnhetsregisteret { get; set; }

        [JsonPropertyName("forretningsadresse")]
        public BrregAdresse Forretningsadresse { get; set; }

        [JsonPropertyName("epostadresse")]
        public string Epostadresse { get; set; }

        [JsonPropertyName("telefon")]
        public string Telefon { get; set; }
    }

    /// <summary>
    /// Modell for organisasjonsform fra Brreg API
    /// </summary>
    public class BrregOrganisasjonsform
    {
        [JsonPropertyName("kode")]
        public string Kode { get; set; }

        [JsonPropertyName("beskrivelse")]
        public string Beskrivelse { get; set; }
    }

    /// <summary>
    /// Modell for adresse fra Brreg API
    /// </summary>
    public class BrregAdresse
    {
        [JsonPropertyName("adresse")]
        public List<string> Adresse { get; set; }

        [JsonPropertyName("postnummer")]
        public string Postnummer { get; set; }

        [JsonPropertyName("poststed")]
        public string Poststed { get; set; }

        [JsonPropertyName("kommune")]
        public string Kommune { get; set; }

        [JsonPropertyName("kommunenummer")]
        public string Kommunenummer { get; set; }

        [JsonPropertyName("land")]
        public string Land { get; set; }
    }
}
