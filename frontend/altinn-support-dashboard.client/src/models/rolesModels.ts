export interface AuthorizedInstanceDto {
  resourceId?: string;
  instanceId?: string;
  instanceRef?: string;
}

export interface RolesAndRights {
  name: string;
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
