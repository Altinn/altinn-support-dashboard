

export interface ResourceSearchResult {
    identifier?: string;
    title?: Record<string, string>;
    description?: Record<string, string>;
    resourceType?: string;
    hasCompetentAuthority?: CompetentAuthority;
    delegable?: boolean;
    visible?: boolean;
}
export interface CompetentAuthority{
    name?: Record<string, string>;
    organization?: string;
    orgcode?: string;
}

export interface Resource {
    identifier?: string;
    title?: Record<string,string>;
    resourceReferances?: ResourceReference[];
    delegable?: boolean;
    visible?: boolean;
    hasCompetentAuthority?: CompetentAuthority;
    accessListMode?: string;
    selfIdentifiedUserEnabled?: boolean;
    enterpriseUserEnabled?: boolean;
    resourceType?: string;
    authorizationReference?: AuthorizationReferenceAttribute[];
    isOneTimeConsent?: boolean;
    versionId?: number;
}

export interface ResourceReference{
    referenceSource?: string;
    reference?: string;
    referenceType?: string;
}

export interface AuthorizationReferenceAttribute {
    id?: string;
    value?: string;
}

export interface PolicyRule {
    subject?: XacmlAttribute[];
    action?: XacmlAttribute;
    resource?: XacmlAttribute[];
}

export interface XacmlAttribute {
    type?: string;
    value?: string;
}
