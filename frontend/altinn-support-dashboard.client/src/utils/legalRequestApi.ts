import { LegalRequestExportRequest } from "../models/legalRequestModels";
import { authorizedPost, downloadFile, getBaseUrl } from "./utils";

export const downloadLegalRequestExport = async (
  environment: string,
  request: LegalRequestExportRequest
): Promise<void> => {
  const res = await authorizedPost(
    `${getBaseUrl(environment)}/legalrequest/export`,
    request
  );

  if (res.status === 403)
    throw new Error("Du mangler tilgang til rettslige pålegg");
  if (!res.ok) throw new Error((await res.text()) || "Feil ved eksport");

  await downloadFile(res, "rettslig-palegg.xlsx");
};
