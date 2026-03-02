import {
  Button,
  Heading,
  Card,
  Select,
  Label,
} from "@digdir/designsystemet-react";
import styles from "../styles/RoleDetails.module.css";
import RoleTable from "../../ManualRoleSearch/RoleTable";
import { Organization, PersonalContactAltinn3 } from "../../../models/models";
import { useState } from "react";

interface RoleDetailsProps {
  selectedContact: PersonalContactAltinn3;
  selectedOrg: Organization;
  onBack: () => void;
}

export const RoleDetails: React.FC<RoleDetailsProps> = ({
  selectedContact,
  selectedOrg,
  onBack,
}) => {
  const handleBack = () => {
    onBack();
  };
  const [orgNoFocus, setOrgNoFocus] = useState<string>(
    selectedOrg.organizationNumber,
  );

  const optionCount =
    1 +
    (selectedOrg.headUnit ? 1 : 0) +
    (selectedOrg.subUnits?.length ?? 0);

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
      <Label>Organinisasjon</Label>
      <Select
        className={styles.select}
        value={orgNoFocus}
        onChange={(e) => setOrgNoFocus(e.target.value)}
        disabled={optionCount === 1}
      >
        <Select.Option value={selectedOrg.organizationNumber}>
          {selectedOrg.organizationNumber}
        </Select.Option>
        {selectedOrg.headUnit && (
          <Select.Option value={selectedOrg.headUnit.organizationNumber}>
            {selectedOrg.headUnit.organizationNumber} (hovedenhet)
          </Select.Option>
        )}
        {selectedOrg.subUnits &&
          selectedOrg.subUnits.map((sub: Organization) => (
            <Select.Option
              key={sub.organizationNumber}
              value={sub.organizationNumber}
            >
              {sub.organizationNumber} (underenhet)
            </Select.Option>
          ))}
      </Select>

      <RoleTable subject={selectedContact.ssnToken} reportee={orgNoFocus} />
    </Card>
  );
};
