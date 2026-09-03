import { Input, Label, Textarea } from "@digdir/designsystemet-react";

type InputFieldProps = {
  value?: string;
  className?: string;
  onChange: (value: string) => void;
  labelText: string;
  multiline?: boolean;
};

const MessageInputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  labelText,
  className,
  multiline = true,
}) => {
  return (
    <div className={`${className ?? ""}`}>
      <Label>{labelText}</Label>
      {multiline ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
};

export default MessageInputField;
