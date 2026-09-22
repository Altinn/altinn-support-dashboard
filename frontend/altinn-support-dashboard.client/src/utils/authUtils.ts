import { authDetails } from "../models/azureAuthModels";

export class AuthUtils {
  static hasRole(authData: authDetails | undefined, role: string): boolean {
    return !authData?.azureAuthActive || !!authData?.roles.includes(role);
  }

  static hasInternalCoreRoles(authData: authDetails | undefined): boolean {
    return AuthUtils.hasRole(authData, "Dashboard.Core.Internal");
  }

  static hasInternalOrExternalCoreRoles(
    authData: authDetails | undefined
  ): boolean {
    return (
      AuthUtils.hasInternalCoreRoles(authData) ||
      AuthUtils.hasRole(authData, "Dashboard.Core.External")
    );
  }

  static hasDeveloperRole(authData: authDetails | undefined): boolean {
    return AuthUtils.hasRole(authData, "Dashboard.Developer");
  }

  static hasTT02OrProductionRoles(authData: authDetails | undefined): boolean {
    return (
      AuthUtils.hasRole(authData, "Dashboard.PROD") ||
      AuthUtils.hasRole(authData, "Dashboard.TT02")
    );
  }

  static hasDialogportenAdminRole(authData: authDetails | undefined): boolean {
    return AuthUtils.hasRole(authData, "Dashboard.Dialogporten.Admin");
  }
}
