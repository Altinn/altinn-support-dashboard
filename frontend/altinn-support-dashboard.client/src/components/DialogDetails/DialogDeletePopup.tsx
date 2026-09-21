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
import DialogDeleteResult from "./DialogDeleteResult";
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
};

const DIALOG_HEADING_ID = "dialog-delete-heading";

const DialogDeletePopup: React.FC<DialogDeletePopupProps> = ({
  onClose,
  dialogId,
  revision,
  environment,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [hardDelete, setHardDelete] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [outcome, setOutcome] = useState<DialogDeleteOutcome | null>(null);
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
          setOutcome({ result, dialogId, environment, hardDelete });
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
      aria-labelledby={DIALOG_HEADING_ID}
    >
      {outcome ? (
        <DialogDeleteResult
          outcome={outcome}
          onClose={onClose}
          headingId={DIALOG_HEADING_ID}
        />
      ) : (
        <>
          <Heading id={DIALOG_HEADING_ID} level={2} data-size="sm">
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

          <dl className={styles.summary}>
            <div className={styles.summaryRow}>
              <dt className={styles.summaryLabel}>Miljø</dt>
              <dd className={styles.summaryValue}>
                <Tag
                  data-color={isProduction ? "danger" : "info"}
                  data-size="sm"
                >
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
            label="Slett permanent (purge)"
            checked={hardDelete}
            onChange={(e) => setHardDelete(e.target.checked)}
            disabled={isPending}
          />

          {hardDelete && (
            <Alert data-color="danger">
              <Heading level={3} data-size="2xs">
                Denne dialogen blir permanent og ugjenkallelig slettet
              </Heading>
            </Alert>
          )}

          <Textfield
            label="Bekreft ved å skrive dialog-IDen"
            description="Sletting er først mulig når IDen under er identisk med dialogen som skal slettes."
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            error={showMismatch ? "Dialog-IDen stemmer ikke" : undefined}
            autoComplete="off"
            disabled={isPending}
          />

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
        </>
      )}
    </Dialog>
  );
};

export default DialogDeletePopup;
