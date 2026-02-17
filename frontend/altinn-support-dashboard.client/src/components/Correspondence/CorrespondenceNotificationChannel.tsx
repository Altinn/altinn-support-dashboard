import { Label, Select } from "@digdir/designsystemet-react";
import { setLocalStorageValue } from "../ManualRoleSearch/utils/storageUtils";
import { NotificationChannel } from "../../models/correspondenceModels";

interface CorrespondenceNotificationChannelProps {
  channel: NotificationChannel | null;
  setChannel: (channel: NotificationChannel | null) => void;
}

const CorrespondenceNotificationChannel: React.FC<
  CorrespondenceNotificationChannelProps
> = ({ channel, setChannel }) => {
  const handleChannelChange = (newChannel: number) => {
    if (newChannel < 0) {
      setChannel(null);
      setLocalStorageValue("notificationChannel", JSON.stringify(channel));
    } else {
      setChannel(channel);
      setLocalStorageValue("notificationChannel", JSON.stringify(channel));
    }
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
      </Select>
    </div>
  );
};

export default CorrespondenceNotificationChannel;
