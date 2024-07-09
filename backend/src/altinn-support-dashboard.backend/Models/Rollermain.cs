namespace altinn_support_dashboard.Server.Models
{
    public class RollerMain
    {
        public List<Rollegrupper> Rollegrupper { get; set; }
        public Links Links { get; set; }

        public List<ApiRoller> ApiRoller { get; set; }
    }

    public class ApiRoller
    {
        public string Beskrivelse { get; set; }
        public List<string> EnhetNavn { get; set; }
        public string EnhetOrganisasjonsnummer { get; set; }
        public string EnhetOrganisasjonsformKode { get; set; }
        public string EnhetOrganisasjonsformBeskrivelse { get; set; }
        public string PersonFodselsdato { get; set; }
        public string PersonFornavn { get; set; }
        public string PersonMellomnavn { get; set; }
        public string PersonEtternavn { get; set; }
    }
    public class ApiRollerResponse
    {
        public List<ApiRoller> ApiRoller { get; set; }
    }
    public class Rollegrupper
    {
        public Type Type { get; set; }
        public string SistEndret { get; set; }
        public List<Roller> Roller { get; set; }
    }

    public class Type
    {
        public string Kode { get; set; }
        public string Beskrivelse { get; set; }
        public Links Links { get; set; }
    }

    public class Roller
    {
        public Type Type { get; set; }
        public Enhet Enhet { get; set; }
        public Person Person { get; set; }
        public bool Fratraadt { get; set; }
        public int Rekkefolge { get; set; }
    }

    public class Enhet
    {
        public string Organisasjonsnummer { get; set; }
        public Organisasjonsform Organisasjonsform { get; set; }
        public List<string> Navn { get; set; }
        public bool ErSlettet { get; set; }
        public Links Links { get; set; }
    }

    public class Organisasjonsform
    {
        public string Kode { get; set; }
        public string Beskrivelse { get; set; }
        public Links Links { get; set; }
    }

    public class Person
    {
        public string Fodselsdato { get; set; }
        public Navn Navn { get; set; }
        public bool ErDoed { get; set; }
    }

    public class Navn
    {
        public string Fornavn { get; set; }
        public string Mellomnavn { get; set; }
        public string Etternavn { get; set; }
    }

    public class Links
    {
        public Self Self { get; set; }
    }

    public class Self
    {
        public string Href { get; set; }
    }
}
