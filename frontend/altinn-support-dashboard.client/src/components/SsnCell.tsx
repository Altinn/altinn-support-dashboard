import React, { useEffect, useState} from "react";
import { Table } from "@digdir/designsystemet-react";
import { PersonalContact } from "../models/models";
import { useSsnFromToken } from "../hooks/hooks";


interface SsnCellProps {
    contact: PersonalContact;
    environment?: string;
}

const SsnCell: React.FC<SsnCellProps> = ({ contact, environment }) => {
    const [isRedacted, setIsRedacted] = useState(true);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const { data: unredactedSsn, refetch } = useSsnFromToken(
        environment || "",
        contact.ssnToken,
    );

    const handleClick = async () => {
        if (!unredactedSsn) {
            try{
                await refetch();
                setIsRedacted(false);
            } catch (error) {
                console.error("Error fetching unredacted SSN:", error);
            }
        } else {
            setIsRedacted(!isRedacted);
        }
    };

    useEffect(() => {
        if (!isRedacted && unredactedSsn) {
            timeoutRef.current = setTimeout(() => {
                setIsRedacted(true);
            }, 5000);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isRedacted, unredactedSsn])

    return (
        <Table.Cell
            onClick={handleClick}
            style={{ cursor: "pointer" }}
            title={isRedacted ? "Vis fullt fødselsnummer" : "Skjul fullt fødselsnummer"}
        >
            {!isRedacted && unredactedSsn ? unredactedSsn : contact.displayedSocialSecurityNumber}
        </Table.Cell>
    )
}

export default SsnCell;