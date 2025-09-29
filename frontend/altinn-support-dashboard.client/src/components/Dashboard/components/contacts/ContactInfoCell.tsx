import { Box, TableCell, Tooltip } from "@mui/material";
import { useDashboardStore } from "../../../../stores/DashboardStore";

import { formatDate } from "../../utils/dateUtils";

interface ContactInfoCellProps {
  contact: string | null;
  contactLastChanged: string | null;
}

const ContactInfoCell: React.FC<ContactInfoCellProps> = ({
  contact,
  contactLastChanged,
}) => {
  const userInput = useDashboardStore((s) => s.query.replace(/\s/g, ""));
  var sxProps = {};

  //outlines if searchquery is part of the cell
  if (contact === userInput) {
    sxProps = {
      fontWeight: "bold",
    };
  }

  return (
    <TableCell sx={sxProps}>
      {contactLastChanged && (
        <Tooltip title={`Dato endret: ${formatDate(contactLastChanged)}`}>
          <Box>{contact || "-"}</Box>
        </Tooltip>
      )}
    </TableCell>
  );
};

export default ContactInfoCell;
