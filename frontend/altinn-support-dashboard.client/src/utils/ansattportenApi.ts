import { authDetails } from "../models/ansattportenModels";
import { authorizedFetch, getBaseUrl } from "./utils";

export const fetchAuthDetails = async (): Promise<authDetails> => {
  try {
    const res = await authorizedFetch(
      `${getBaseUrl()}/api/azure-auth/auth-status`,
    );

    if (!res.ok) {
      return {
        isLoggedIn: false,
        name: "",
        azureAuthActive: true,
        roles: [],
      };
    }
    const data = await res.json();
    console.log(data);

    return data as authDetails;
  } catch (err) {
    return {
      isLoggedIn: false,
      azureAuthActive: true,
      name: "",
      roles: [],
    };
  }
};

//temporary
export const initiateTemporarySignIn = async () => {
  window.location.href = `/.auth/login/entraid?post_login_redirect_uri=/dashboard`;
};

export const initiateSignOut = async (redirectTo: string) => {
  const authDetails = await fetchAuthDetails();

  if (authDetails.azureAuthActive) {
    window.location.href = "/.auth/logout";
  } else {
    window.location.href = `${getBaseUrl()}/auth/logout?redirectTo=${redirectTo}`;
  }
};
