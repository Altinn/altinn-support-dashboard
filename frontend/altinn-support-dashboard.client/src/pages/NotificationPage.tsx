import { Heading } from '@digdir/designsystemet-react';
import { useState } from 'react';
import NotificationSearchBar from '../components/Notification/NotificationSearchBar';
import { useNotifications } from '../hooks/hooks';
import NotificationCard from '../components/Notification/NotificationCard';
import style from './styles/NotificationPage.module.css';




export const NotificationPage = () => {
    const [orderId, setOrderId] = useState("");
    const notificationQuery  = useNotifications(orderId);
    
    return (
        <div className={style.container}>
            <Heading level={1} data-size="sm" className={style.heading}>
                Søk etter varsling
            </Heading>

            <NotificationSearchBar orderId={orderId} setOrderId={setOrderId} />

            {/* Filters out the notifications with 0 (shows only email if sms was 0 f.ex.) */}
            {notificationQuery.data?.filter(o => o.notifications.length > 0).map((order, index) => (
                <div key={index}>
                    <NotificationCard key={index} order={order}/>
                </div>
            ))}
        </div>
    )
}