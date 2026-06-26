import { Alert } from "@digdir/designsystemet-react";
import { NotificationItem } from "../../models/notificationModels";
import style from "./styles/NotificationsStatusCode.module.css";
import { colorMap } from "./notificationColorMap";

type NotificationStatusCodeProps = {
  notification: NotificationItem;
};

const getColor = (status: string) => colorMap[status.toLowerCase()] || "danger";

const NotificationStatusCode: React.FC<NotificationStatusCodeProps> = ({
  notification,
}) => {
  return (
    <Alert
      data-color={getColor(notification.sendStatus?.status)}
      data-size="sm"
      className={style.alert}
    >
      {notification.sendStatus?.status} - {notification.sendStatus?.description}
    </Alert>
  );
};

export default NotificationStatusCode;
