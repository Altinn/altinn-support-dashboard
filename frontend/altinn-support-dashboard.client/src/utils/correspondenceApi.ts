import { CorrespondenceUploadRequest } from "../models/correspondenceModels";
import { authorizedPost } from "./utils";

export const sendCorrespondence = async (data: CorrespondenceUploadRequest) => {
  const res = await authorizedPost("api/correspondence/upload", data);
  return res.json();
};
