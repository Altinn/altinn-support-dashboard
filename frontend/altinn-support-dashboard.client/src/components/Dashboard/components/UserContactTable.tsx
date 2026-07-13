import React from "react";
import { Card, Heading, Table } from "@digdir/designsystemet-react";
import { UserContactInformationAltinn3 } from "../../../models/models";
import UserContactInfoTableRow from "./UserContactInfoTableRow";
import styles from "../styles/UserContactTable.module.css";

interface UserContactTableProps {
  selectedUser: UserContactInformationAltinn3;
}

const UserContactTable: React.FC<UserContactTableProps> = ({
  selectedUser,
}) => {
  return (
    <Card data-color="neutral" className={styles.contactCard}>
      <Heading level={6}>Kontaktinformasjon</Heading>
      <Table border className={styles.contactTable}>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Verdi</Table.HeaderCell>
            <Table.HeaderCell>Sist endret/bekreftet</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <UserContactInfoTableRow
            label="Mobilnummer"
            value={selectedUser.phoneNumber}
            lastUpdatedOrVerified={selectedUser.phoneNumberLastUpdatedOrVerified}
          />
          <UserContactInfoTableRow
            label="E-post"
            value={selectedUser.emailAddress}
            lastUpdatedOrVerified={selectedUser.emailLastUpdatedOrVerified}
          />
        </Table.Body>
      </Table>
    </Card>
  );
};

export default UserContactTable;
