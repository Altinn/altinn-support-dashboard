import { authDetails } from "../models/ansattportenModels";
import { authorizedFetch, getBaseUrl } from "./utils";

export const authStatus = async (environment: string): Promise<authDetails> => {
  const res = await authorizedFetch(`${getBaseUrl()}auth/auth-status`);

  if (res.status != 200) {
    return { authStatus: false };
  }

  const data = await res.json();
  const authDetails = data as authDetails;

  return authDetails;
};
