import React from "react";
import { useRoles } from "../../../hooks/hooks";
import { PersonalContact } from "../models/mainContentTypes";
import { useAppStore } from "../../../stores/Appstore";
import RoleTypeCell from "../../RoleTypeCell";
import { Button, 
  Heading,
  Table,
  Card,
  Paragraph
} from '@digdir/designsystemet-react'
import containerStyles from "../styles/RoleDetailsContainer.module.css";
import buttonStyles from "../styles/RoleDetailsButton.module.css"

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

  const roleInfo = useRoles(
    environment,
    selectedContact.socialSecurityNumber,
    organizationNumber,
  ).data;

  const handleBack = () => {
    onBack();
  };

  return (
    <Card>
      <Heading level={2}>
        Roller knyttet til {selectedContact.name}
      </Heading>

      <Button className={buttonStyles["RoleDetailsButton"]} 
      onClick={handleBack}
      variant='secondary'>
        Tilbake til oversikt
      </Button>

      <div className={containerStyles["RoleDetailsContainer"]}>
        <Table stickyHeader>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Rolletype</Table.HeaderCell>
              <Table.HeaderCell>Rollenavn</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {roleInfo && roleInfo.length > 0 ? (
              roleInfo.map((role, index) => (
                <Table.Row key={index}>
                  <RoleTypeCell roleType={role.RoleType} />
                  <Table.Cell>{role.RoleName}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={2}>
                  <Paragraph style={{ textAlign: 'center' }}>
                    Ingen roller funnet
                  </Paragraph>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </Card>
  );
};
