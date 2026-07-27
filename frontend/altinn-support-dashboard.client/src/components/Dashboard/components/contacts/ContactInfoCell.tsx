import { useDashboardStore } from "../../../../stores/DashboardStore";

import { Tooltip, Label } from "@digdir/designsystemet-react";

import { formatDate } from "../../utils/dateUtils";
import { useEffect, useState } from "react";
import classes from "../../styles/ContactInfoCell.module.css";

interface ContactInfoCellProps {
  contact?: string;
  contactLastChanged?: string;
}

const ContactInfoCell: React.FC<ContactInfoCellProps> = ({
  contact,
  contactLastChanged,
}) => {
  const userInput = useDashboardStore((s) => s.query.replace(/\s/g, ""));


  //outlines if searchquery is part of the cell

  const isBold =
    !!contact &&
    userInput.length > 0 &&
    contact.replace(/\s/g, "").toLowerCase().includes(userInput.toLowerCase());

  return (
    <div>
      {contactLastChanged && (
        <Tooltip content={`Dato endret: ${formatDate(contactLastChanged)}`}>
          <Label className={isBold ? classes.bold : ""}>{contact || ""}</Label>
        </Tooltip>
      )}
    </div>
  );
};

export default ContactInfoCell;
