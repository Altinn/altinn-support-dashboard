import { Checkbox, Heading, Label } from "@digdir/designsystemet-react";
import style from "./styles/CorrespondencePage.module.css";
import { useState } from "react";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../components/ManualRoleSearch/utils/storageUtils";
import CorrespondenceButton from "../components/Correspondence/CorrespondenceButton";
import MessageInputField from "../components/Correspondence/MessageInputField";
import CorrespondenceRecipientsList from "../components/Correspondence/CorrespondenceRecipientsList";

export const CorrespondencePage = () => {
  const [recipients, setRecipients] = useState<string[]>(() => {
    const item = getLocalStorageValue("recipients");
    return item ? JSON.parse(item) : [""];
  });
  const [title, setTitle] = useState<string>(getLocalStorageValue("title"));
  const [summary, setSummary] = useState<string>(
    getLocalStorageValue("summary"),
  );
  const [body, setBody] = useState<string>(getLocalStorageValue("body"));
  const [confirmationNeeded, setConfirmationNeeded] = useState<boolean>(() => {
    const item = getLocalStorageValue("confirmationNeeded");
    return item ? JSON.parse(item) : false;
  });

  const handleConfirmationChange = (bool: boolean) => {
    setConfirmationNeeded(bool);
    setLocalStorageValue("confirmationNeeded", JSON.stringify(bool));
  };

  return (
    <div>
      <Heading className={style["heading"]} level={1} data-size="sm">
        Opprett melding for test
      </Heading>

      <CorrespondenceRecipientsList
        recipients={recipients}
        setRecipients={setRecipients}
      />

      <MessageInputField
        labelText="Message title"
        value={title}
        onChange={(value) => {
          setTitle(value);
          setLocalStorageValue("title", value);
        }}
      />
      <MessageInputField
        labelText="Message summary"
        value={summary}
        onChange={(value) => {
          setSummary(value);
          setLocalStorageValue("summary", value);
        }}
      />
      <MessageInputField
        labelText="Message body"
        value={body}
        onChange={(value) => {
          setBody(value);
          setLocalStorageValue("body", value);
        }}
      />

      <Label>Trengs det bekreftelse?</Label>
      <Checkbox
        checked={confirmationNeeded}
        onChange={(e) => handleConfirmationChange(e.target.checked)}
        label="Ja"
      />

      <CorrespondenceButton
        recipients={recipients}
        title={title}
        summary={summary}
        body={body}
        checked={confirmationNeeded}
      />
    </div>
  );
};

