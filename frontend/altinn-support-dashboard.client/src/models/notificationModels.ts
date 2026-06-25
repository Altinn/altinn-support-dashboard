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

export interface NotificationShipmentResponse {
  shipmentId: string;
  creatorName: string;
  resourceId: string | null;
  sendersReference: string | null;
  requestedSendTime: string;
  notificationChannel: string | null;
  notificationType: string | null;
  deliveryAttempts: DeliveryAttempt[];
}

export interface DeliveryAttempt {
  nationalIdentityNumber: string | null;
  channel: string | null;
  emailAddress: string | null;
  mobileNumber: string | null;
  result: string | null;
  resultTime: string | null;
}