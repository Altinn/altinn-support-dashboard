import React, {useState} from "react";
import { Table } from "@digdir/designsystemet-react";
import {PersonalContact } from "../models/models";


interface SsnCellProps {
    contact: PersonalContact;
    environment?: string;
}

const SsnCell: React.FC<SsnCellProps> = ({ contact, environment }) => {
    const [isRedacted, setIsRedacted] = useState(true);
    const [unredactedSsn, setUnredactedSsn] = useState<string | null>(null);

    console.log("ssn token:", contact.ssnToken);
    console.log("environment:", environment);

    const handleClick = async () => {
        console.log('Clicked!', { 
        hasUnredacted: !!unredactedSsn, 
        token: contact.ssnToken,
        env: environment 
    });
        if (!unredactedSsn) {
            try {
                const response = await fetch(`/api/${environment}/serviceowner/personalcontacts/${contact.ssnToken}/ssn`);
                console.log("Fetch response:", response);

                if (response.ok) {
                    const data = await response.json();
                    setUnredactedSsn(data.socialSecurityNumber);
                    setIsRedacted(false);
                }
            } catch (error) {
                console.error("Error fetching unredacted SSN:", error);
            }
        } else {
            setIsRedacted(!isRedacted);
        }
    };

    return (
        <Table.Cell
            onClick={handleClick}
            style = {{ cursor: "pointer" }}
            title = {isRedacted ? "Vis fullt fødselsnummer" : "Skjul fullt fødselsnummer"}
        >
            {!isRedacted && unredactedSsn ? unredactedSsn : contact.displayedSocialSecurityNumber} 
        </Table.Cell>
    )
}

export default SsnCell;