import { Alert } from "@digdir/designsystemet-react";
import { NotificationItem } from "../../models/notificationModels";
import style from "./styles/NotificationsStatusCode.module.css";


type NotificationStatusCodeProps = {
    notification: NotificationItem;
}

const colorMap: Record<string, "success" | "danger" | "warning" | "info"> = {
    registered: "info",
    processing: "info",
    completed: "success",
    sendconditionnotmet: "danger",
    cancelled: "danger",
    processed: "warning",
    new: "info",
    sending: "info",
    accepted: "warning",
    delivered: "success",
    failed: "danger",
    failed_invalidrecipient: "danger",
    failed_recipientreserved: "danger",
    failed_barredreceiver: "danger",
    failed_deletedreceiver: "danger",
    failed_expired: "danger",
    failed_undelivered: "danger",
    failed_recipientnotidentified: "danger",
    failed_rejected: "danger",
    succeeded: "success",
    failed_invalidformat: "danger",
    failed_suppressedrecipient: "danger",
    failed_transienterror: "danger",
    failed_bounced: "danger",
    failed_filterspam: "danger",
    failed_quarantined: "danger",
    failed_ttl: "danger",

}

const getColor = (status: string) => colorMap[status.toLowerCase()] || "danger";

const NotificationStatusCode: React.FC<NotificationStatusCodeProps> = ({ notification }) => {

    return (
        <Alert data-color={getColor(notification.sendStatus?.status)} data-size="sm" className={style.alert}>
            {notification.sendStatus?.status} - {notification.sendStatus?.description}
        </Alert>
    );
};

export default NotificationStatusCode;