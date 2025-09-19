import React from "react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { formatDate } from "./utils/dateUtils";

interface ERRolle {
  type?: { beskrivelse?: string };
  person?: {
    navn?: { fornavn?: string; etternavn?: string };
    erDoed?: boolean;
  };
  enhet?: {
    navn?: string[];
    organisasjonsnummer?: string;
    erSlettet?: boolean;
  };
  sistEndret?: string;
  fratraadt?: boolean;
}

interface ERRolesTableProps {
  sortedERRoles: ERRolle[];
  erRoleSortField: string;
  erRoleSortDirection: "asc" | "desc";
  handleERRoleSort: (field: string) => void;
}

const ERRolesTable: React.FC<ERRolesTableProps> = ({
  sortedERRoles,
  erRoleSortField,
  erRoleSortDirection,
  handleERRoleSort,
}) => {
  return (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <MuiTable>
        <TableHead>
          <TableRow>
            <TableCell
              sortDirection={
                erRoleSortField === "type" ? erRoleSortDirection : false
              }
              onClick={() => handleERRoleSort("type")}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="subtitle1">Rolletype</Typography>
            </TableCell>
            <TableCell
              sortDirection={
                erRoleSortField === "person" ? erRoleSortDirection : false
              }
              onClick={() => handleERRoleSort("person")}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="subtitle1">Person/Virksomhet</Typography>
            </TableCell>
            <TableCell
              sortDirection={
                erRoleSortField === "sistEndret" ? erRoleSortDirection : false
              }
              onClick={() => handleERRoleSort("sistEndret")}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="subtitle1">Dato Endret</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Status</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedERRoles && sortedERRoles.length > 0 ? (
            sortedERRoles.map((role, index) => (
              <TableRow key={index}>
                <TableCell>{role.type?.beskrivelse || ""}</TableCell>
                <TableCell>
                  {role.person
                    ? `${role.person?.navn?.fornavn || ""} ${role.person?.navn?.etternavn || ""}`.trim()
                    : role.enhet
                      ? `${role.enhet.navn?.[0] || ""} (${role.enhet.organisasjonsnummer})`
                      : ""}
                </TableCell>
                <TableCell>{formatDate(role.sistEndret)}</TableCell>
                <TableCell>
                  {role.fratraadt ? "Fratrådt" : "Aktiv"}
                  {role.person?.erDoed ? " (Død)" : ""}
                  {role.enhet?.erSlettet ? " (Slettet)" : ""}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Ingen roller funnet
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default ERRolesTable;
