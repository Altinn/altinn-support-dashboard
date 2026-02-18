import { Label, Select } from "@digdir/designsystemet-react";
import { setLocalStorageValue } from "../ManualRoleSearch/utils/storageUtils";
import { NotificationChannel } from "../../models/correspondenceModels";

interface CorrespondenceNotificationChannelProps {
  channel: NotificationChannel;
  setChannel: (channel: NotificationChannel) => void;
}

const CorrespondenceNotificationChannel: React.FC<
  CorrespondenceNotificationChannelProps
> = ({ channel, setChannel }) => {
  const handleChannelChange = (newChannel: number) => {
    setChannel(newChannel);
    setLocalStorageValue("notificationChannel", JSON.stringify(newChannel));
  };
  return (
    <div>
      <Label>Varslingsinstillinger</Label>
      <Select
        value={channel as number}
        onChange={(e) => handleChannelChange(Number.parseInt(e.target.value))}
      >
        <Select.Option value={-1}>Ingen varsling</Select.Option>
        <Select.Option value={NotificationChannel.Email}>Email</Select.Option>
        <Select.Option value={NotificationChannel.Sms}>Sms</Select.Option>
        <Select.Option value={NotificationChannel.EmailAndSms}>
          Email og Sms
        </Select.Option>
      </Select>
    </div>
  );
};

export default CorrespondenceNotificationChannel;
