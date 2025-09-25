import { 
    Button, 
    DialogActions 
} from "@mui/material";


type VersionDialogButtonProps = {
    onClose: () => void;
}

const VersionDialogButton: React.FC<VersionDialogButtonProps> = ({ onClose }) => {
    return (
        <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose} >
          Ikke vis igjen
        </Button>
        </DialogActions>
    );
};
export default VersionDialogButton;