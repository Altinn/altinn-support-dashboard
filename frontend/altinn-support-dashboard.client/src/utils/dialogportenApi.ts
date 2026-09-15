import { DialogDetails, DialogDto } from "../models/dialogModels";
import { authorizedFetch, getBaseUrl } from "./utils";

export const fetchDialogByUrn = async (
  environment: string,
  urn: string
): Promise<DialogDto> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/dialogporten/dialog/${urn}`
  );

  if (res.status === 404) throw new Error("Fant ingen dialog med denne IDen");
  if (!res.ok)
    throw new Error((await res.text()) || "Feil ved henting av dialog");

  return res.json();
};

export const fetchDialogDetails = async (
  environment: string,
  dialogId: string
): Promise<DialogDetails> => {
  const res = await authorizedFetch(
    `${getBaseUrl(environment)}/dialogporten/dialogs/${dialogId}`
  );

  if (res.status === 404) throw new Error("Fant ingen dialog med denne IDen");
  if (!res.ok)
    throw new Error((await res.text()) || "Feil ved henting av dialog");

  return res.json();
}
