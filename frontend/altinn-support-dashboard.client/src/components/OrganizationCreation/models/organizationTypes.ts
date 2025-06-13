export interface OrganizationFormData {
    shortName: string;
    fullName: string;
    websiteUrl: string;
    owners: string[];
    emailDomain: string;
    orgNumber: string;
    logoFile?: File | null;
}

export interface OrganizationFormErrors {
    shortName?: string;
    fullName?: string;
    websiteUrl?: string;
    owners?: string;
    emailDomain?: string;
    orgNumber?: string;
    logoFile?: string;
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
