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

  const [isBold, setIsBold] = useState<boolean>(false);

  //outlines if searchquery is part of the cell

  useEffect(() => {
    if (contact?.replace(/\s/g, "").toLowerCase() === userInput.toLowerCase()) {
      setIsBold(true);
    }
  }, [userInput]);
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
