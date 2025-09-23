import React, { useState } from "react";
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
import { formatDate } from "../utils/dateUtils";
import { ERRolesSortField, SortDirection } from "../models/mainContentTypes";
import { sortERRoles } from "../utils/contactUtils";
import { useOrgDetails } from "../../../hooks/hooks";
import { useAppStore } from "../../../hooks/Appstore";
import { SelectedOrg } from "../../../models/models";

interface ERRolesTableProps {
  selectedOrg: SelectedOrg;
}

const ERRolesTable: React.FC<ERRolesTableProps> = ({ selectedOrg }) => {
  const environment = useAppStore((state) => state.environment);
  const { ERolesQuery } = useOrgDetails(
    environment,
    selectedOrg.OrganizationNumber,
  );
  const roles = ERolesQuery.data;

  const [erRoleSortField, setERRoleSortField] =
    useState<ERRolesSortField>(null);
  const [erRoleSortDirection, setERRoleSortDirection] =
    useState<SortDirection>(undefined);

  const handleERRoleSort = (field: ERRolesSortField) => {
    if (field === erRoleSortField) {
      if (erRoleSortDirection === "asc") {
        setERRoleSortDirection("desc");
      } else if (erRoleSortDirection === "desc") {
        setERRoleSortField(null);
        setERRoleSortDirection(undefined);
      } else {
        setERRoleSortDirection("asc");
      }
    } else {
      setERRoleSortField(field);
      setERRoleSortDirection("asc");
    }
  };

  const flatERRoles =
    roles
      ?.flatMap((roleGroup) =>
        roleGroup?.roller?.map((role) => ({
          ...role,
          sistEndret: roleGroup.sistEndret,
          // Use the role's own type instead of the group type
          type: role.type || roleGroup.type,
          enhet: role.enhet,
          person: role.person,
          fratraadt: role.fratraadt,
          // Store the group type for reference if needed
          groupType: roleGroup.type,
        })),
      )
      .filter(Boolean) || [];
  const sortedERRoles = sortERRoles(
    flatERRoles,
    erRoleSortField,
    erRoleSortDirection,
  );

  return (
    <TableContainer component={Paper} sx={{ mb: 2, pb: 4 }}>
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
