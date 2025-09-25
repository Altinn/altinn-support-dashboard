import React, { useState } from "react";
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
import { PersonalContact, SortDirection } from "../../models/mainContentTypes";
import { filterContacts, sortContacts } from "../../utils/contactUtils";
import { useOrgDetails } from "../../../../hooks/hooks";
import { SelectedOrg } from "../../../../models/models";
import { useAppStore } from "../../../../stores/Appstore";
import NotificationContactCell from "./NotificationContactCell";

interface ContactsTableProps {
  searchQuery: string;
  selectedOrg: SelectedOrg;
  setSelectedContact: (personalContact: PersonalContact) => void;
  userInput: string;
}

const ContactsTable: React.FC<ContactsTableProps> = ({
  searchQuery,
  selectedOrg,
  setSelectedContact,
  userInput
}) => {
  const [sortField, setSortField] = useState<keyof PersonalContact | null>(
    null,
  );

  const environment = useAppStore((state) => state.environment);
  const { contactsQuery } = useOrgDetails(
    environment,
    selectedOrg?.OrganizationNumber,
  );

  const filteredContacts = filterContacts(
    contactsQuery.data || [],
    searchQuery,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined);
  const sortedContacts = sortContacts(
    filteredContacts,
    sortField,
    sortDirection,
  );

  const handleSort = (field: keyof PersonalContact) => {
    if (field === sortField) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(undefined);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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
              sortedContacts.map((contact, index) => (
                <TableRow key={`${contact.personalContactId}-${index}`}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.socialSecurityNumber}</TableCell>
                  <NotificationContactCell 
                    contact={contact.mobileNumber}
                    userInput={userInput}
                  />
                  <NotificationContactCell 
                    contact={contact.eMailAddress} 
                    userInput={userInput} 
                  />
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedContact(contact);
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

export default ContactsTable;
