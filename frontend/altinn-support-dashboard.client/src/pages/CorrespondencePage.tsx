import { Checkbox, Heading, Label } from "@digdir/designsystemet-react";
import classes from "./styles/CorrespondencePage.module.css";
import { useState } from "react";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../components/ManualRoleSearch/utils/storageUtils";
import CorrespondenceButton from "../components/Correspondence/CorrespondenceButton";
import MessageInputField from "../components/Correspondence/MessageInputField";
import CorrespondenceRecipientsList from "../components/Correspondence/CorrespondenceRecipientsList";
import CorrespondenceResponseField from "../components/Correspondence/CorrespondenceResponseField";
import { CorrespondenceResponse } from "../models/correspondenceModels";
import ResponseStatusCode from "../components/Correspondence/ResponseStatusCode";
import { TestFlaskIcon } from "@navikt/aksel-icons";
import CorrespondenceDueDate from "../components/Correspondence/CorrespondenceDueDate";
import CorrespondenceResourceType from "../components/Correspondence/CorrespondenceResourceType";

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

  const [responseMessage, setResponseMessage] =
    useState<CorrespondenceResponse>(() => {
      const item = sessionStorage.getItem("responseMessage");
      return item ? JSON.parse(item) : undefined;
    });

  const [selectedDateTime, setSelectedDateTime] = useState<string>(
    getLocalStorageValue("dueDate"),
  );
  const [resourceType, setResourceType] = useState<string>(
    getLocalStorageValue("resourceType") || "default",
  );

  const handleConfirmationChange = (bool: boolean) => {
    setConfirmationNeeded(bool);
    setLocalStorageValue("confirmationNeeded", JSON.stringify(bool));
  };

  return (
    <div>
      <Heading className={classes.heading} level={1} data-size="sm">
        Opprett melding for test
        <TestFlaskIcon title="Beta" />
      </Heading>

      <div className={classes.container}>
        <div className={classes.formContainer}>
          <CorrespondenceRecipientsList
            recipients={recipients}
            setRecipients={setRecipients}
          />
          <MessageInputField
            className={classes.messageField}
            labelText="Melding title"
            value={title}
            onChange={(value) => {
              setTitle(value);
              setLocalStorageValue("title", value);
            }}
          />
          <MessageInputField
            className={classes.messageField}
            labelText="Melding summary"
            value={summary}
            onChange={(value) => {
              setSummary(value);
              setLocalStorageValue("summary", value);
            }}
          />
          <MessageInputField
            className={classes.messageField}
            labelText="Melding body"
            value={body}
            onChange={(value) => {
              setBody(value);
              setLocalStorageValue("body", value);
            }}
          />
          <Label className={classes.checkboxLabel}>
            Trengs det bekreftelse?
          </Label>
          <Checkbox
            className={classes.checkbox}
            checked={confirmationNeeded}
            onChange={(e) => handleConfirmationChange(e.target.checked)}
            label="Ja"
          />

          <CorrespondenceResourceType
            resourceType={resourceType}
            setResourceType={setResourceType}
          />
          <CorrespondenceDueDate
            SelectedDateTime={selectedDateTime}
            SetSelectedDateTime={setSelectedDateTime}
          />
          <CorrespondenceButton
            resourceType={resourceType}
            dueDate={selectedDateTime}
            recipients={recipients}
            title={title}
            summary={summary}
            body={body}
            checked={confirmationNeeded}
            setResponseMessage={setResponseMessage}
          />
        </div>

        <div className={classes.responseContainer}>
          {responseMessage && (
            <div>
              <ResponseStatusCode
                statuscode={Number.parseInt(responseMessage?.statusCode)}
              />
              <CorrespondenceResponseField responseData={responseMessage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
