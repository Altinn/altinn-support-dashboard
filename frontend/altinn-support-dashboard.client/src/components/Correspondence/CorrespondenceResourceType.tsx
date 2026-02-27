import { Label, Select } from "@digdir/designsystemet-react";
import { setLocalStorageValue } from "../ManualRoleSearch/utils/storageUtils";

interface CorrespondenceResourceTypeProps {
  resourceType: string;
  setResourceType: (resourceType: string) => void;
}

const CorrespondenceResourceType: React.FC<CorrespondenceResourceTypeProps> = ({
  resourceType,
  setResourceType,
}) => {
  const handleResourceTypeChange = (resourceType: string) => {
    setResourceType(resourceType);
    setLocalStorageValue("resourceType", resourceType);
  };
  return (
    <div>
      <Label>Hvem skal kunne lese meldingen?</Label>
      <Select
        value={resourceType}
        onChange={(e) => handleResourceTypeChange(e.target.value)}
      >
        <Select.Option value="selfIdentified">Selvidentifisert</Select.Option>
        <Select.Option value="confidentiality">
          Taushetsbelagt post
        </Select.Option>
        <Select.Option value="default">Ordinær post</Select.Option>
      </Select>
    </div>
  );
};

export default CorrespondenceResourceType;
