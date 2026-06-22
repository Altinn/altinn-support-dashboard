import { Alert, Card, Heading, Paragraph, Table } from "@digdir/designsystemet-react";
import { NotificationShipmentResponse } from "../../../models/notificationModels"
import styles from "../styles/NotificationCard.module.css"
import { colorMap } from "../NotificationStatusCode";


type NotificationShipemntCardProps = {
    shipment: NotificationShipmentResponse
};

const NotificationShipmentCard: React.FC<NotificationShipemntCardProps> = ({
    shipment
}) => (
    <Card data-color="neutral" className={styles.card}>
        <Heading level={2} data-size="xs">
            {shipment.notificationChannel}
        </Heading>
        <Paragraph>Forsendelse-id: {shipment.shipmentId}</Paragraph>
        <Paragraph>Avsenders referanse: {shipment.sendersReference}</Paragraph>
        <Paragraph>Ressurs: {shipment.resourceId}</Paragraph>
        <Paragraph>Ønsket Sendt: {new Date(shipment.requestedSendTime).toLocaleString("nb-NO")}</Paragraph>

        <Table data-size="sm" data-color="neutral" border>
            <Table.Head>
                <Table.Row>
                    <Table.HeaderCell>Kanal</Table.HeaderCell>
                    <Table.HeaderCell>Adresse</Table.HeaderCell>
                    <Table.HeaderCell>Resultat</Table.HeaderCell>
                    <Table.HeaderCell>Tidspunkt</Table.HeaderCell>
                </Table.Row>
            </Table.Head>
            <Table.Body>
                {shipment.recipients.map((r, i) => (
                    <Table.Row key={i}>
                        <Table.Cell>{r.channel === "email" ? "E-post" : "SMS"}</Table.Cell>
                        <Table.Cell>{r.emailAdress ?? r.mobileNumber}</Table.Cell>
                        <Table.Cell>
                            <Alert
                                data-color={colorMap[r.result.toLowerCase()] ?? "info"}
                                data-size="sm"
                            >
                                {r.result}
                            </Alert>
                        </Table.Cell>
                        <Table.Cell>
                            {new Date(r.resultTime).toLocaleString("nb-NO")}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </Card>
)

export default NotificationShipmentCard;