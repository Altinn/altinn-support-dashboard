import React from 'react';
import { Card, Heading, Paragraph } from "@digdir/designsystemet-react";
import { NotificationOrderResponse } from "../../models/notificationModels";
import NotificationList from './NotificationList';
import style from "./styles/NotificationCard.module.css";


type NotificationCardProps = {
    order: NotificationOrderResponse;
}


const NotificationCard: React.FC<NotificationCardProps> = ({ order }) => {
    const getType = () => {
        const first = order.notifications?.[0];
        if (!first) return "Ordredetaljer";
        return first.recipient?.emailAddress ? "E-post" : "SMS";
    };

    return (
        <Card data-color="neutral" className={style.card}>
            <Heading level={2} data-size="xs">{getType()}</Heading>
            <Paragraph>Order id: {order.orderId}</Paragraph>
            <Paragraph>Avsenders referanse: {order.sendersReference}</Paragraph>
            <Paragraph>Generert: {order.generated}</Paragraph>
            <Paragraph>Vellykket: {order.succeeded}</Paragraph>
            <NotificationList notifications={order.notifications || []} />
        </Card>
    )
}

export default NotificationCard;