export type RecipientType =
  | "person"
  | "organization"
  | "selfIdentified"
  | "legacySelfIdentified";

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
const SELF_IDENTIFIED_URN_PREFIX = "urn:altinn:person:idporten-email:";
const LEGACY_SELF_IDENTIFIED_URN_PREFIX =
  "urn:altinn:person:legacy-selfidentified:";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const RECIPIENT_URN_PREFIXES: Record<RecipientType, string> = {
  person: PERSON_URN_PREFIX,
  organization: ORGANIZATION_URN_PREFIX,
  selfIdentified: SELF_IDENTIFIED_URN_PREFIX,
  legacySelfIdentified: LEGACY_SELF_IDENTIFIED_URN_PREFIX,
};

export const getRecipientHelpText = (type: RecipientType): string => {
  switch (type) {
    case "person":
      return "Skriv inn 11-sifret fødselsnummer (kun tall).";
    case "organization":
      return "Skriv inn 9-sifret organisasjonsnummer (kun tall).";
    case "selfIdentified":
      return "Skriv inn e-postadresse for selvidentifisert bruker.";
    case "legacySelfIdentified":
      return "Skriv inn brukernavn for A2 selvidentifisert bruker.";
  }
};

export const getRecipientPlaceholder = (type: RecipientType): string => {
  switch (type) {
    case "person":
      return "12345678901";
    case "organization":
      return "123456789";
    case "selfIdentified":
      return "bruker@eksempel.no";
    case "legacySelfIdentified":
      return "brukernavn";
  }
};

export const getRecipientInputMode = (
  type: RecipientType
): "numeric" | "text" => {
  return type === "person" || type === "organization" ? "numeric" : "text";
};

export const buildRecipientUrn = (
  type: RecipientType,
  identifier: string
): string => {
  return `${RECIPIENT_URN_PREFIXES[type]}${identifier}`;
};

export const parseRecipientUrn = (
  urn: string
): { type: RecipientType; identifier: string } | null => {
  for (const [type, prefix] of Object.entries(RECIPIENT_URN_PREFIXES) as [
    RecipientType,
    string,
  ][]) {
    if (urn.startsWith(prefix)) {
      return { type, identifier: urn.slice(prefix.length) };
    }
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

  if (type === "person" || type === "organization") {
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
  }

  if (type === "selfIdentified") {
    if (!EMAIL_PATTERN.test(identifier)) {
      return "Ugyldig e-postadresse";
    }
    return undefined;
  }

  if (!identifier.trim() || /\s/.test(identifier) || identifier.includes(":")) {
    return "Ugyldig brukernavn";
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
