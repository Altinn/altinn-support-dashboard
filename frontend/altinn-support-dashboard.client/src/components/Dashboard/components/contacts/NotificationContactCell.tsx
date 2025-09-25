import { TableCell } from "@mui/material";
import { useDashboardStore } from "../../../../stores/DashboardStore";



interface NotificationContactCellProps {
    contact: string | null;
}


const NotificationContactCell: React.FC<NotificationContactCellProps> = ({ 
    contact
}) => {
    const userInput = useDashboardStore((s) => s.query.replace(/\s/g, ""));
    if (contact === userInput) {
        return <TableCell style= {{fontWeight: "bold"}}>{contact || "-"}</TableCell>
    }
    return <TableCell>{contact || "-"}</TableCell>;
}

export default NotificationContactCell;