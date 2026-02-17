import { Button } from "@digdir/designsystemet-react";
import { useCorrespondencePost } from "../../hooks/hooks";
import {
  CorrespondenceResponse,
  CorrespondenceUploadRequest,
  NotificationChannel,
} from "../../models/correspondenceModels";

type CorrespondenceButtonProps = {
  resourceType: string;
  recipients: string[];
  title: string;
  summary: string;
  body: string;
  confirmationNeeded: boolean;
  notificationChannel: NotificationChannel | null;

  setResponseMessage: (responseData: CorrespondenceResponse) => void;
  dueDate: string;
};

const CorrespondenceButton: React.FC<CorrespondenceButtonProps> = ({
  notificationChannel,
  resourceType,
  recipients,
  title,
  summary,
  body,
  confirmationNeeded,
  setResponseMessage,
  dueDate,
}) => {
  const post = useCorrespondencePost();
  const filteredRecipients = recipients.filter(Boolean);
  const handleSendMessage = async () => {
    const correspondence: CorrespondenceUploadRequest = {
      recipients: filteredRecipients,
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
    //sets notification options
    if (correspondence.correspondence && notificationChannel) {
      correspondence.correspondence.notification = {
        notificationTemplate: "GenericAltinnMessage",
        notificationChannel: notificationChannel,
      };
    }
    const response = await post.mutateAsync(correspondence);
    setResponseMessage(response);
    sessionStorage.setItem("responseMessage", JSON.stringify(response));
  };

  return (
    <div>
      <Button
        onClick={handleSendMessage}
        disabled={filteredRecipients.length === 0}
      >
        Send melding
      </Button>
    </div>
  );
};

export default CorrespondenceButton;
