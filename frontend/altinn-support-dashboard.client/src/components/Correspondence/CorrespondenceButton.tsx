import { Button } from "@digdir/designsystemet-react";
import { useMemo } from "react";
import { useCorrespondencePost } from "../../hooks/hooks";
import {
  CorrespondenceResponse,
  CorrespondenceUploadRequest,
  NotificationChannel,
} from "../../models/correspondenceModels";
import {
  buildRecipientUrn,
  RecipientType,
  validateAttachments,
  validateRecipientIdentifier,
} from "./utils/correspondenceValidation";

type CorrespondenceButtonProps = {
  resourceType: string;
  recipientType: RecipientType;
  recipientIdentifier: string;
  title: string;
  summary: string;
  body: string;
  confirmationNeeded: boolean;
  attachments: File[];
  notificationChannel: NotificationChannel;

  setResponseMessage: (responseData: CorrespondenceResponse) => void;
  dueDate: string;
};

const CorrespondenceButton: React.FC<CorrespondenceButtonProps> = ({
  notificationChannel,
  resourceType,
  recipientType,
  recipientIdentifier,
  title,
  summary,
  body,
  confirmationNeeded,
  attachments,
  setResponseMessage,
  dueDate,
}) => {
  const post = useCorrespondencePost();

  const recipientError = useMemo(
    () => validateRecipientIdentifier(recipientType, recipientIdentifier),
    [recipientType, recipientIdentifier]
  );
  const attachmentError = useMemo(
    () => validateAttachments(attachments),
    [attachments]
  );

  const recipientUrn = useMemo(() => {
    if (recipientError) {
      return "";
    }
    return buildRecipientUrn(recipientType, recipientIdentifier);
  }, [recipientType, recipientIdentifier, recipientError]);

  const isDisabled = !recipientUrn || !!attachmentError;

  const handleSendMessage = async () => {
    if (isDisabled) {
      return;
    }

    const correspondence: CorrespondenceUploadRequest = {
      recipients: [recipientUrn],
      correspondence: {
        content: {
          messageBody: body,
          messageSummary: summary,
          messageTitle: title,
        },

        resourceType: resourceType,
        isConfirmationNeeded: confirmationNeeded,
        dueDateTime: dueDate || undefined,
      },
    };
    if (correspondence.correspondence) {
      correspondence.correspondence.notification = {
        notificationTemplate: "GenericAltinnMessage",
        notificationChannel: notificationChannel,
      };
    }
    const response = await post.mutateAsync({
      request: correspondence,
      attachments,
    });
    setResponseMessage(response);
    sessionStorage.setItem("responseMessage", JSON.stringify(response));
  };

  return (
    <div>
      <Button onClick={handleSendMessage} disabled={isDisabled}>
        Send melding
      </Button>
    </div>
  );
};

export default CorrespondenceButton;
