import { Button } from "@digdir/designsystemet-react";
import { useCorrespondencePost } from "../../hooks/hooks";
import {
  CorrespondenceResponse,
  CorrespondenceUploadRequest,
} from "../../models/correspondenceModels";

type CorrespondenceButtonProps = {
  recipients: string[];
  title: string;
  summary: string;
  body: string;
  checked: boolean;
  setResponseMessage: (responseData: CorrespondenceResponse) => void;
};

const CorrespondenceButton: React.FC<CorrespondenceButtonProps> = ({
  recipients,
  title,
  summary,
  body,
  checked,
  setResponseMessage,
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
        isConfirmationNeeded: checked,
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
