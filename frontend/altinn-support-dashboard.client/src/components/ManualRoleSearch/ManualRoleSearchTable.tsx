import { Role } from "./models/manualRoleSearchTypes";
import React from "react";
import RoleTypeCell from "../RoleTypeCell";
import {
  Table
} from "@digdir/designsystemet-react";
import  styles from "./styles/Table.module.css";


interface RoleTableProps {
  roles: Role[];
}

const RoleTable: React.FC<RoleTableProps> = ({ roles }) => {
  return (
    <div className={styles["table-div"]}>
      <Table stickyHeader border data-color="neutral">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>
              Rolletype
            </Table.HeaderCell>
            <Table.HeaderCell>
              Rollenavn
            </Table.HeaderCell>
            <Table.HeaderCell>
              Beskrivelse
            </Table.HeaderCell>
            <Table.HeaderCell>
              Rolledefinisjonskode
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {roles.map((role, index) => (
            <Table.Row key={index}>
              <RoleTypeCell roleType = {role.RoleType} />
              <Table.Cell>{role.RoleName}</Table.Cell>
              <Table.Cell>{role.RoleDescription}</Table.Cell>
              <Table.Cell>{role.RoleDefinitionCode}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};


export default RoleTable;