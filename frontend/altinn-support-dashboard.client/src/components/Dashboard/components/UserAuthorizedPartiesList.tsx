import React from "react";
import {
  Card,
  Table,
  Button,
  Paragraph,
  Heading,
} from "@digdir/designsystemet-react";
import { useAppStore } from "../../../stores/Appstore";
import { useAuthorizedParties } from "../../../hooks/hooks";
import styles from "../styles/UserAuthorizedPartiesList.module.css";
import { AuthorizedPartyIdentifiers } from "../../../models/rolesModels";
import SsnText from "../../SsnText";

interface UserAuthorizedPartiesListProps {
  ssnToken?: string;
}

const UserAuthorizedPartiesList: React.FC<UserAuthorizedPartiesListProps> = ({
  ssnToken,
}) => {
  const environment = useAppStore((state) => state.environment);
  const partiesQuery = useAuthorizedParties(environment, ssnToken);
  const parties = partiesQuery.data ?? [];

  return (
    <Card data-color="neutral" className={styles.partiesCard}>
      <Heading level={6}>Rettigheter</Heading>
      <Table border className={styles.partiesTable}>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Navn</Table.HeaderCell>
            <Table.HeaderCell>Org.nr/Fødselsnummer</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {parties.length > 0 ? (
            parties.map((party: AuthorizedPartyIdentifiers, index: number) => {
              const identifier =
                party.organizationNumber ?? party.displayedSocialSecurityNumber;
              return (
                <Table.Row key={`${identifier}-${index}`}>
                  <Table.Cell className={styles.tableCell}>
                    {party.name}
                  </Table.Cell>
                  {party.organizationNumber ? (
                    <Table.Cell className={styles.tableCell}>
                      {identifier}
                    </Table.Cell>
                  ) : (
                    <Table.Cell className={styles.tableCell}>
                      <SsnText contact={party} environment={environment} />
                    </Table.Cell>
                  )}
                  <Table.Cell className={styles.buttonCell}>
                    <Button data-color="accent" variant="primary">
                      Se roller
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Paragraph>Fant ingen rettigheter</Paragraph>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Card>
  );
};

export default UserAuthorizedPartiesList;
