export interface Organization {
    Name: string;
    OrganizationNumber: string;
    Type: string;
    _links: {
        Rel: string;
        Href: string;
    }[];
}

export interface PersonalContact {
    PersonalContactId: string;
    Name: string;
    SocialSecurityNumber: string;
    MobileNumber: string;
    EMailAddress: string;
    _links: {
        Rel: string;
        Href: string;
    }[];
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