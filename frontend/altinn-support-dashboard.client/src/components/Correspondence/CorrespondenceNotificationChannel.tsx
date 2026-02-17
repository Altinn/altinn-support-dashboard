import { Label, Select } from "@digdir/designsystemet-react";
import { setLocalStorageValue } from "../ManualRoleSearch/utils/storageUtils";
import { NotificationChannel } from "../../models/correspondenceModels";

interface CorrespondenceNotificationChannelProps {
  channel: number | undefined;
  setChannel: (channel: NotificationChannel) => void;
}

const CorrespondenceNotificationChannel: React.FC<
  CorrespondenceNotificationChannelProps
> = ({ channel, setChannel }) => {
  const handleChannelChange = (channel: number) => {
    setChannel(channel);
    setLocalStorageValue("notificationChannel", JSON.stringify(channel));
  };
  return (
    <div>
      <Label>Varslingsinstillinger</Label>
      <Select
        value={channel}
        onChange={(e) => handleChannelChange(e.target.value)}
      >
        <Select.Option value="default">Ordinær post</Select.Option>
        <Select.Option value="confidentiality">
          Taushetsbelagt post
        </Select.Option>
      </Select>
    </div>
  );
};

export default CorrespondenceNotificationChannel;
