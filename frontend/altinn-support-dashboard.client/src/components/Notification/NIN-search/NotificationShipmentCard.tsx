import { Alert, Card, Paragraph, Table } from "@digdir/designsystemet-react";
import { NotificationShipmentResponse } from "../../../models/notificationModels"
import styles from "./NotificationShipmentCard.module.css"
import { colorMap } from "../notificationColorMap";


type NotificationShipemntCardProps = {
    shipment: NotificationShipmentResponse
    selectedResults?: string[]
    selectedChannels?: string[]
    compact?: boolean
};

const NotificationShipmentCard: React.FC<NotificationShipemntCardProps> = ({
    shipment,
    selectedResults = [],
    selectedChannels = [],
    compact = false
}) => {
    const deliveryAttempts = (shipment.deliveryAttempts ?? []).filter((attempt) => 
        (selectedResults.length === 0 || (attempt.result && selectedResults.includes(attempt.result))) &&
        (selectedChannels.length === 0 || (attempt.channel && selectedChannels.includes(attempt.channel)))
    )
    return(
        <Card data-color="neutral" className={styles.card}>
        <Paragraph className={styles.paragraph}><strong>Shipment Id:</strong> {shipment.shipmentId}</Paragraph>
        <Paragraph className={styles.paragraph}>
            <strong>{compact ? "Opprettet av:" : "Creator name:"}</strong> {shipment.creatorName}</Paragraph>
        {!compact && (
            <>
                <Paragraph className={styles.paragraph}><strong>Senders reference:</strong> {shipment.sendersReference}</Paragraph>
                <Paragraph className={styles.paragraph}><strong>Resource:</strong> {shipment.resourceId}</Paragraph>
            </>
        )}
        <Paragraph className={styles.paragraph}><strong>{compact ? "Forespurt sendetid:" : "Requested send time:"}</strong> {new Date(shipment.requestedSendTime).toLocaleString("nb-NO")}</Paragraph>
        <Paragraph className={styles.paragraph}><strong>{compact ? "Varslingskanal:" : "Notification channel:"}</strong> {shipment.notificationChannel}</Paragraph>
        <Paragraph className={styles.paragraph}><strong>{compact ? "Varslinsgtype:" : "Notifcation type:"} </strong> {shipment.notificationType}</Paragraph>

        <Table data-size="sm" data-color="neutral" border>
            <Table.Head>
                <Table.Row>
                    <Table.HeaderCell>{compact ? "Kanal" : "Channel"}</Table.HeaderCell>
                    <Table.HeaderCell>{compact ? "Adresse" : "Address"}</Table.HeaderCell>
                    <Table.HeaderCell>{compact ? "Resultat" : "Result"}</Table.HeaderCell>
                    <Table.HeaderCell>{compact ? "Tidspunkt" : "Time"}</Table.HeaderCell>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                {deliveryAttempts.map((attempt, index) => (
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
}

export default NotificationShipmentCard;