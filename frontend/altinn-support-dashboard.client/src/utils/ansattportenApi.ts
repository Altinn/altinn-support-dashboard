import { authDetails } from "../models/ansattportenModels";
import { authorizedFetch, getBaseUrl } from "./utils";

export const fetchAuthDetails = async (): Promise<authDetails> => {
  const res = await authorizedFetch(`${getBaseUrl()}/auth/auth-status`);

  if (res.status != 200) {
    return { isLoggedIn: false, name: null };
  }

  const data = await res.json();
  const authDetails = data as authDetails;

  return authDetails;
};

export const initiateSignIn = async (redirectTo: string) => {
  window.location.href = `${getBaseUrl()}/auth/login?redirectTo=${redirectTo}`;
};

export const initiateSignOut = async (redirectTo: string) => {
  window.location.href = `${getBaseUrl()}/auth/logout?redirectTo=${redirectTo}`;
};
