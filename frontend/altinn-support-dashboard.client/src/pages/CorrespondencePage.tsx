import { Checkbox, Heading, Label } from "@digdir/designsystemet-react";
import classes from "./styles/CorrespondencePage.module.css";
import { useState } from "react";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../components/ManualRoleSearch/utils/storageUtils";
import CorrespondenceButton from "../components/Correspondence/CorrespondenceButton";
import MessageInputField from "../components/Correspondence/MessageInputField";
import CorrespondenceResponseField from "../components/Correspondence/CorrespondenceResponseField";
import {
  CorrespondenceResponse,
  NotificationChannel,
} from "../models/correspondenceModels";
import ResponseStatusCode from "../components/Correspondence/ResponseStatusCode";
import { TestFlaskIcon } from "@navikt/aksel-icons";
import CorrespondenceDueDate from "../components/Correspondence/CorrespondenceDueDate";
import CorrespondenceResourceType from "../components/Correspondence/CorrespondenceResourceType";
import CorrespondenceNotificationChannel from "../components/Correspondence/CorrespondenceNotificationChannel";
import CorrespondenceRecipient from "../components/Correspondence/CorrespondenceRecipient";
import CorrespondenceAttachments from "../components/Correspondence/CorrespondenceAttachments";
import { loadRecipientFromStorage } from "../components/Correspondence/utils/correspondenceRecipientStorage";
import { RecipientType } from "../components/Correspondence/utils/correspondenceValidation";

export const CorrespondencePage = () => {
  const initialRecipient = loadRecipientFromStorage();
  const [recipientType, setRecipientType] = useState<RecipientType>(
    initialRecipient.recipientType
  );
  const [recipientIdentifier, setRecipientIdentifier] = useState<string>(
    initialRecipient.recipientIdentifier
  );
  const [attachments, setAttachments] = useState<File[]>([]);
  const [title, setTitle] = useState<string>(getLocalStorageValue("title"));
  const [summary, setSummary] = useState<string>(
    getLocalStorageValue("summary")
  );
  const [body, setBody] = useState<string>(getLocalStorageValue("body"));
  const [confirmationNeeded, setConfirmationNeeded] = useState<boolean>(() => {
    const item = getLocalStorageValue("confirmationNeeded");
    return item ? JSON.parse(item) : false;
  });
  const [notificationChannel, setNotificationChannel] =
    useState<NotificationChannel>(() => {
      const item = getLocalStorageValue("notificationChannel");
      return item ? JSON.parse(item) : -1;
    });

  const [responseMessage, setResponseMessage] =
    useState<CorrespondenceResponse>(() => {
      const item = sessionStorage.getItem("responseMessage");
      return item ? JSON.parse(item) : undefined;
    });

  const [selectedDateTime, setSelectedDateTime] = useState<string>(
    getLocalStorageValue("dueDate")
  );
  const [resourceType, setResourceType] = useState<string>(
    getLocalStorageValue("resourceType") || "default"
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
          <CorrespondenceRecipient
            recipientType={recipientType}
            setRecipientType={setRecipientType}
            recipientIdentifier={recipientIdentifier}
            setRecipientIdentifier={setRecipientIdentifier}
          />
          <MessageInputField
            className={classes.messageField}
            labelText="Meldingstittel"
            multiline={false}
            value={title}
            onChange={(value) => {
              setTitle(value);
              setLocalStorageValue("title", value);
            }}
          />
          <MessageInputField
            className={classes.messageField}
            labelText="Sammendrag"
            value={summary}
            onChange={(value) => {
              setSummary(value);
              setLocalStorageValue("summary", value);
            }}
          />
          <MessageInputField
            className={classes.messageField}
            labelText="Meldingstekst"
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
          <CorrespondenceNotificationChannel
            setChannel={setNotificationChannel}
            channel={notificationChannel}
          />
          <CorrespondenceResourceType
            resourceType={resourceType}
            setResourceType={setResourceType}
          />
          <CorrespondenceDueDate
            SelectedDateTime={selectedDateTime}
            SetSelectedDateTime={setSelectedDateTime}
          />
          <CorrespondenceAttachments
            attachments={attachments}
            setAttachments={setAttachments}
          />
          <CorrespondenceButton
            resourceType={resourceType}
            dueDate={selectedDateTime}
            recipientType={recipientType}
            recipientIdentifier={recipientIdentifier}
            title={title}
            summary={summary}
            body={body}
            confirmationNeeded={confirmationNeeded}
            notificationChannel={notificationChannel}
            attachments={attachments}
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
