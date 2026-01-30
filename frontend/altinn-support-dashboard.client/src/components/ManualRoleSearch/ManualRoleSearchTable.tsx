import React from "react";
import { Table } from "@digdir/designsystemet-react";
import styles from "./styles/RoleTable.module.css";
import { Role } from "../../models/models";

interface RoleTableProps {
  roles: Role[];
}

const RoleTable: React.FC<RoleTableProps> = ({ roles }) => {
  return (
    <div className={styles["table-div"]}>
      <Table stickyHeader border data-color="neutral">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Rolletype</Table.HeaderCell>
            <Table.HeaderCell>Rollenavn</Table.HeaderCell>
            <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
            <Table.HeaderCell>Rolledefinisjonskode</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {roles.map((role, index) => (
            <Table.Row key={index}>
              <Table.Cell>{role.roleName}</Table.Cell>
              <Table.Cell>{role.roleDescription}</Table.Cell>
              <Table.Cell>{role.roleDefinitionCode}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default RoleTable;
