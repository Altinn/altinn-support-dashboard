import React, {useState} from "react";
import { Table } from "@digdir/designsystemet-react";
import {PersonalContact } from "../models/models";


interface SsnCellProps {
    contact: PersonalContact;
}

const SsnCell: React.FC<SsnCellProps> = ({ contact }) => {
    const [isRedacted, setIsRedacted] = useState(true);

    return (
        <Table.Cell
            onClick={() => setIsRedacted(!isRedacted)}
            style = {{ cursor: "pointer" }}
            title = {isRedacted ? "Vis fullt fødselsnummer" : "Skjul fullt fødselsnummer"}
        >
            {isRedacted ? contact.displayedSocialSecurityNumber : contact.socialSecurityNumber} 
        </Table.Cell>
    )
}

export default SsnCell;