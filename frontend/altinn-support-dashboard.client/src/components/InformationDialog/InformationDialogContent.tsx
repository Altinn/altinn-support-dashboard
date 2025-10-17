import {
    Dialog,
    Heading,
    Paragraph,
    List
} from "@digdir/designsystemet-react";
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import styles from "./styles/InformationDialogContent.module.css"


const InformationDialogContent: React.FC = () => {

    return (
        <Dialog.Block>
            <Paragraph className={styles.paragraph}>
                Dette betyr at det er kunden som oppgir informasjon og du bekrefter om det stemmer eller ikke. Du skal ikke gi ut noen ny informasjon eller lese opp.
            </Paragraph>
            <List.Unordered className={styles.listContainer}>
                <List.Item>
                    <Paragraph className={styles.listParagraph}>
                        Kunden sier adressen og du bekrefter eller avkrefter at den er riktig 
                    </Paragraph>
                    <CheckmarkIcon title="Bekreft ikon" 
                    className={styles.listIcon}
                    />
                </List.Item>
                <List.Item>
                    <Paragraph>
                        Kunden spør og du leser opp adressen
                    </Paragraph>
                    <XMarkIcon title="Avkreft ikon" />
                </List.Item>
            </List.Unordered>
        </Dialog.Block>
    )
}

export default InformationDialogContent;