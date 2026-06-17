import { CorrespondenceUploadRequest } from "../models/correspondenceModels";
import { authorizedPost } from "./utils";

export const sendCorrespondence = async (data: CorrespondenceUploadRequest) => {
  const res = await authorizedPost("api/correspondence/upload", data);
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }

  return res.json();
};
