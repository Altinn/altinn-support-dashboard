export interface Organization {
    name: string;
    organizationNumber: string;
    type: string;
    lastChanged: string;
    lastConfirmed: string;
    _links: OrganizationLink[];
}

export interface OrganizationLink {
    rel: string;
    href: string;
    title: string;
    fileNameWithExtension: string;
    mimeType: string;
    isTemplated: boolean;
    encrypted: boolean;
    signingLocked: boolean;
    signedByDefault: boolean;
    fileSize: number;
}

export interface PersonalContact {
    personalContactId: string;
    name: string;
    socialSecurityNumber: string;
    mobileNumber: string;
    mobileNumberChanged: string;
    eMailAddress: string;
    eMailAddressChanged: string;
    _links: PersonalContactLink[];
}

export interface PersonalContactLink {
    rel: string;
    href: string;
    title: string;
    fileNameWithExtension: string;
    mimeType: string;
    isTemplated: boolean;
    encrypted: boolean;
    signingLocked: boolean;
    signedByDefault: boolean;
    fileSize: number;
}

export interface Subunit {
    navn: string;
    organisasjonsnummer: string;
    overordnetEnhet: string;
}

export interface ERRole {
    type: {
        kode: string;
        beskrivelse: string;
    };
    sistEndret: string;
    roller: {
        type: {
            kode: string;
            beskrivelse: string;
        };
        person: {
            fodselsdato: string;
            navn: {
                fornavn: string;
                mellomnavn: string | null;
                etternavn: string;
            };
            erDoed: boolean;
        };
        fratraadt: boolean;
    }[];
}