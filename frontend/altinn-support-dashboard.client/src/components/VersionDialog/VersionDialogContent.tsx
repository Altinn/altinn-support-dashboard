import { 
    Box, 
    List, 
    Typography,
    ListItem, 
    ListItemText,
    DialogContent
} from "@mui/material";
import type { VersionInfo } from "../../hooks/useVersionCheck";

type VersionDialogContentProps = {
    versionInfo: VersionInfo | null;
}

const VersionDialogContent: React.FC<VersionDialogContentProps> = ({versionInfo}) => {
    return (
        <DialogContent dividers>
            {versionInfo.changes.length >0 && (
                <Box>
                    <Typography variant = "h6">
                        {versionInfo.changes[0].title}
                    </Typography>
                    <Typography variant = "body2">
                        {versionInfo.changes[0].description}
                    </Typography>
                    {versionInfo.changes[0].details.length > 0 && (
                    <List dense>
                            {versionInfo.changes[0].details.map((detail, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={detail} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            )}
        </DialogContent>
    );
};

export default VersionDialogContent;
