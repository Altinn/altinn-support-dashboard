import { TableCell } from "@mui/material";
import { useDashboardStore } from "../../../../stores/DashboardStore";

interface NotificationContactCellProps {
  contact: string | null;
}

const NotificationContactCell: React.FC<NotificationContactCellProps> = ({
  contact,
}) => {
  const userInput = useDashboardStore((s) => s.query.replace(/\s/g, ""));
  var sxProps = {};

  //outlines if searchquery is part of the cell
  if (contact === userInput) {
    sxProps = {
      fontWeight: "bold",
    };
  }

  return <TableCell sx={sxProps}>{contact || "-"}</TableCell>;
};

export default NotificationContactCell;
