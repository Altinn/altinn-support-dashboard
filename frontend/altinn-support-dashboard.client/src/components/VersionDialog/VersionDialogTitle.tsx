import formatDate from "./utils/formatDateutils";
import { VersionInfo } from "../../hooks/useVersionCheck";
import {
    Heading,
    Dialog,
    Paragraph
} from "@digdir/designsystemet-react";
import styles from "./styles/VersionDialogTitle.module.css";

type VersionDialogTitleProps = {
    versionInfo: VersionInfo | null;
}

const VersionDialogTitle: React.FC<VersionDialogTitleProps> = ({
    versionInfo
}) => {
    return (
        <Dialog.Block>
            <Heading className={styles.heading}>
                Ny versjon: {versionInfo.version} 🎉🥳
            </Heading>
            <Paragraph className={styles.paragraph}>
                Versjon {versionInfo.version} ble lansert {formatDate(versionInfo.releaseDate)}
            </Paragraph>
        </Dialog.Block>
    )
};

export default VersionDialogTitle;