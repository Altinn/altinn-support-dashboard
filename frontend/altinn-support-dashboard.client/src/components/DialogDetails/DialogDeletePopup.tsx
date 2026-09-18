import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  Heading,
  Paragraph,
  Spinner,
  Tag,
  Textfield,
} from "@digdir/designsystemet-react";
import { useDeleteDialog } from "../../hooks/hooks";
import { DeleteDialogResponse } from "../../models/dialogModels";
import styles from "./DialogDeletePopup.module.css";

export type DialogDeleteOutcome = {
  result: DeleteDialogResponse;
  dialogId: string;
  environment: string;
  hardDelete: boolean;
};

type DialogDeletePopupProps = {
  onClose: () => void;
  dialogId: string;
  revision?: string;
  environment: string;
  onDeleted: (outcome: DialogDeleteOutcome) => void;
};

/** Mounted only while open, so the page controls it by conditional rendering */
const DialogDeletePopup: React.FC<DialogDeletePopupProps> = ({
  onClose,
  dialogId,
  revision,
  environment,
  onDeleted,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [hardDelete, setHardDelete] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const { mutate, isPending } = useDeleteDialog();

  const isProduction = environment === "PROD";
  const confirmationMatches =
    !!dialogId &&
    confirmation.trim().toLowerCase() === dialogId.trim().toLowerCase();
  const showMismatch = confirmation.trim().length > 0 && !confirmationMatches;
  const canDelete = confirmationMatches && !!revision && !isPending;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleDelete = () => {
    if (!canDelete || !revision) return;

    mutate(
      { environment, request: { dialogId, revision, hardDelete } },
      {
        onSuccess: (result) => {
          onDeleted({ result, dialogId, environment, hardDelete });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog
      ref={dialogRef}
      className={styles.dialogBox}
      closedby="closerequest"
      onClose={onClose}
      aria-labelledby="dialog-delete-heading"
    >
      <Heading id="dialog-delete-heading" level={2} data-size="sm">
        {hardDelete ? "Slett dialog permanent" : "Slett dialog"}
      </Heading>

      {isProduction && (
        <Alert data-color="danger">
          <Heading level={3} data-size="2xs">
            Du er i PRODUKSJON
          </Heading>
          <Paragraph>
            Dette er en ekte dialog som tilhører en ekte bruker eller
            virksomhet. Sletting påvirker det de ser i Altinn umiddelbart.
          </Paragraph>
        </Alert>
      )}

      <Alert data-color="warning">
        <Paragraph>
          Myk sletting skjuler dialogen for sluttbruker, men den finnes fortsatt
          i Dialogporten og kan hentes fram igjen av tjenesteeier.
        </Paragraph>
      </Alert>

      <dl className={styles.summary}>
        <div className={styles.summaryRow}>
          <dt className={styles.summaryLabel}>Miljø</dt>
          <dd className={styles.summaryValue}>
            <Tag data-color={isProduction ? "danger" : "info"} data-size="sm">
              {environment}
            </Tag>
          </dd>
        </div>
        <div className={styles.summaryRow}>
          <dt className={styles.summaryLabel}>Dialog-ID</dt>
          <dd className={styles.summaryValue}>
            <code className={styles.code}>{dialogId}</code>
          </dd>
        </div>
        <div className={styles.summaryRow}>
          <dt className={styles.summaryLabel}>Revision</dt>
          <dd className={styles.summaryValue}>
            <code className={styles.code}>{revision ?? "-"}</code>
          </dd>
        </div>
      </dl>

      <Checkbox
        label="Slett permanent (purge) i stedet for myk sletting"
        checked={hardDelete}
        onChange={(e) => setHardDelete(e.target.checked)}
        disabled={isPending}
      />

      {hardDelete && (
        <Alert data-color="danger">
          <Heading level={3} data-size="2xs">
            Denne dialogen blir permanent og ugjenkallelig slettet
          </Heading>
          <Paragraph>
            Dialogen og alt innhold fjernes fra Dialogporten for alltid. Den kan
            ikke gjenopprettes, verken av deg eller av tjenesteeier.
          </Paragraph>
        </Alert>
      )}

      <Textfield
        label="Bekreft ved å skrive eller lime inn dialog-IDen"
        description="Sletting er først mulig når IDen under er identisk med dialogen som skal slettes."
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        error={showMismatch ? "Dialog-IDen stemmer ikke" : undefined}
        autoComplete="off"
        disabled={isPending}
      />

      {!revision && (
        <Alert data-color="warning">
          <Paragraph>
            Fant ingen revision på dialogen. Sletting krever en revision, så søk
            opp dialogen på nytt og prøv igjen.
          </Paragraph>
        </Alert>
      )}

      <div className={styles.actions}>
        <Button variant="tertiary" onClick={onClose} disabled={isPending}>
          Avbryt
        </Button>
        <Button
          variant="primary"
          data-color="danger"
          onClick={handleDelete}
          disabled={!canDelete}
        >
          {isPending && <Spinner aria-hidden data-size="xs" />}
          {hardDelete ? "Slett permanent" : "Slett dialog"}
        </Button>
      </div>
    </Dialog>
  );
};

export default DialogDeletePopup;
