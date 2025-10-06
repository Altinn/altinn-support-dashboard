import { 
    Button, 
} from "@digdir/designsystemet-react";


type VersionDialogButtonProps = {
    onClose: () => void;
}

const VersionDialogButton: React.FC<VersionDialogButtonProps> = ({ onClose }) => {
    return (
        <Button onClick={onClose} >
          Ikke vis igjen
        </Button>
    );
};
export default VersionDialogButton;