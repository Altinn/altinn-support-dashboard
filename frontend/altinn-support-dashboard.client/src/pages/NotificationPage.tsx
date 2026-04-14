import { Heading } from '@digdir/designsystemet-react';
import { useState } from 'react';
import NotificationSearchBar from '../components/Notification/NotificationSearchBar';
import { useNotifications } from '../hooks/hooks';
import NotificationOrderSummary from '../components/Notification/NotificationOrderSummary';
import NotificationList from '../components/Notification/NotificationList';




export const NotificationPage = () => {
    const [orderId, setOrderId] = useState("");
    const notificationQuery  = useNotifications(orderId);
    return (
        <div>
            <Heading level={1} data-size="sm">
                Søk etter varsling
            </Heading>

            <NotificationSearchBar orderId={orderId} setOrderId={setOrderId} />

            {notificationQuery.data && (
                <>
                    <NotificationOrderSummary order={notificationQuery.data} />
                    <NotificationList notifications={notificationQuery.data.notifications || []} />
                </>
            )}
        </div>
    )
}