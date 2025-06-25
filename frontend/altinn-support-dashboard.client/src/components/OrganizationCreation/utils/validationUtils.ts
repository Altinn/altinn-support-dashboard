import { OrganizationFormData, OrganizationFormErrors } from "../models/organizationTypes";

/**
 * Validerer shortName-feltet
 * @param shortName Organisasjonens kortnavn (brukernavn)
 * @returns Feilmelding eller undefined hvis gyldig
 */
export const validateShortName = (shortName: string): string | undefined => {
    if (!shortName) {
        return "Kortnavn er påkrevd";
    }

    if (shortName.length < 2 || shortName.length > 5) {
        return "Kortnavn må være mellom 2 og 5 tegn";
    }

    // Må starte med en bokstav
    if (!/^[a-z]/.test(shortName)) {
        return "Kortnavn må starte med en liten bokstav";
    }

    // Må slutte med en bokstav eller et tall
    if (!/[a-z0-9]$/.test(shortName)) {
        return "Kortnavn må slutte med en liten bokstav eller et tall";
    }

    // Kan kun inneholde små bokstaver, tall og bindestrek
    if (!/^[a-z0-9-]+$/.test(shortName)) {
        return "Kortnavn kan kun inneholde små bokstaver, tall og bindestrek (-)";
    }

    return undefined;
};

/**
 * Validerer fullName-feltet
 * @param fullName Organisasjonens fulle navn
 * @returns Feilmelding eller undefined hvis gyldig
 */
export const validateFullName = (fullName: string): string | undefined => {
    if (!fullName) {
        return "Fullt navn er påkrevd";
    }

    // Kan ikke være kun store bokstaver
    if (fullName === fullName.toUpperCase() && fullName.match(/[A-Z]/)) {
        return "Fullt navn kan ikke være kun store bokstaver";
    }

    return undefined;
};

/**
 * Validerer websiteUrl-feltet
 * @param websiteUrl Organisasjonens nettside
 * @returns Feilmelding eller undefined hvis gyldig
 */
export const validateWebsiteUrl = (websiteUrl: string): string | undefined => {
    if (!websiteUrl) {
        return undefined; // Ikke påkrevd
    }

    // Tillatte tegn: a-zA-Z0-9-._/:
    if (!/^[a-zA-Z0-9-._/:]+$/.test(websiteUrl)) {
        return "Nettside kan kun inneholde tegn a-z, A-Z, 0-9, -, ., _, / og :";
    }

    try {
        // Legg til https:// prefix hvis det mangler
        const url = websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://') 
            ? websiteUrl 
            : `https://${websiteUrl}`;
        new URL(url);
        return undefined;
    } catch {
        return "Ugyldig URL-format";
    }
};

/**
 * Validerer emailDomain-feltet
 * @param emailDomain Organisasjonens e-postdomene
 * @returns Feilmelding eller undefined hvis gyldig
 */
export const validateEmailDomain = (emailDomain: string): string | undefined => {
    if (!emailDomain) {
        return undefined; // Ikke påkrevd
    }

    // Enkel domene-validering
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(emailDomain)) {
        return "Ugyldig e-postdomene";
    }

    return undefined;
};

/**
 * Validerer orgNumber-feltet
 * @param orgNumber Organisasjonens organisasjonsnummer
 * @returns Feilmelding eller undefined hvis gyldig
 */
export const validateOrgNumber = (orgNumber: string): string | undefined => {
    if (!orgNumber) {
        return undefined; // Ikke påkrevd
    }

    // Norsk organisasjonsnummer: 9 siffer
    if (orgNumber.trim() !== "" && !/^\d{9}$/.test(orgNumber)) {
        return "Organisasjonsnummer må bestå av 9 siffer";
    }

    return undefined;
};

/**
 * Validerer owners-feltet (gitea brukernavn)
 * @param owners Liste med brukernavn
 * @returns Feilmelding eller undefined hvis gyldig
 */
export const validateOwners = (owners: string[]): string | undefined => {
    if (!owners || owners.length === 0) {
        return undefined; // Ikke påkrevd
    }

    // Sjekk om alle brukernavn er gyldige
    for (const owner of owners) {
        if (!/^[a-zA-Z0-9-]+$/.test(owner)) {
            return "Brukernavn kan kun inneholde bokstaver, tall og bindestrek";
        }
    }

    return undefined;
};

/**
 * Validerer logoFile-feltet
 * @param file Opplastet fil
 * @returns Feilmelding eller undefined hvis gyldig
 */
export const validateLogoFile = (file: File | null): string | undefined => {
    if (!file) {
        return undefined; // Ikke påkrevd
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
        return "Logo må være i format JPG, PNG eller SVG";
    }

    // Maks filstørrelse: 1MB
    if (file.size > 1024 * 1024) {
        return "Logo kan ikke være større enn 1MB";
    }

    return undefined;
};

/**
 * Validerer hele skjemaet
 * @param formData Skjemadata
 * @param isSubmitted Angir om skjemaet er forsøkt sendt inn
 * @returns Objekt med feilmeldinger for hvert felt
 */
export const validateForm = (formData: OrganizationFormData, isSubmitted?: boolean): OrganizationFormErrors => {
    const errors: OrganizationFormErrors = {};

    // Alltid valider påkrevde felt
    const shortNameError = validateShortName(formData.shortName);
    if (shortNameError) errors.shortName = shortNameError;

    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) errors.fullName = fullNameError;

    // Kun valider valgfrie felt når skjemaet er sendt inn eller feltene har innhold
    if (isSubmitted || formData.websiteUrl) {
        const websiteUrlError = validateWebsiteUrl(formData.websiteUrl);
        if (websiteUrlError) errors.websiteUrl = websiteUrlError;
    }

    if (isSubmitted || formData.owners.length > 0) {
        const ownersError = validateOwners(formData.owners);
        if (ownersError) errors.owners = ownersError;
    }

    if (isSubmitted || formData.emailDomain) {
        const emailDomainError = validateEmailDomain(formData.emailDomain);
        if (emailDomainError) errors.emailDomain = emailDomainError;
    }

    if (isSubmitted || formData.orgNumber) {
        const orgNumberError = validateOrgNumber(formData.orgNumber);
        if (orgNumberError) errors.orgNumber = orgNumberError;
    }

    return errors;
};

/**
 * Sjekker om skjemaet har noen valideringsfeil
 * @param errors Objekt med feilmeldinger
 * @returns True hvis det finnes feil, false ellers
 */
export const hasErrors = (errors: OrganizationFormErrors): boolean => {
    return Object.keys(errors).length > 0;
};

/**
 * Sjekker om alle påkrevde felt er fylt ut
 * @param formData Skjemadata
 * @returns True hvis alle påkrevde felt er fylt ut, false ellers
 */
export const requiredFieldsPresent = (formData: OrganizationFormData): boolean => {
    // orgNumber er valgfritt, så vi sjekker bare shortName og fullName
    return !!(formData.shortName && formData.fullName);
};
