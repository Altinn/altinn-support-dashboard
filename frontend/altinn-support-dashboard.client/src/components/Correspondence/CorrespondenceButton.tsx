import { Button } from "@digdir/designsystemet-react";

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
  const handleSendMessage = async () => {
    // Logic to send message goes here
  };

  return (
    <div>
      <Button
        onClick={handleSendMessage}
        disabled={!recipients || !title || !summary || !body || !checked}
      >
        Send melding
      </Button>
    </div>
  );
};

export default CorrespondenceButton;

