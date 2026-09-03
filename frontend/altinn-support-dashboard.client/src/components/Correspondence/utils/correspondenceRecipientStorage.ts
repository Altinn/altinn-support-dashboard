import { getLocalStorageValue } from "../../ManualRoleSearch/utils/storageUtils";
import { parseRecipientUrn, RecipientType } from "./correspondenceValidation";

export const loadRecipientFromStorage = (): {
  recipientType: RecipientType;
  recipientIdentifier: string;
} => {
  const storedType = getLocalStorageValue("recipientType");
  const storedIdentifier = getLocalStorageValue("recipientIdentifier");
  const storedUrn = getLocalStorageValue("recipient");

  if (
    storedType === "person" ||
    storedType === "organization" ||
    storedType === "selfIdentified" ||
    storedType === "legacySelfIdentified"
  ) {
    return {
      recipientType: storedType,
      recipientIdentifier: storedIdentifier,
    };
  }

  if (storedUrn) {
    const parsed = parseRecipientUrn(storedUrn);
    if (parsed) {
      return {
        recipientType: parsed.type,
        recipientIdentifier: parsed.identifier,
      };
    }
  }

  const legacyRecipients = getLocalStorageValue("recipients");
  if (legacyRecipients) {
    try {
      const recipients = JSON.parse(legacyRecipients) as string[];
      const firstRecipient = recipients.find(Boolean);
      if (firstRecipient) {
        const parsed = parseRecipientUrn(firstRecipient);
        if (parsed) {
          return {
            recipientType: parsed.type,
            recipientIdentifier: parsed.identifier,
          };
        }
        if (/^\d{11}$/.test(firstRecipient)) {
          return { recipientType: "person", recipientIdentifier: firstRecipient };
        }
        if (/^\d{9}$/.test(firstRecipient)) {
          return {
            recipientType: "organization",
            recipientIdentifier: firstRecipient,
          };
        }
      }
    } catch {
      // Ignore invalid legacy storage values.
    }
  }

  return { recipientType: "person", recipientIdentifier: "" };
};
