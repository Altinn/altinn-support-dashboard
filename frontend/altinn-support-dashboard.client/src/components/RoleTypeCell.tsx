import React from "react";
import { Table } from "@digdir/designsystemet-react";


interface RoleTypeCellProps {
    roleType: string;
}

const RoleTypeCell: React.FC<RoleTypeCellProps> = ({ roleType }) => {
    if (roleType === "External") return <Table.Cell>Rolle fra BRREG</Table.Cell>;
    else if (roleType === "Local") return <Table.Cell>Egendefinert rolle</Table.Cell>
    else return <Table.Cell>{roleType}</Table.Cell>;
}

export default RoleTypeCell;