import { Label, Textarea } from "@digdir/designsystemet-react";

type InputFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  labelText: string;
};

const MessageInputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  labelText,
}) => {
  return (
    <div>
      <Label>{labelText}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

export default MessageInputField;
