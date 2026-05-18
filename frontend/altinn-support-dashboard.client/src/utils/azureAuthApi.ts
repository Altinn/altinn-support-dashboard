import { authDetails } from "../models/azureAuthModels";
import { authorizedFetch, getBaseUrl } from "./utils";

export const fetchAuthDetails = async (): Promise<authDetails> => {
  try {
    const res = await authorizedFetch(`${getBaseUrl()}/azure-auth/auth-status`);

    if (!res.ok) {
      return { isLoggedIn: false, name: "", azureAuthActive: true, roles: [] };
    }

    return (await res.json()) as authDetails;
  } catch (err) {
    return { isLoggedIn: false, name: "", azureAuthActive: true, roles: [] };
  }
};

export const initiateSignIn = async () => {
  window.location.href = "/api/azure-auth/login";
};

export const initiateSignOut = async () => {
  const authDetails = await fetchAuthDetails();
  if (authDetails.azureAuthActive && authDetails.isLoggedIn) {
    window.location.href = "/api/azure-auth/logout";
  }
};
