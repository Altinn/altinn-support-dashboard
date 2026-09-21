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
  const [awaitingPurgeConfirm, setAwaitingPurgeConfirm] = useState(false);
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

  const performDelete = () => {
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

  const handleDelete = () => {
    if (!canDelete || !revision) return;

    if (hardDelete && isProduction) {
      setAwaitingPurgeConfirm(true);
      return;
    }

    performDelete();
  };

  return (
    <Dialog
      ref={dialogRef}
      className={styles.dialogBox}
      closedby="closerequest"
      onClose={onClose}
    >
      <Dialog.Block className={styles.content}>
        {outcome ? (
          <DialogDeleteResult outcome={outcome} onClose={onClose} />
        ) : awaitingPurgeConfirm ? (
          <div>
            <Heading level={2} data-size="sm">
              Er du helt sikker?
            </Heading>

            <Alert data-color="danger">
              <Heading level={3} data-size="2xs">
                Permanent sletting i PRODUKSJON
              </Heading>
              <Paragraph>
                Du er i ferd med å slette dialog "{dialogId}" permanent (purge)
                i produksjon. Dette kan ikke angres.
              </Paragraph>
            </Alert>

            <div className={styles.actions}>
              <Button
                variant="tertiary"
                onClick={() => setAwaitingPurgeConfirm(false)}
                disabled={isPending}
              >
                Avbryt
              </Button>
              <Button
                variant="primary"
                data-color="danger"
                onClick={() => {
                  setAwaitingPurgeConfirm(false);
                  performDelete();
                }}
                disabled={!canDelete}
              >
                {isPending && <Spinner aria-hidden data-size="xs" />}
                Ja, slett permanent
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Heading level={2} data-size="sm">
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
              <dt>Miljø</dt>
              <dd>
                <Tag
                  data-color={isProduction ? "danger" : "info"}
                  data-size="sm"
                >
                  {environment}
                </Tag>
              </dd>

              <dt>Dialog-ID</dt>
              <dd>
                <code className={styles.code}>{dialogId}</code>
              </dd>

              <dt>Revision</dt>
              <dd>
                <code className={styles.code}>{revision ?? "-"}</code>
              </dd>
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
          </div>
        )}
      </Dialog.Block>
    </Dialog>
  );
};

export default DialogDeletePopup;
