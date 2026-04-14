import { Alert } from "@digdir/designsystemet-react";
import { NotificationItem } from "../../models/notificationModels";
import style from "./styles/NotificationsStatusCode.module.css";


type NotificationStatusCodeProps = {
    notification: NotificationItem;
}

const NotificationStatusCode: React.FC<NotificationStatusCodeProps> = ({ notification }) => {
    const getColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "success";
            case "failed":
                return "danger";
            case "new":
                return "warning";
            default:
                return "info";
        }
    };

    return (
        <Alert data-color={getColor(notification.sendStatus?.status)} data-size="sm" className={style.alert}>
            {notification.sendStatus?.status} - {notification.sendStatus?.description}
        </Alert>
    );
};

export default NotificationStatusCode;