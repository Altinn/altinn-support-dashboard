import { Label, Textarea } from "@digdir/designsystemet-react";

type InputFieldProps = {
  value?: string;
  className?: string;
  onChange: (value: string) => void;
  labelText: string;
};

const MessageInputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  labelText,
  className,
}) => {
  return (
    <div className={`${className ?? ""}`}>
      <Label>{labelText}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

export default MessageInputField;
