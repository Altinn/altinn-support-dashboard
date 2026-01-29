export interface RolesAndRights {
  name: string;
  authorizedAccessPackages?: string[];
  authorizedResources?: string[];
  authorizedRoles?: string[];
  authorizedInstances?: string[];
}
