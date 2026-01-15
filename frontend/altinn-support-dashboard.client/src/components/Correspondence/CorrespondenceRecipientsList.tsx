import { useState } from "react";
import MessageInputField from "./MessageInputField";
import { Button } from "@digdir/designsystemet-react";
import { toast } from "react-toastify";

const CorrespondenceRecipientsList: React.FC = () => {
  const [recipients, setRecipients] = useState<string[]>([""]);

  const addRecipient = () => {
    setRecipients((prev) => [...prev, ""]);
  };
  const removeRecipient = (index: number) => {
    if (recipients.length <= 1) {
      toast.warning(
        "You need at least one recipient to create a correspondence",
      );
    } else {
      setRecipients((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (index: number, value: string) => {
    setRecipients((prev) =>
      prev.map((recipient, i) => (i === index ? value : recipient)),
    );
  };

  return (
    <div>
      {recipients.map((recipient, index) => {
        return (
          <div key={index}>
            <MessageInputField
              labelText={`Reciepient ${index + 1}`}
              value={recipient}
              onChange={(value) => updateRecipient(index, value)}
            ></MessageInputField>
            <Button onClick={() => removeRecipient(index)}>X</Button>
          </div>
        );
      })}
      <Button onClick={() => addRecipient()}>Add Recipient</Button>
    </div>
  );
};

export default CorrespondenceRecipientsList;
