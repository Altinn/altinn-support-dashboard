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
import { OfficialContact } from "../../models/mainContentTypes";
import { formatDate } from "../../utils/dateUtils";
import NotificationContactCell from "./NotificationContactCell";
import {
  Table,
  Paragraph,
  Card
 } from "@digdir/designsystemet-react"
import styles from "../../styles/NotificationContact.module.css";

interface ContactFieldTableProps {
  title: string;
  field: keyof OfficialContact;
  changedField: keyof OfficialContact;
  contacts: OfficialContact[];
}

const OfficialContactFieldTable: React.FC<ContactFieldTableProps> = ({
  title,
  field,
  changedField,
  contacts,
}) => {
  const filteredContacts =
    contacts?.filter((contacts) => contacts[field]) || [];
  return (
    <div className={styles["container"]}>
      <Table border>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{title}</Table.HeaderCell>
            <Table.HeaderCell>{"Endret " + title}</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {filteredContacts && filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <Table.Row key={index}>
                <NotificationContactCell
                  contact={contact[field] as string | null}
                />
                <Table.Cell className={styles["cellText"]}>
                  {formatDate(contact[changedField] as string)}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <TableRow>
              <Table.Cell colSpan={2}>
                <Paragraph className={styles["paragraph"]}>
                  Her var det tomt
                </Paragraph>
              </Table.Cell>
            </TableRow>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default OfficialContactFieldTable;
