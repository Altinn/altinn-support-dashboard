import { Button, Card, Heading, Tabs, Tag } from "@digdir/designsystemet-react";
import { isSuccess } from "../../utils/httpUtils";
import { DialogDeleteOutcome } from "./DialogDeletePopup";
import styles from "./DialogDeleteResult.module.css";

type DialogDeleteResultProps = {
  outcome: DialogDeleteOutcome;
  onClose: () => void;
  headingId?: string;
};

/** Pretty-prints the payload when it is JSON, otherwise returns it unchanged */
const formatPayload = (payload?: string | null): string => {
  if (!payload) return "";
  try {
    return JSON.stringify(JSON.parse(payload), null, 2);
  } catch {
    return payload;
  }
};

const DialogDeleteResult: React.FC<DialogDeleteResultProps> = ({
  outcome,
  onClose,
  headingId,
}) => {
  const { result, dialogId, environment, hardDelete } = outcome;
  const succeeded = isSuccess(result.statusCode);

  return (
    <div className={styles.resultView}>
      <Heading id={headingId} level={2} data-size="sm">
        {succeeded ? "Dialogen ble slettet" : "Sletting feilet"}
      </Heading>

      <Card
        data-color={succeeded ? "success" : "danger"}
        className={styles.statusCard}
      >
        <Heading level={3} data-size="xs">
          Status code: {result.statusCode}
        </Heading>
      </Card>

      <dl className={styles.summary}>
        <div className={styles.summaryRow}>
          <dt className={styles.summaryLabel}>Type sletting</dt>
          <dd className={styles.summaryValue}>
            <Tag data-color={hardDelete ? "danger" : "warning"} data-size="sm">
              {hardDelete ? "Permanent (purge)" : "Soft delete"}
            </Tag>
          </dd>
        </div>
        <div className={styles.summaryRow}>
          <dt className={styles.summaryLabel}>Miljø</dt>
          <dd className={styles.summaryValue}>
            <Tag
              data-color={environment === "PROD" ? "danger" : "info"}
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
      </dl>

      <Tabs defaultValue="response">
        <Tabs.List>
          <Tabs.Tab value="response">Response</Tabs.Tab>
          <Tabs.Tab value="request">Request</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel className={styles.tabContent} value="response">
          <Heading level={3} data-size="xs">
            Headers
          </Heading>
          <pre className={styles.payload}>
            {result.responseHeader || "(tom)"}
          </pre>

          <Heading level={3} data-size="xs">
            Body
          </Heading>
          <pre className={styles.payload}>
            {formatPayload(result.responseBody)}
          </pre>
        </Tabs.Panel>

        <Tabs.Panel className={styles.tabContent} value="request">
          <Heading level={3} data-size="xs">
            Body
          </Heading>
          <pre className={styles.payload}>
            {formatPayload(result.requestBody)}
          </pre>
        </Tabs.Panel>
      </Tabs>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>
          Lukk
        </Button>
      </div>
    </div>
  );
};

export default DialogDeleteResult;
