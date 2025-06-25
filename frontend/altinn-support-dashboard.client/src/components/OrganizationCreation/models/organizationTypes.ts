export interface OrganizationFormData {
    shortName: string;
    fullName: string;
    websiteUrl: string;
    owners: string[];
    description: string;
    orgNumber: string;
    emailDomain: string;
}

export interface OrganizationFormErrors {
    shortName?: string;
    fullName?: string;
    websiteUrl?: string;
    owners?: string;
    description?: string;
    orgNumber?: string;
    emailDomain?: string;
    general?: string;
}

export interface OrganizationCreationResponse {
    success: boolean;
    message: string;
    organizationId?: number;
    organizationName?: string;
}

export interface OrganizationCreationProps {
    environment: string;
}

export interface BrregSearchResult {
    orgNumber: string;
    name: string;
}

export interface BrregSearchResponse {
    results: BrregSearchResult[];
    message?: string;
}

export interface BrregEnhetsdetaljer {
    organisasjonsnummer: string;
    navn: string;
    hjemmeside?: string;
    epostadresse?: string; // Legger til epostadresse fra Brreg API
    aktivitet?: string[]; // Aktivitet beskrivelse fra Brreg API
    slettedato?: string;
    registreringsdatoEnhetsregisteret?: string;
    registrertIFrivillighetsregisteret?: boolean;
    registrertIMvaregisteret?: boolean;
    frivilligRegistrertIMvaregisteret?: boolean;
    registrertIForetaksregisteret?: boolean;
    registrertIStiftelsesregisteret?: boolean;
    konkurs?: boolean;
    underAvvikling?: boolean;
    underTvangsavviklingEllerTvangsopplosning?: boolean;
    postadresse?: {
        adresse?: string[];
        postnummer?: string;
        poststed?: string;
        landkode?: string;
        land?: string;
    };
    naeringskode1?: {
        beskrivelse?: string;
        kode?: string;
    };
    forretningsadresse?: {
        adresse?: string[];
        postnummer?: string;
        poststed?: string;
        kommunenummer?: string;
        kommune?: string;
        landkode?: string;
        land?: string;
    };
}
