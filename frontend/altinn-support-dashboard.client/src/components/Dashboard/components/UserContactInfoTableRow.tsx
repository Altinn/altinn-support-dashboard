import React from "react";
import { Table } from "@digdir/designsystemet-react";
import { formatDate } from "../utils/dateUtils";

interface UserContactInfoTableRowProps {
  label: string;
  value?: string;
  lastUpdatedOrVerified?: string;
}

const UserContactInfoTableRow: React.FC<UserContactInfoTableRowProps> = ({
  label,
  value,
  lastUpdatedOrVerified,
}) => {
  return (
    <Table.Row>
      <Table.Cell>{label}</Table.Cell>
      <Table.Cell>{value ?? "Ikke registrert"}</Table.Cell>
      <Table.Cell>{formatDate(lastUpdatedOrVerified ?? "")}</Table.Cell>
    </Table.Row>
  );
};

export default UserContactInfoTableRow;
