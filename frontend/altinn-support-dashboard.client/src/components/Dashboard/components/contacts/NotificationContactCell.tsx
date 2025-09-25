import { TableCell } from "@mui/material";



interface NotificationContactCellProps {
    contact: string | null;
    userInput?: string;
}


const NotificationContactCell: React.FC<NotificationContactCellProps> = ({ 
    contact, userInput 
}) => {
    if (contact === userInput) {
        return <TableCell style= {{fontWeight: "bold"}}>{contact || "-"}</TableCell>
    }
    return <TableCell>{contact || "-"}</TableCell>;
}

export default NotificationContactCell;