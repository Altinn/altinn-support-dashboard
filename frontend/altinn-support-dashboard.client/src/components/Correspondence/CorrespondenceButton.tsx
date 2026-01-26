import { Button } from "@digdir/designsystemet-react";
import { useCorrespondencePost } from "../../hooks/hooks";
import {
  CorrespondenceResponse,
  CorrespondenceUploadRequest,
} from "../../models/correspondenceModels";

type CorrespondenceButtonProps = {
  resourceType: string;
  recipients: string[];
  title: string;
  summary: string;
  body: string;
  checked: boolean;
  setResponseMessage: (responseData: CorrespondenceResponse) => void;
  dueDate: string;
};

const CorrespondenceButton: React.FC<CorrespondenceButtonProps> = ({
  resourceType,
  recipients,
  title,
  summary,
  body,
  checked,
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
        isConfirmationNeeded: checked,
        dueDateTime: dueDate || undefined,
      },
    };
    const response = await post.mutateAsync(correspondence);
    setResponseMessage(response);
  };

  return (
    <div>
      <Button onClick={handleSendMessage} disabled={!recipients}>
        Send melding
      </Button>
    </div>
  );
};

export default CorrespondenceButton;
