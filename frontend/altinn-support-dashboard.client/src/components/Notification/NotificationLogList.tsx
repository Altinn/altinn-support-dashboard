import { Alert, Card, Paragraph, Table } from "@digdir/designsystemet-react";
import { NotificationLog } from "../../models/notificationModels";
import { colorMap } from "./notificationColorMap";
import style from "./styles/NotificationLogList.module.css";


type NotificationLogListProps = {
    entries: NotificationLog[]
};

const getColor = (status: string) => colorMap[status.toLowerCase()] ?? "info";

const NotificationLogList: React.FC<NotificationLogListProps> = ({ entries }) => (
    <div className={style.list}>
        {entries.map((e) => (
            <Card data-color="neutral" key={e.notificationId} className={style.card}>
                <Paragraph className={style.paragraph}>
                    <strong>Dialog-ID: </strong>{e.dialogId}
                </Paragraph>
                <Paragraph className={style.paragraph}>
                    <strong>Transmission-ID: </strong>{e.transmissionId}
                </Paragraph>
                <Paragraph className={style.paragraph}>
                    <strong>Notification-ID: </strong>{e.notificationId}
                </Paragraph>

                <Table data-size="sm" data-color="neutral" border>
                    <Table.Head>
                        <Table.Row>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Channel</Table.HeaderCell>
                            <Table.HeaderCell>Destination</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell className={style.timeCell}>Requested send time</Table.HeaderCell>
                            <Table.HeaderCell className={style.timeCell}>Last update time</Table.HeaderCell>
                        </Table.Row>
                    </Table.Head>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>{e.type}</Table.Cell>
                            <Table.Cell>{e.channel}</Table.Cell>
                            <Table.Cell>{e.destination}</Table.Cell>
                            <Table.Cell>
                                <Alert data-color={getColor(e.status)} data-size="sm">
                                    {e.status}
                                </Alert>
                            </Table.Cell>
                            <Table.Cell className={style.timeCell}>
                                {new Date(e.requestedSendTime).toLocaleString("nb-NO")}
                            </Table.Cell>
                            <Table.Cell className={style.timeCell}>
                                {new Date(e.lastUpdateTime).toLocaleString("nb-NO")}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Card>
        ))}
    </div>
)

export default NotificationLogList;