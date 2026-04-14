import { Alert } from "@digdir/designsystemet-react";
import { NotificationItem } from "../../models/notificationModels";



type NotificationStatusCodeProps = {
    notification: NotificationItem;
}

const NotificationStatusCode: React.FC<NotificationStatusCodeProps> = ({ notification }) => {
    const color = notification.succeeded ? "success" : "danger";

    return (
        <Alert data-color={color} data-size="sm">
            {notification.sendStatus?.status} - {notification.sendStatus?.description}
        </Alert>
    );
};

export default NotificationStatusCode;