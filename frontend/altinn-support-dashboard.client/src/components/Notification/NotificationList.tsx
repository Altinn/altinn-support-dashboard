import { Card, Table } from "@digdir/designsystemet-react";
import NotificationStatusCode from "./NotificationStatusCode";
import { NotificationItem } from "../../models/notificationModels";




type NotificationListProps = {
    notifications: NotificationItem[];
};

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
    return (
        <Card data-color="neutral">
            <Table data-size="sm" data-color="neutral" border>
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell>Mottaker</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
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
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Card>
    );
};

export default NotificationList;