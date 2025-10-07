import { 
    Button, 
} from "@digdir/designsystemet-react";
import styles from "./styles/VersionDialogButton.module.css";


type VersionDialogButtonProps = {
    onClose: () => void;
}

const VersionDialogButton: React.FC<VersionDialogButtonProps> = ({ onClose }) => {
    return (
        <Button onClick={onClose} className= {styles.button} variant="primary">
          Ikke vis igjen
        </Button>
    );
};
export default VersionDialogButton;