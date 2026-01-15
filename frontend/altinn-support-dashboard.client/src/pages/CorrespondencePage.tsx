import { Heading, Input } from "@digdir/designsystemet-react";
import CorrespondenceCheckbox from "../components/Correspondence/CorrespondenceCheckbox";
import style from "./styles/CorrespondencePage.module.css";
import MessageBody from "../components/Correspondence/MessageBody";
import MessageSummary from "../components/Correspondence/MessageSummary";
import { useState } from "react";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../components/ManualRoleSearch/utils/storageUtils";
import CorrespondenceButton from "../components/Correspondence/CorrespondenceButton";
import MessageInputField from "../components/Correspondence/MessageInputField";

export const CorrespondencePage = () => {
  const [recipient, setRecipient] = useState<string>(
    getLocalStorageValue("recipient"),
  );
  const [title, setTitle] = useState<string>(getLocalStorageValue("title"));
  const [summary, setSummary] = useState<string>(
    getLocalStorageValue("summary"),
  );
  const [body, setBody] = useState<string>(getLocalStorageValue("body"));

  return (
    <div>
      <Heading className={style["heading"]} level={1} data-size="sm">
        Opprett melding for test
      </Heading>

      <Input
        value={recipient}
        onChange={(value) => {
          setRecipient(value);
          setLocalStorageValue("recipient", value);
        }}
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

      <CorrespondenceCheckbox />

      <CorrespondenceButton
        recipient={recipient}
        title={title}
        summary={summary}
        body={body}
        checked={true}
      />
    </div>
  );
};

