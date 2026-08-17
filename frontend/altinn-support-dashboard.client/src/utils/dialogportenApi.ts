import { DialogDto } from "../models/dialogModels";
import { authorizedFetch, getBaseUrl } from "./utils";

export const fetchDialogByUrn = async (
  environment: string,
  urn: string
): Promise<DialogDto> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/dialogporten/dialog/${encodeURIComponent(urn)}`
  );

  if (res.status === 404) throw new Error("Fant ingen dialog med denne IDen");
  if (!res.ok)
    throw new Error((await res.text()) || "Feil ved henting av dialog");

  return res.json();
};
