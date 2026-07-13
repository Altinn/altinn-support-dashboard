import { Button, Heading, Card } from "@digdir/designsystemet-react";
import styles from "../styles/RoleDetailsUser.module.css";
import RoleTable from "../../ManualRoleSearch/RoleTable";
import { AuthorizedPartyIdentifiers } from "../../../models/rolesModels";
import { UserContactInformationAltinn3 } from "../../../models/models";

interface RoleDetailsUserProps {
  selectedUser: UserContactInformationAltinn3;
  selectedParty: AuthorizedPartyIdentifiers;
  onBack: () => void;
}

export const RoleDetailsUser: React.FC<RoleDetailsUserProps> = ({
  selectedUser,
  selectedParty,
  onBack,
}) => {
  const handleBack = () => {
    onBack();
  };

  const reportee =
    selectedParty.organizationNumber ?? selectedParty.nationalIdentityNumber;

  return (
    <Card data-color="neutral" className={styles.Container}>
      <Heading level={2}>Roller knyttet til {selectedParty.name}</Heading>

      <Button
        data-color="accent"
        className={styles["Button"]}
        onClick={handleBack}
        variant="primary"
      >
        Tilbake til oversikt
      </Button>

      <RoleTable subject={selectedUser.ssnToken} reportee={reportee} />
    </Card>
  );
};
