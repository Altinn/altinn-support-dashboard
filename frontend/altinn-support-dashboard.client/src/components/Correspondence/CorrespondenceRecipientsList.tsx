import { Button, Input } from "@digdir/designsystemet-react";
import { toast } from "react-toastify";
import classes from "./styles/CorrespondenceRecipientsList.module.css";
import { setLocalStorageValue } from "../ManualRoleSearch/utils/storageUtils";
import { useEffect } from "react";

interface CorrespondenceRecipientsProps {
  setRecipients: React.Dispatch<React.SetStateAction<string[]>>;
  recipients: string[];
}

const CorrespondenceRecipientsList: React.FC<CorrespondenceRecipientsProps> = ({
  setRecipients,
  recipients,
}) => {
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

  useEffect(() => {
    setLocalStorageValue("recipients", JSON.stringify(recipients));
  }, [recipients]);

  return (
    <div className={classes.container}>
      {recipients.map((recipient, index) => {
        return (
          <div key={index} className={classes.inputFieldContainer}>
            <label>{`Reciepient ${index + 1}`}</label>
            <Input
              className={classes.inputField}
              value={recipient}
              onChange={(recipient) =>
                updateRecipient(index, recipient.target.value)
              }
            ></Input>
            <Button
              variant="secondary"
              className={classes.removeButton}
              onClick={() => removeRecipient(index)}
            >
              X
            </Button>
          </div>
        );
      })}
      <Button className={classes.addButton} onClick={() => addRecipient()}>
        Add Recipient
      </Button>
    </div>
  );
};

export default CorrespondenceRecipientsList;
