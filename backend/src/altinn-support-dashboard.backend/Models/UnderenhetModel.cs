using System;
using System.Collections.Generic;

public class Links
{
    public Self? self { get; set; }
    public OverordnetEnhet? overordnetEnhet { get; set; }
}

public class Self
{
    public string? href { get; set; }
}

public class OverordnetEnhet
{
    public string? href { get; set; }
}

public class Organisasjonsform
{
    public string? kode { get; set; }
    public string? beskrivelse { get; set; }
    public Links? _links { get; set; }
}

public class Naeringskode
{
    public string? kode { get; set; }
    public string? beskrivelse { get; set; }
}

public class Adresse
{
    public string? land { get; set; }
    public string? landkode { get; set; }
    public string? postnummer { get; set; }
    public string? poststed { get; set; }
    public List<string>? adresse { get; set; }
    public string? kommune { get; set; }
    public string? kommunenummer { get; set; }
}

public class UnderEnhet
{
    public string? organisasjonsnummer { get; set; }
    public string? navn { get; set; }
    public Organisasjonsform? organisasjonsform { get; set; }
    public string? hjemmeside { get; set; }
    public string? registreringsdatoEnhetsregisteret { get; set; }
    public bool? registrertIMvaregisteret { get; set; }
    public Naeringskode? naeringskode1 { get; set; }
    public int? antallAnsatte { get; set; }
    public bool? harRegistrertAntallAnsatte { get; set; }
    public string? overordnetEnhet { get; set; }
    public string? oppstartsdato { get; set; }
    public string? datoEierskifte { get; set; }
    public Adresse? beliggenhetsadresse { get; set; }
    public Adresse? postadresse { get; set; }
    public Links? _links { get; set; }
}

public class Embedded
{
    public List<UnderEnhet>? underenheter { get; set; }
}

public class Page
{
    public int? size { get; set; }
    public int? totalElements { get; set; }
    public int? totalPages { get; set; }
    public int? number { get; set; }
}

public class UnderenhetRootObject
{
    public Embedded? _embedded { get; set; }
    public Links? _links { get; set; }
    public Page? page { get; set; }
}
