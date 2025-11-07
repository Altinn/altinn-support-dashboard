import { authDetails } from "../models/ansattportenModels";
import { authorizedFetch, getBaseUrl } from "./utils";

export const fetchAuthDetails = async (): Promise<authDetails> => {
  const res = await authorizedFetch(`${getBaseUrl()}/auth/auth-status`);

  if (!res.ok) {
    return { isLoggedIn: false, name: "", ansattportenActive: true };
  }

  const data = await res.json();
  const authDetails = data as authDetails;

  return authDetails;
};

export const initiateSignIn = async (redirectTo: string) => {
  const authDetails = await fetchAuthDetails();
  if (authDetails.ansattportenActive) {
    window.location.href = `${getBaseUrl()}/auth/login?redirectTo=${redirectTo}`;
  } else {
    window.location.href = "/";
  }
};

export const initiateSignOut = async (redirectTo: string) => {
  const authDetails = await fetchAuthDetails();

  if (authDetails.ansattportenActive) {
    window.location.href = `${getBaseUrl()}/auth/logout?redirectTo=${redirectTo}`;
  } else {
    window.location.href =
      "/.auth/logout?post_logout_redirect_uri=/.auth/login/aad";
  }
};
