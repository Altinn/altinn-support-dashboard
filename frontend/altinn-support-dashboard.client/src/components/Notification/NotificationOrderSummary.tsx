import { Card, Heading, Paragraph } from "@digdir/designsystemet-react";
import { NotificationOrderResponse } from "../../models/notificationModels"



type NotificationOrderSummaryProps = {
    order: NotificationOrderResponse;
}

const NotificationOrderSummary: React.FC<NotificationOrderSummaryProps> = ({ order }) => {
    const getType = () => {
        const first = order.notifications?.[0];
        if (!first) return "Ordredetaljer";
        return first.recipient?.emailAddress ? "E-post" : "SMS";
    }
    return (
        <Card data-color="neutral">
            <Heading level={2} data-size="xs">
                {getType()} 
            </Heading>
            <Paragraph>Order id: {order.orderId}</Paragraph>
            <Paragraph>Avsenders referanse: {order.sendersReference}</Paragraph>
            <Paragraph>Generert: {order.generated}</Paragraph>
            <Paragraph>Vellykket: {order.succeeded}</Paragraph>
        </Card>
    );
};

export default NotificationOrderSummary;