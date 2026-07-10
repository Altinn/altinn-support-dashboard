import { Alert, Card, Paragraph, Table } from "@digdir/designsystemet-react";
import { NotificationShipmentResponse } from "../../../models/notificationModels"
import styles from "./NotificationShipmentCard.module.css"
import { colorMap } from "../notificationColorMap";


type NotificationShipemntCardProps = {
    shipment: NotificationShipmentResponse
};

const NotificationShipmentCard: React.FC<NotificationShipemntCardProps> = ({
    shipment
}) => (
    <Card data-color="neutral" className={styles.card}>
        <Paragraph className={styles.paragraph}><strong>Shipment Id:</strong> {shipment.shipmentId}</Paragraph>
        <Paragraph className={styles.paragraph}><strong>Creator name:</strong> {shipment.creatorName}</Paragraph>
        <Paragraph className={styles.paragraph}><strong>Senders reference:</strong> {shipment.sendersReference}</Paragraph>
        <Paragraph className={styles.paragraph}><strong>Resource:</strong> {shipment.resourceId}</Paragraph>
        <Paragraph className={styles.paragraph}><strong>Requested send time:</strong> {new Date(shipment.requestedSendTime).toLocaleString("nb-NO")}</Paragraph>
        <Paragraph className={styles.paragraph}><strong>Notification channel:</strong> {shipment.notificationChannel}</Paragraph>
        <Paragraph className={styles.paragraph}><strong>Notification type: </strong> {shipment.notificationType}</Paragraph>

        <Table data-size="sm" data-color="neutral" border>
            <Table.Head>
                <Table.Row>
                    <Table.HeaderCell>Channel</Table.HeaderCell>
                    <Table.HeaderCell>Address</Table.HeaderCell>
                    <Table.HeaderCell>Result</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                {(shipment.deliveryAttempts ?? []).map((attempt, index) => (
                    <Table.Row key={index}>
                        <Table.Cell>{attempt.channel === "email" ? "E-post" : "SMS"}</Table.Cell>
                        <Table.Cell>{attempt.emailAddress ?? attempt.mobileNumber}</Table.Cell>
                        <Table.Cell>
                            <Alert
                                data-color={colorMap[attempt?.result?.toLowerCase() ?? ""] ?? "info"}
                                data-size="sm"
                            >
                                {attempt?.result}
                            </Alert>
                        </Table.Cell>
                        <Table.Cell>
                            {attempt?.resultTime ? new Date(attempt.resultTime).toLocaleString("nb-NO") : ""}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </Card>
)

export default NotificationShipmentCard;