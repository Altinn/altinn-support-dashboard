import { Input, Label } from "@digdir/designsystemet-react";
import { setLocalStorageValue } from "../ManualRoleSearch/utils/storageUtils";

interface CorrespondenceDuaDateProps {
  SelectedDateTime: string;
  SetSelectedDateTime: (selectedDateTime: string) => void;
}

const CorrespondenceDueDate: React.FC<CorrespondenceDuaDateProps> = ({
  SelectedDateTime,
  SetSelectedDateTime,
}) => {
  const handleChange = (newDate: string) => {
    setLocalStorageValue("dueDate", newDate);
    SetSelectedDateTime(newDate);
  };

  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 1);

  return (
    <div>
      <Label>Frist</Label>
      <Input
        value={SelectedDateTime}
        min={validDate.toISOString().split("T")[0]}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        type="date"
      />
    </div>
  );
};

export default CorrespondenceDueDate;
