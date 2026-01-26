import { Label, Select } from "@digdir/designsystemet-react";

interface CorrespondenceResourceTypeProps {
  resourceType: string;
  setResourceType: (resourceType: string) => void;
}

const CorrespondenceResourceType: React.FC<CorrespondenceResourceTypeProps> = ({
  resourceType,
  setResourceType,
}) => {
  return (
    <div>
      <Label>Hvem skal kunne lese meldingen?</Label>
      <Select
        value={resourceType}
        onChange={(e) => setResourceType(e.target.value)}
      >
        <Select.Option value="default">Ordinær</Select.Option>
        <Select.Option value="confidentiality">
          Taushetsbelagt post
        </Select.Option>
      </Select>
    </div>
  );
};

export default CorrespondenceResourceType;
