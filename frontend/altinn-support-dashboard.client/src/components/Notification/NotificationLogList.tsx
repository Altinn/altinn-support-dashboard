import { Card, Paragraph, Table } from "@digdir/designsystemet-react";
import { NotificationLog } from "../../models/notificationModels";
import { colorMap } from "./notificationColorMap";


type NotificationLogListProps = {
    entries: NotificationLog[]
};

const getColor = (status: string) => colorMap[status.toLowerCase()] ?? "info";

const NotificationLogList: React.FC<NotificationLogListProps> = ({ entries }) => (
    <div>
        {entries.map((e) => (
            <Card data-color="neutral" key={e.notificationId}>
                <Paragraph>
                    <strong>Dialog-ID: </strong>{e.dialogId}
                </Paragraph>
                <Paragraph>
                    <strong>Transmission-ID: </strong>{e.transmissionId}
                </Paragraph>
                <Paragraph>
                    <strong>Notification-ID: </strong>{e.notificationId}
                </Paragraph>

                
            </Card>
        ))}
    </div>
)

export default NotificationLogList;