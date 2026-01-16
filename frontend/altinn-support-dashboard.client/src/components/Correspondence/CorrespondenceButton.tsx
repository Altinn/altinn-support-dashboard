import { Button } from "@digdir/designsystemet-react";
import { useCorrespondencePost } from "../../hooks/hooks";
import { CorrespondenceUploadRequest } from "../../models/correspondenceModels";

type CorrespondenceButtonProps = {
  recipients: string[];
  title: string;
  summary: string;
  body: string;
  checked: boolean;
};

const CorrespondenceButton: React.FC<CorrespondenceButtonProps> = ({
  recipients,
  title,
  summary,
  body,
  checked,
}) => {
  const post = useCorrespondencePost();
  const handleSendMessage = async () => {
    const correspondence: CorrespondenceUploadRequest = {
      recipients: recipients,
      correspondence: {
        content: {
          messageBody: body,
          messageSummary: summary,
          messageTitle: title,
        },
        isConfirmationNeeded: checked,
      },
    };
    post.mutate(correspondence);
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

