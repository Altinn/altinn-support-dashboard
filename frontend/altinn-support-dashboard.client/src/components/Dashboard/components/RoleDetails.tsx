import { Button, Heading, Card } from "@digdir/designsystemet-react";
import styles from "../styles/RoleDetails.module.css";
import { PersonalContact } from "../../../models/models";
import RoleTable from "../../ManualRoleSearch/RoleTable";

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
      <RoleTable
        subject={selectedContact.ssnToken}
        reportee={organizationNumber}
      />
    </Card>
  );
};
