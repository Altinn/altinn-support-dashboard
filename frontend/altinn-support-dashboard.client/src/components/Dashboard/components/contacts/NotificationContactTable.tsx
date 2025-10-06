import React from "react";
import { OfficialContact } from "../../models/mainContentTypes";
import { formatDate } from "../../utils/dateUtils";
import NotificationContactCell from "./NotificationContactCell";
import { Table, Paragraph } from "@digdir/designsystemet-react";
import styles from "../../styles/NotificationContactTable.module.css";

interface ContactFieldTableProps {
  title: string;
  field: keyof OfficialContact;
  changedField: keyof OfficialContact;
  contacts: OfficialContact[];
}

const NotificationContactTable: React.FC<ContactFieldTableProps> = ({
  title,
  field,
  changedField,
  contacts,
}) => {
  const filteredContacts =
    contacts?.filter((contacts) => contacts[field]) || [];
  return (
    <div className={styles["container"]}>
      <Table border className={styles["table"]}>
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
            <Table.Row>
              <Table.Cell colSpan={2}>
                <Paragraph className={styles["paragraph"]}>
                  Her var det tomt
                </Paragraph>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default NotificationContactTable;
