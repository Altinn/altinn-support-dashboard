import { Card, Table, Textfield } from "@digdir/designsystemet-react";
import NotificationStatusCode from "./NotificationStatusCode";
import { NotificationItem } from "../../models/notificationModels";
import style from "./styles/NotificationList.module.css";
import { useState } from "react";



type NotificationListProps = {
    notifications: NotificationItem[];
};

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
    const [searchId, setSearchId] = useState("");

    const filteredNotifications = notifications.filter(n => n.id.includes(searchId));
    return (
        <Card data-color="neutral">
            <Textfield
                label=""
                placeholder="Skriv inn notifikasjons id"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className={style.searchField}
            />
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
                    {filteredNotifications.map((n) => (
                        <Table.Row key={n.id} className={style.row}>
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