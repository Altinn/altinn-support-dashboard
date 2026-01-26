import { Input } from "@digdir/designsystemet-react";

interface CorrespondenceDuaDateProps {
  SelectedDateTime: string;
  SetSelectedDateTime: (selectedDateTime: string) => void;
}

const CorrespondenceDueDate: React.FC<CorrespondenceDuaDateProps> = ({
  SelectedDateTime,
  SetSelectedDateTime,
}) => {
  const handleChange = (newDate: string) => {
    SetSelectedDateTime(newDate);
  };

  return (
    <Input
      value={SelectedDateTime}
      min={new Date().toISOString().split("T")[0]}
      onChange={(e) => {
        handleChange(e.target.value);
      }}
      type="date"
    />
  );
};

export default CorrespondenceDueDate;
