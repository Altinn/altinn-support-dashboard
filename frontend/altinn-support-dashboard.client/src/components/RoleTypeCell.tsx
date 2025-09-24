import React from "react";
import { TableCell } from "@mui/material";


interface RoleTypeCellProps {
    roleType: string;
}

const RoleTypeCell: React.FC<RoleTypeCellProps> = ({ roleType }) => {
    if (roleType === "External") return <TableCell>Rolle fra BRREG</TableCell>;
    else if (roleType === "Local") return <TableCell>Egenskapt rolle</TableCell>
    else return <TableCell>{roleType}</TableCell>;
}

export default RoleTypeCell;