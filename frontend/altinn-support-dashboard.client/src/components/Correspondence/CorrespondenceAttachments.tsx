import { Button, Label } from "@digdir/designsystemet-react";
import { useMemo } from "react";
import classes from "./styles/CorrespondenceAttachments.module.css";
import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  MAX_ATTACHMENTS,
  MIN_ATTACHMENTS,
  validateAttachments,
} from "./utils/correspondenceValidation";

interface CorrespondenceAttachmentsProps {
  attachments: File[];
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
}

const CorrespondenceAttachments: React.FC<CorrespondenceAttachmentsProps> = ({
  attachments,
  setAttachments,
}) => {
  const validationError = useMemo(
    () => validateAttachments(attachments),
    [attachments]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) {
      return;
    }

    setAttachments((current) => {
      const combined = [...current, ...selectedFiles];
      return combined.slice(0, MAX_ATTACHMENTS);
    });

    event.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((current) => current.filter((_, i) => i !== index));
  };

  const allowedTypesText = ALLOWED_ATTACHMENT_EXTENSIONS.join(", ");

  return (
    <div className={classes.container}>
      <Label>Vedlegg ({MIN_ATTACHMENTS}-{MAX_ATTACHMENTS})</Label>
      <p className={classes.helpText}>
        Velg mellom {MIN_ATTACHMENTS} og {MAX_ATTACHMENTS} vedlegg. Tillatte
        filtyper: {allowedTypesText}
      </p>
      <input
        className={classes.fileInput}
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={attachments.length >= MAX_ATTACHMENTS}
        aria-label="Velg vedlegg"
      />
      {attachments.length > 0 && (
        <ul className={classes.fileList}>
          {attachments.map((file, index) => (
            <li key={`${file.name}-${index}`} className={classes.fileItem}>
              <span className={classes.fileName}>{file.name}</span>
              <Button
                variant="secondary"
                onClick={() => removeAttachment(index)}
                aria-label={`Fjern ${file.name}`}
              >
                Fjern
              </Button>
            </li>
          ))}
        </ul>
      )}
      {validationError && attachments.length > 0 && (
        <p className={classes.errorText} role="alert">
          {validationError}
        </p>
      )}
    </div>
  );
};

export default CorrespondenceAttachments;
