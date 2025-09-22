import { Role } from "./models/manualRoleSearchTypes";
import React from "react";
import {
  Typography,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface RoleTableProps {
  roles: Role[];
}

const RoleTable: React.FC<RoleTableProps> = ({ roles }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <MuiTable stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1">Rolletype</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Rollenavn</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Beskrivelse</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Rolledefinisjonskode</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role, index) => (
            <TableRow key={index}>
              <TableCell>{role.RoleType}</TableCell>
              <TableCell>{role.RoleName}</TableCell>
              <TableCell>{role.RoleDescription}</TableCell>
              <TableCell>{role.RoleDefinitionCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};


export default RoleTable;