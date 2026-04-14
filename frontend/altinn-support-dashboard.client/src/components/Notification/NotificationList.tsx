import { Card, Table } from "@digdir/designsystemet-react";
import NotificationStatusCode from "./NotificationStatusCode";
import { NotificationItem } from "../../models/notificationModels";
import style from "./styles/NotificationList.module.css";



type NotificationListProps = {
    notifications: NotificationItem[];
};

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
    return (
        <Card data-color="neutral">
            <Table data-size="sm" data-color="neutral" border>
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell className={style.mottakerCell}>Mottaker</Table.HeaderCell>
                        <Table.HeaderCell className={style.typeCell}>Type</Table.HeaderCell>
                        <Table.HeaderCell className={style.statusCell}>Status</Table.HeaderCell>
                        <Table.HeaderCell className={style.notifIdCell}>Notifikasjons id</Table.HeaderCell>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {notifications.map((n) => (
                        <Table.Row key={n.id}>
                            <Table.Cell>
                                {n.recipient?.emailAddress || n.recipient?.mobileNumber}
                            </Table.Cell>
                            <Table.Cell>
                                {n.recipient?.emailAddress ? "E-post" : "SMS"}
                            </Table.Cell>
                            <Table.Cell>
                                <NotificationStatusCode notification={n} />
                            </Table.Cell>
                            <Table.Cell>{n.id}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Card>
    );
};

export default NotificationList;