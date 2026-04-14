import { Heading } from '@digdir/designsystemet-react';
import { useState } from 'react';
import NotificationSearchBar from '../components/Notification/NotificationSearchBar';
import { useNotifications } from '../hooks/hooks';
import NotificationOrderSummary from '../components/Notification/NotificationOrderSummary';
import NotificationList from '../components/Notification/NotificationList';
import style from './styles/NotificationPage.module.css';




export const NotificationPage = () => {
    const [orderId, setOrderId] = useState("");
    const notificationQuery  = useNotifications(orderId);

    console.log("orderId:", orderId);
console.log("query status:", notificationQuery.status);
console.log("query data:", notificationQuery.data);
console.log("query error:", notificationQuery.error);
    return (
        <div>
            <Heading level={1} data-size="sm" className={style.heading}>
                Søk etter varsling
            </Heading>

            <NotificationSearchBar orderId={orderId} setOrderId={setOrderId} />

            {notificationQuery.data &&  notificationQuery.data.map((order, index) => (
                <div key={index}>
                    <NotificationOrderSummary order={order} />
                    <NotificationList notifications={order.notifications || []} />
                </div>
            ))}
        </div>
    )
}