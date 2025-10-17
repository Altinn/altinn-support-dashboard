import React from 'react';
import {
    Dialog,
    Heading,
    Paragraph
} from '@digdir/designsystemet-react';
import InformationDialogContent from './InformationDialogContent';

interface InformationDialogBoxProps {
    dialogRef: React.RefObject<HTMLDialogElement>;
}


const InformationDialogBox: React.FC<InformationDialogBoxProps> = (
    { 
        dialogRef 
    }) => {
    return (
        <Dialog ref={dialogRef}>
            <Heading>
                Dette verktøyet skal kun brukes til å bekrefte informasjon
            </Heading>
            <InformationDialogContent/>
        </Dialog>
    )
} 
export default InformationDialogBox;