import {
    Dialog,
    Heading,
    Paragraph,
    List
} from "@digdir/designsystemet-react";
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';



const InformationDialogContent: React.FC = () => {

    return (
        <Dialog.Block>
            <Paragraph>
                Dette betyr at det er kunden som oppgir informasjon og du bekrefter om det stemmer eller ikke. Du skal ikke gi ut noen ny informasjon eller lese opp.
            </Paragraph>
            <List.Unordered>
                <List.Item>
                    <Paragraph>
                        Kunden sier adressen og du bekrefter eller avkrefter at den er riktig 
                    </Paragraph>
                    <CheckmarkIcon title="Bekreft ikon" />
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