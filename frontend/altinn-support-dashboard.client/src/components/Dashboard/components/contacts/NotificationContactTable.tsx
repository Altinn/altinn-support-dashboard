import React from "react";
import { formatDate } from "../../utils/dateUtils";
import NotificationContactCell from "./NotificationContactCell";
import { Table, Paragraph } from "@digdir/designsystemet-react";
import styles from "../../styles/NotificationContactTable.module.css";
import { NotificationAdresses } from "../../../../models/models";

interface ContactFieldTableProps {
  title: string;
  field: keyof NotificationAdresses;
  changedField: keyof NotificationAdresses;
  contacts: NotificationAdresses[];
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
            <Table.HeaderCell className={styles.tableCell}>
              {title}
            </Table.HeaderCell>
            <Table.HeaderCell className={styles.tableCell}>
              {"Endret " + title}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {filteredContacts && filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <Table.Row key={index}>
                <NotificationContactCell
                  contact={contact}
                  field={field}
                />
                <Table.Cell className={styles["cellText"]}>
                  {formatDate(contact[changedField] as string)}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={2}>
                <Paragraph className={styles["cellText"]}>
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
