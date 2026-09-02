import {
  CorrespondenceUploadFormData,
} from "../models/correspondenceModels";

export const sendCorrespondence = async ({
  request,
  attachments,
}: CorrespondenceUploadFormData) => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const formData = new FormData();
  formData.append("request", JSON.stringify(request));
  attachments.forEach((file) => {
    formData.append("attachments", file, file.name);
  });

  const res = await fetch("api/correspondence/upload", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Basic ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }

  return res.json();
};
