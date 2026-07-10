import React from "react";
import { Card, Heading, Paragraph, Table } from "@digdir/designsystemet-react";
import { UserContactInformationAltinn3 } from "../../../models/models";
import { formatDate } from "../utils/dateUtils";
import { useAppStore } from "../../../stores/Appstore";
import SsnText from "../../SsnText";
import styles from "../styles/DetailedUserView.module.css";

interface DetailedUserViewProps {
  selectedUser: UserContactInformationAltinn3 | null;
}

const DetailedUserView: React.FC<DetailedUserViewProps> = ({
  selectedUser,
}) => {
  const environment = useAppStore((state) => state.environment);

  return (
    <div className={styles.container}>
      {selectedUser && (
        <div className={styles.userDetails}>
          <Card data-color="neutral" className={styles.identityCard}>
            <Heading level={1} className={styles.userInformation}>
              <span>{selectedUser.name ?? "Ukjent bruker"}</span>
              <Paragraph className={styles.reservedTag}>
                Reservert: {selectedUser.isReserved ? "Ja" : "Nei"}
              </Paragraph>
            </Heading>
            <Paragraph className={styles.ssn}>
              Fødselsnummer:{" "}
              <SsnText contact={selectedUser} environment={environment} />
            </Paragraph>
          </Card>

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
                <Table.Row>
                  <Table.Cell>Mobilnummer</Table.Cell>
                  <Table.Cell>
                    {selectedUser.phoneNumber ?? "Ikke registrert"}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDate(
                      selectedUser.phoneNumberLastUpdatedOrVerified ?? ""
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>E-post</Table.Cell>
                  <Table.Cell>
                    {selectedUser.emailAddress ?? "Ikke registrert"}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDate(
                      selectedUser.emailLastUpdatedOrVerified ?? ""
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DetailedUserView;
