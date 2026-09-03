import { Input, Label, Select } from "@digdir/designsystemet-react";
import { useEffect, useMemo } from "react";
import { setLocalStorageValue, getLocalStorageValue } from "../ManualRoleSearch/utils/storageUtils";
import classes from "./styles/CorrespondenceRecipient.module.css";
import {
  buildRecipientUrn,
  getRecipientHelpText,
  getRecipientInputMode,
  getRecipientPlaceholder,
  parseRecipientUrn,
  RecipientType,
  validateRecipientIdentifier,
} from "./utils/correspondenceValidation";

interface CorrespondenceRecipientProps {
  recipientType: RecipientType;
  setRecipientType: (type: RecipientType) => void;
  recipientIdentifier: string;
  setRecipientIdentifier: (identifier: string) => void;
}

const CorrespondenceRecipient: React.FC<CorrespondenceRecipientProps> = ({
  recipientType,
  setRecipientType,
  recipientIdentifier,
  setRecipientIdentifier,
}) => {
  const validationError = useMemo(
    () => validateRecipientIdentifier(recipientType, recipientIdentifier),
    [recipientType, recipientIdentifier]
  );

  const recipientUrn = useMemo(() => {
    if (validationError || !recipientIdentifier) {
      return "";
    }
    return buildRecipientUrn(recipientType, recipientIdentifier);
  }, [recipientType, recipientIdentifier, validationError]);

  useEffect(() => {
    setLocalStorageValue("recipientType", recipientType);
    setLocalStorageValue("recipientIdentifier", recipientIdentifier);
    setLocalStorageValue("recipient", recipientUrn);
  }, [recipientType, recipientIdentifier, recipientUrn]);

  return (
    <div className={classes.container}>
      <Label className={classes.label}>Mottaker</Label>
      <Select
        className={classes.select}
        value={recipientType}
        onChange={(e) => setRecipientType(e.target.value as RecipientType)}
      >
        <Select.Option value="person">Person</Select.Option>
        <Select.Option value="organization">Organisasjon</Select.Option>
        <Select.Option value="selfIdentified">Selvidentifisert bruker</Select.Option>
        <Select.Option value="legacySelfIdentified">
          A2 selvidentifisert bruker
        </Select.Option>
      </Select>
      <Input
        className={classes.input}
        value={recipientIdentifier}
        onChange={(e) => setRecipientIdentifier(e.target.value)}
        placeholder={getRecipientPlaceholder(recipientType)}
        inputMode={getRecipientInputMode(recipientType)}
        aria-invalid={!!validationError}
      />
      <p className={classes.helpText}>{getRecipientHelpText(recipientType)}</p>
      {validationError && recipientIdentifier && (
        <p className={classes.errorText} role="alert">
          {validationError}
        </p>
      )}
      {recipientUrn && (
        <p className={classes.previewText}>
          Mottaker-URN: <code>{recipientUrn}</code>
        </p>
      )}
    </div>
  );
};

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
      return parsed;
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
          return parsed;
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

export default CorrespondenceRecipient;
