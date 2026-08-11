import { Table } from "@digdir/designsystemet-react";
import { NotificationLog } from "../../models/notificationModels";


type NotificationLogListProps = {
    entries: NotificationLog[]
};

const NotificationLogList: React.FC<NotificationLogListProps> = ({ entries }) => (
    <Table data-size="sm" data-color="neutral" border>
        <Table.Head>
            <Table.HeaderCell>Dialog-ID</Table.HeaderCell>
            <Table.HeaderCell>Transmission-ID</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Kanal</Table.HeaderCell>
            <Table.HeaderCell>Mottaker</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Ønsket sendetidspunkt</Table.HeaderCell>
            <Table.HeaderCell>Sist oppdatert</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
            {entries.map((e) => (
                <Table.Row key= {e.notificationId}>
                    <Table.Cell>{e.dialogId}</Table.Cell>
                    <Table.Cell>{e.transmissionId}</Table.Cell>
                    <Table.Cell>{e.type}</Table.Cell>
                    <Table.Cell>{e.channel}</Table.Cell>
                    <Table.Cell>{e.destination}</Table.Cell>
                    <Table.Cell>{e.status}</Table.Cell>
                    <Table.Cell>{new Date(e.requestedSendTime).toLocaleString()}</Table.Cell>
                    <Table.Cell>{new Date(e.lastUpdateTime).toLocaleString()}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);

export default NotificationLogList;