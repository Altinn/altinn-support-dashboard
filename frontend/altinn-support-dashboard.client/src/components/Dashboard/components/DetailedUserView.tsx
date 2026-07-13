import React, { useEffect, useState } from "react";
import { Card, Heading, Paragraph, Table } from "@digdir/designsystemet-react";
import { UserContactInformationAltinn3 } from "../../../models/models";
import { AuthorizedPartyIdentifiers } from "../../../models/rolesModels";
import { useAppStore } from "../../../stores/Appstore";
import SsnText from "../../SsnText";
import UserContactInfoTableRow from "./UserContactInfoTableRow";
import UserAuthorizedPartiesList from "./UserAuthorizedPartiesList";
import { RoleDetailsUser } from "./RoleDetailsUser";
import styles from "../styles/DetailedUserView.module.css";

interface DetailedUserViewProps {
  selectedUser: UserContactInformationAltinn3 | null;
}

const DetailedUserView: React.FC<DetailedUserViewProps> = ({
  selectedUser,
}) => {
  const environment = useAppStore((state) => state.environment);
  const [selectedParty, setSelectedParty] =
    useState<AuthorizedPartyIdentifiers | null>(null);

  useEffect(() => {
    setSelectedParty(null);
  }, [selectedUser]);

  return (
    <div className={styles.container}>
      {selectedUser && (
        <div className={styles.userDetails}>
          {selectedParty ? (
            <RoleDetailsUser
              selectedUser={selectedUser}
              selectedParty={selectedParty}
              onBack={() => setSelectedParty(null)}
            />
          ) : (
            <>
              <Paragraph className={styles.reservedTag}>
                Reservert: {selectedUser.isReserved ? "Ja" : "Nei"}
              </Paragraph>
              <Heading level={1} className={styles.userInformation}>
                <span>{selectedUser.name ?? "Ukjent bruker"}</span>
              </Heading>
              <Paragraph variant="short" className={styles.ssn}>
                <strong>Fødselsnummer: </strong>
                <SsnText contact={selectedUser} environment={environment} />
              </Paragraph>

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
                      lastUpdatedOrVerified={
                        selectedUser.phoneNumberLastUpdatedOrVerified
                      }
                    />
                    <UserContactInfoTableRow
                      label="E-post"
                      value={selectedUser.emailAddress}
                      lastUpdatedOrVerified={
                        selectedUser.emailLastUpdatedOrVerified
                      }
                    />
                  </Table.Body>
                </Table>
              </Card>

              <UserAuthorizedPartiesList
                ssnToken={selectedUser.ssnToken}
                onSelectParty={setSelectedParty}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailedUserView;
