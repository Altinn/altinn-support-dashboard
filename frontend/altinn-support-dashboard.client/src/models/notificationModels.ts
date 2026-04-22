export interface NotificationOrderResponse {
    orderId: string;
    sendersReference: string;
    generated: number;
    succeeded: number;
    notifications: NotificationItem[];
}

export interface NotificationItem {
    id: string;
    succeeded: boolean;
    recipient: NotificationRecipient;
    sendStatus: NotificationSendStatus;
}

export interface NotificationRecipient {
    emailAddress?: string;
    mobileNumber?: string;
    orgamnizationNumber?: string;
}

export interface NotificationSendStatus {
    status: string;
    description: string;
    lastUpdate: string;
}