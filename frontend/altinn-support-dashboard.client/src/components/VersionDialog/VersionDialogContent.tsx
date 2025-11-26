import type { VersionInfo } from "../../hooks/useVersionCheck";
import { Dialog, Heading, Paragraph, List } from "@digdir/designsystemet-react";
import styles from "./styles/VersionDialogContent.module.css";

type VersionDialogContentProps = {
  versionInfo: VersionInfo | null;
};

const VersionDialogContent: React.FC<VersionDialogContentProps> = ({
  versionInfo,
}) => {
  return (
    <Dialog.Block>
      {versionInfo && versionInfo.changes.length > 0 && (
        <div>
          <Heading className={styles.heading}>
            {versionInfo.changes[0].title}
          </Heading>
          <Paragraph className={styles.paragraph}>
            {versionInfo.changes[0].description}
          </Paragraph>
          {versionInfo.changes[0].details.length > 0 && (
            <List.Unordered className={styles.list}>
              {versionInfo.changes[0].details.map((detail, index) => (
                <List.Item key={index} className={styles.listItem}>
                  {detail}
                </List.Item>
              ))}
            </List.Unordered>
          )}
        </div>
      )}
    </Dialog.Block>
  );
};

export default VersionDialogContent;
