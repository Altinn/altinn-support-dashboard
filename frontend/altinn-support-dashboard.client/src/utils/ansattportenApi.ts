import { authDetails } from "../models/azureAuthModels";
import { authorizedFetch, getBaseUrl } from "./utils";

export const fetchAuthDetails = async (): Promise<authDetails> => {
  try {
    const res = await authorizedFetch(`${getBaseUrl()}/azure-auth/auth-status`);

    if (!res.ok) {
      return { isLoggedIn: false, name: "", azureAuthActive: false, roles: [] };
    }

    return (await res.json()) as authDetails;
  } catch (err) {
    return { isLoggedIn: false, name: "", azureAuthActive: false, roles: [] };
  }
};

export const initiateSignIn = () => {
  window.location.href = "/api/azure-auth/login";
};

export const initiateSignOut = () => {
  window.location.href = "/api/azure-auth/logout";
};
