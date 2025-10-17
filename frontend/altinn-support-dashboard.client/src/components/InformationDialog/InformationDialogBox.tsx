import React from 'react';
import {
    Dialog,
    Paragraph
} from '@digdir/designsystemet-react';

interface InformationDialogBoxProps {
    dialogRef: React.RefObject<HTMLDialogElement>;
}


const InformationDialogBox: React.FC<InformationDialogBoxProps> = (
    { 
        dialogRef 
    }) => {
    return (
        <Dialog ref={dialogRef}>
            <Paragraph>
                Dette er en informasjonsdialog
            </Paragraph>
        </Dialog>
    )
} 
export default InformationDialogBox;