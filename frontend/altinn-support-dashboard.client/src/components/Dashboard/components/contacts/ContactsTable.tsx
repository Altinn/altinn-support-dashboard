import React, { useState } from "react";
import classes from "../../styles/ContactsTable.module.css";
import { SortDirection } from "../../models/mainContentTypes";
import { filterContacts, sortContacts } from "../../utils/contactUtils";
import { useOrgDetails } from "../../../../hooks/hooks";
import { PersonalContact, SelectedOrg } from "../../../../models/models";
import { useAppStore } from "../../../../stores/Appstore";
import ContactInfoCell from "./ContactInfoCell";
import {
  Button,
  Heading,
  Table,
  TableHeaderCell,
  Label,
  Paragraph,
  Card,
} from "@digdir/designsystemet-react";

interface ContactsTableProps {
  searchQuery: string;
  selectedOrg: SelectedOrg;
  setSelectedContact: (personalContact: PersonalContact) => void;
}

const ContactsTable: React.FC<ContactsTableProps> = ({
  searchQuery,
  selectedOrg,
  setSelectedContact,
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
      if (sortDirection === "ascending") {
        setSortDirection("descending");
      } else if (sortDirection === "descending") {
        setSortField(null);
        setSortDirection(undefined);
      } else {
        setSortDirection("ascending");
      }
    } else {
      setSortField(field);
      setSortDirection("ascending");
    }
  };

  return (
    <Card data-color="neutral" className={classes.tableContainer}>
      <Table data-color="neutral" border>
        <caption>Din kontaktinformasjon</caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell
              className={classes.tableHeaderCell}
              sort={sortField === "name" ? sortDirection : "none"}
              onClick={() => handleSort("name")}
            >
              Navn
            </Table.HeaderCell>
            <Table.HeaderCell
              className={classes.tableHeaderCell}
              sort={
                sortField === "socialSecurityNumber" ? sortDirection : "none"
              }
              onClick={() => handleSort("socialSecurityNumber")}
            >
              Fødselsnummer
            </Table.HeaderCell>
            <Table.HeaderCell
              className={classes.tableHeaderCell}
              sort={sortField === "mobileNumber" ? sortDirection : "none"}
              onClick={() => handleSort("mobileNumber")}
            >
              Mobilnummer
            </Table.HeaderCell>
            <Table.HeaderCell
              className={classes.tableHeaderCell}
              sort={sortField === "eMailAddress" ? sortDirection : "none"}
              onClick={() => handleSort("eMailAddress")}
            >
              E-post
            </Table.HeaderCell>
            <Table.HeaderCell>Roller</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {sortedContacts.length > 0 ? (
            sortedContacts.map((contact, index) => (
              <Table.Row key={`${contact.personalContactId}-${index}`}>
                <Table.Cell>{contact.name}</Table.Cell>
                <Table.Cell>{contact.socialSecurityNumber}</Table.Cell>
                <ContactInfoCell
                  contact={contact.mobileNumber}
                  contactLastChanged={contact.mobileNumberChanged}
                />
                <ContactInfoCell
                  contact={contact.eMailAddress}
                  contactLastChanged={contact.eMailAddressChanged}
                />
                <Table.Cell>
                  <Button
                    data-color="accent"
                    variant="primary"
                    data-size="sm"
                    onClick={() => {
                      setSelectedContact(contact);
                    }}
                  >
                    Vis
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={5}>
                <Paragraph>
                  {searchQuery.trim().length >= 3
                    ? `Fant ingen resultater for '${searchQuery}'`
                    : "Her var det tomt"}
                </Paragraph>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Card>
  );
};

export default ContactsTable;
