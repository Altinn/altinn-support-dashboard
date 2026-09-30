import { Card, Heading, Tabs, Tag } from "@digdir/designsystemet-react";
import { isSuccess } from "../../utils/httpUtils";
import { DialogDeleteOutcome } from "./DialogDeletePopup";
import styles from "./DialogDeleteResult.module.css";

type DialogDeleteResultProps = {
  outcome: DialogDeleteOutcome;
  onClose: () => void;
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

const DialogDeleteResult: React.FC<DialogDeleteResultProps> = ({ outcome }) => {
  const { result, dialogId, environment, hardDelete } = outcome;
  const succeeded = isSuccess(result.statusCode);

  return (
    <div className={styles.resultView}>
      <Heading level={2} data-size="sm">
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
        <dt>Type sletting</dt>
        <dd>
          <Tag data-color={hardDelete ? "danger" : "warning"} data-size="sm">
            {hardDelete ? "Permanent (purge)" : "Soft delete"}
          </Tag>
        </dd>

        <dt>Miljø</dt>
        <dd>
          <Tag data-color="info" data-size="sm">
            {environment}
          </Tag>
        </dd>

        <dt>Dialog-ID</dt>
        <dd>
          <code className={styles.code}>{dialogId}</code>
        </dd>
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
          <pre className={styles.payload}>{result.responseHeader}</pre>

          <Heading level={3} data-size="xs">
            Body
          </Heading>
          <pre className={styles.payload}>
            {formatPayload(result.responseBody)}
          </pre>
        </Tabs.Panel>

        <Tabs.Panel className={styles.tabContent} value="request">
          <Heading level={3} data-size="xs">
            Headers
          </Heading>
          <pre className={styles.payload}>{result.requestHeader}</pre>

          <Heading level={3} data-size="xs">
            Body
          </Heading>
          <pre className={styles.payload}>
            {formatPayload(result.requestBody)}
          </pre>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default DialogDeleteResult;
