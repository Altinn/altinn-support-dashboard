import { DialogTitle, Typography } from "@mui/material";
import formatDate from "./utils/formatDateutils";
import { VersionInfo } from "../../hooks/useVersionCheck";

type VersionDialogTitleProps = {
    versionInfo: VersionInfo | null;
}

const VersionDialogTitle: React.FC<VersionDialogTitleProps> = ({
    versionInfo
}) => {
    return (
        <DialogTitle id = "version-dialog-title">
            <Typography variant="h5" component="div">
                Ny versjon: {versionInfo.version} 🎉🥳
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
                Versjon {versionInfo.version} ble lansert {formatDate(versionInfo.releaseDate)}
            </Typography>
        </DialogTitle>
    )
};

export default VersionDialogTitle;