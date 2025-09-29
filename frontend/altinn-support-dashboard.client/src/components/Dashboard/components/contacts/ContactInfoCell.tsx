import { IconButton, TableCell, Tooltip } from "@mui/material";
import { useDashboardStore } from "../../../../stores/DashboardStore";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
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
      {contact || "-"}
      {contactLastChanged && (
        <Tooltip title={formatDate(contactLastChanged)}>
          <IconButton>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      )}
    </TableCell>
  );
};

export default ContactInfoCell;
