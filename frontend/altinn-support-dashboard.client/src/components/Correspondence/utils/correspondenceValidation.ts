export type RecipientType = "person" | "organization";

export const ALLOWED_ATTACHMENT_EXTENSIONS = [
  ".doc",
  ".xls",
  ".docx",
  ".xlsx",
  ".ppt",
  ".pps",
  ".zip",
  ".pdf",
  ".html",
  ".txt",
  ".xml",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".png",
  ".json",
  ".csv",
  ".dcm",
  ".dicom",
] as const;

export const MIN_ATTACHMENTS = 1;
export const MAX_ATTACHMENTS = 50;

const PERSON_URN_PREFIX = "urn:altinn:person:identifier-no:";
const ORGANIZATION_URN_PREFIX = "urn:altinn:organization:identifier-no:";

export const getRecipientHelpText = (type: RecipientType): string => {
  if (type === "person") {
    return "Skriv inn 11-sifret fødselsnummer (kun tall).";
  }
  return "Skriv inn 9-sifret organisasjonsnummer (kun tall).";
};

export const getRecipientPlaceholder = (type: RecipientType): string => {
  return type === "person" ? "12345678901" : "123456789";
};

export const buildRecipientUrn = (
  type: RecipientType,
  identifier: string
): string => {
  const prefix =
    type === "person" ? PERSON_URN_PREFIX : ORGANIZATION_URN_PREFIX;
  return `${prefix}${identifier}`;
};

export const parseRecipientUrn = (
  urn: string
): { type: RecipientType; identifier: string } | null => {
  if (urn.startsWith(PERSON_URN_PREFIX)) {
    return { type: "person", identifier: urn.slice(PERSON_URN_PREFIX.length) };
  }
  if (urn.startsWith(ORGANIZATION_URN_PREFIX)) {
    return {
      type: "organization",
      identifier: urn.slice(ORGANIZATION_URN_PREFIX.length),
    };
  }
  return null;
};

export const validateRecipientIdentifier = (
  type: RecipientType,
  identifier: string
): string | undefined => {
  if (!identifier) {
    return "Mottaker er påkrevd";
  }

  if (!/^\d+$/.test(identifier)) {
    return "Kun tall er tillatt";
  }

  if (type === "person" && identifier.length !== 11) {
    return "Fødselsnummer må være 11 siffer";
  }

  if (type === "organization" && identifier.length !== 9) {
    return "Organisasjonsnummer må være 9 siffer";
  }

  return undefined;
};

export const getFileExtension = (fileName: string): string => {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) {
    return "";
  }
  return fileName.slice(dotIndex).toLowerCase();
};

export const isAllowedAttachmentFile = (file: File): boolean => {
  const extension = getFileExtension(file.name);
  return ALLOWED_ATTACHMENT_EXTENSIONS.includes(
    extension as (typeof ALLOWED_ATTACHMENT_EXTENSIONS)[number]
  );
};

export const validateAttachments = (files: File[]): string | undefined => {
  if (files.length < MIN_ATTACHMENTS) {
    return `Minst ${MIN_ATTACHMENTS} vedlegg er påkrevd`;
  }

  if (files.length > MAX_ATTACHMENTS) {
    return `Maks ${MAX_ATTACHMENTS} vedlegg er tillatt`;
  }

  const invalidFile = files.find((file) => !isAllowedAttachmentFile(file));
  if (invalidFile) {
    return `Filtypen for "${invalidFile.name}" er ikke tillatt`;
  }

  return undefined;
};
