import { useRoles } from "../../../hooks/hooks";
import { useAppStore } from "../../../stores/Appstore";
import {
  Button,
  Heading,
  Table,
  Card,
  Paragraph,
  Skeleton,
  Alert,
} from "@digdir/designsystemet-react";
import styles from "../styles/RoleDetails.module.css";
import { PersonalContact } from "../../../models/models";
import RoleList from "./RoleList";

interface RoleDetailsProps {
  selectedContact: PersonalContact;
  organizationNumber: string;
  onBack: () => void;
}

export const RoleDetails: React.FC<RoleDetailsProps> = ({
  selectedContact,
  organizationNumber,
  onBack,
}) => {
  const environment = useAppStore((state) => state.environment);

  const roleQuery = useRoles(environment, {
    value: selectedContact.ssnToken,
    partyFilter: [{ value: organizationNumber }],
  });
  const roleInfo = roleQuery.data;

  if (roleQuery.isLoading) {
    return <Skeleton variant="rectangle" height={300} />;
  }
  if (roleQuery.isError) {
    return <Alert data-color="danger">Error when fetching roles</Alert>;
  }

  const handleBack = () => {
    onBack();
  };

  return (
    <Card data-color="neutral" className={styles.Container}>
      <Heading level={2}>Roller knyttet til {selectedContact.name}</Heading>

      <Button
        data-color="accent"
        className={styles["Button"]}
        onClick={handleBack}
        variant="primary"
      >
        Tilbake til oversikt
      </Button>

      <Table border>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Rolletype</Table.HeaderCell>
            <Table.HeaderCell>Rollenavn</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {roleInfo && roleInfo.length >= 1 ? (
            <>
              <RoleList
                roles={roleInfo[0].authorizedAccessPackages}
                type="Tilgangspakke"
              />
              <RoleList
                roles={roleInfo[0].authorizedRoles}
                type="Altinn2 rolle"
              />
              <RoleList
                roles={roleInfo[0].authorizedResources}
                type="Altinn3 Ressurs"
              />
              <RoleList
                roles={roleInfo[0].authorizedInstances}
                type="Altinn3 instanse"
              />
            </>
          ) : (
            <Table.Row>
              <Table.Cell colSpan={2}>
                <Paragraph style={{ textAlign: "center" }}>
                  Ingen roller funnet
                </Paragraph>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Card>
  );
};
