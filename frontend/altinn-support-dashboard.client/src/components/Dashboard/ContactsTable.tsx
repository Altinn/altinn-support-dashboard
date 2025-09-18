import React from "react";
import {
  Typography,
  TableContainer,
  Paper,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { PersonalContact } from "./models/mainContentTypes";

interface ContactsTableProps {
  sortedContacts: PersonalContact[];
  sortField: string;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  selectedOrg: { OrganizationNumber: string };
  handleSort: (field: string) => void;
  handleViewRoles: (ssn: string, orgNumber: string) => void;
  setSelectedContact: (personalContact: PersonalContact) => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  sortedContacts,
  sortField,
  sortDirection,
  searchQuery,
  selectedOrg,
  handleSort,
  handleViewRoles,
  setSelectedContact,
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Din kontaktinformasjon
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <MuiTable>
          <TableHead>
            <TableRow>
              <TableCell
                sortDirection={sortField === "name" ? sortDirection : false}
                onClick={() => handleSort("name")}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="subtitle1">Navn</Typography>
              </TableCell>
              <TableCell
                sortDirection={
                  sortField === "socialSecurityNumber" ? sortDirection : false
                }
                onClick={() => handleSort("socialSecurityNumber")}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="subtitle1">Fødselsnummer</Typography>
              </TableCell>
              <TableCell
                sortDirection={
                  sortField === "mobileNumber" ? sortDirection : false
                }
                onClick={() => handleSort("mobileNumber")}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="subtitle1">Mobilnummer</Typography>
              </TableCell>
              <TableCell
                sortDirection={
                  sortField === "eMailAddress" ? sortDirection : false
                }
                onClick={() => handleSort("eMailAddress")}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="subtitle1">E-post</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">Roller</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedContacts.length > 0 ? (
              sortedContacts.map((contact) => (
                <TableRow key={contact.personalContactId}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.socialSecurityNumber}</TableCell>
                  <TableCell>{contact.mobileNumber}</TableCell>
                  <TableCell>{contact.eMailAddress}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedContact(contact);
                        handleViewRoles(
                          contact.socialSecurityNumber,
                          selectedOrg.OrganizationNumber,
                        );
                      }}
                    >
                      Vis
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    {searchQuery.trim().length >= 3
                      ? `Fant ingen resultater for '${searchQuery}'`
                      : "Her var det tomt"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </>
  );
};
