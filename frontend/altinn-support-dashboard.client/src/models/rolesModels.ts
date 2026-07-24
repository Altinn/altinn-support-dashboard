export interface AuthorizedInstanceDto {
  resourceId?: string;
  instanceId?: string;
  instanceRef?: string;
}

export interface RolesAndRights {
  name: string;
  organizationnumber: string;
  authorizedAccessPackages?: string[];
  authorizedResources?: string[];
  authorizedRoles?: string[];
  authorizedInstances?: AuthorizedInstanceDto[];
}

export interface RolesAndRightsRequest {
  value: string;
  partyFilter: PartyFilter[];
}

export interface PartyFilter {
  value: string;
}

export interface AuthorizedPartyIdentifiers {
  organizationNumber?: string;
  displayedSocialSecurityNumber?: string;
  ssnToken?: string;
  name: string;
}
