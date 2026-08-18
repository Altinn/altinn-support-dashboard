import React, { useState } from "react";
import { Paragraph, Button } from "@digdir/designsystemet-react";
import { ClipboardIcon, ClipboardCheckmarkIcon } from "@navikt/aksel-icons";
import styles from "./CopyableField.module.css";

interface CopyableFieldProps {
  label: string;
  displayValue: string;
  copyValue?: string;
}

const CopyableField: React.FC<CopyableFieldProps> = ({
  label,
  displayValue,
  copyValue,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyValue ?? displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.row}>
      <Paragraph className={styles.text}>
        <strong>{label}:</strong>{" "}
        <span className={styles.value}>{displayValue}</span>
      </Paragraph>
      <Button
        variant="tertiary"
        data-size="sm"
        aria-label={`Kopier ${label}`}
        onClick={handleCopy}
        className={styles.copyButton}
      >
        {copied ? <ClipboardCheckmarkIcon /> : <ClipboardIcon />}
      </Button>
    </div>
  );
};

export default CopyableField;
