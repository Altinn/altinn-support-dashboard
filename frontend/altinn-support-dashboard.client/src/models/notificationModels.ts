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
  resourceId: string;
  sendersReference: string;
  requestedSendTime: string;
  notificationChannel: string;
  recipients: ShipmentRecipient[];
}

export interface ShipmentRecipient{
  nationalIdentityNumber?: string;
  organizationNumber: string | null;
  channel: string;
  emailAdress: string | null;
  mobileNumber: string | null;
  result: string;
  resultTime: string;
}