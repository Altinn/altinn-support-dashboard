import { useDashboardStore } from "../../../../stores/DashboardStore";

import { Table, Tooltip, Label } from "@digdir/designsystemet-react";

import { formatDate } from "../../utils/dateUtils";
import { useEffect, useState } from "react";
import classes from "../../styles/ContactInfoCell.module.css";

interface ContactInfoCellProps {
  contact: string | null;
  contactLastChanged: string | null;
}

const ContactInfoCell: React.FC<ContactInfoCellProps> = ({
  contact,
  contactLastChanged,
}) => {
  const userInput = useDashboardStore((s) => s.query.replace(/\s/g, ""));

  const [isBold, setIsBold] = useState<boolean>(false);

  //outlines if searchquery is part of the cell

  useEffect(() => {
    if (contact === userInput) {
      setIsBold(true);
    }
  }, [userInput]);
  return (
    <Table.Cell className={classes.tableCell}>
      {contactLastChanged && (
        <Tooltip content={`Dato endret: ${formatDate(contactLastChanged)}`}>
          <Label className={isBold ? classes.bold : ""}>{contact || "-"}</Label>
        </Tooltip>
      )}
    </Table.Cell>
  );
};

export default ContactInfoCell;
