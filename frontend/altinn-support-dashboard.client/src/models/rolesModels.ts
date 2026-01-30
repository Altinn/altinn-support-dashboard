export interface RolesAndRights {
  name: string;
  authorizedAccessPackages?: string[];
  authorizedResources?: string[];
  authorizedRoles?: string[];
  authorizedInstances?: string[];
}

export interface RolesAndRightsRequest {
  value: string;
  partyFilters: PartyFilter[];
}

export interface PartyFilter {
  value: string;
}
