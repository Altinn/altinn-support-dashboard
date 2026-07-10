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
  resourceId?: string;
  sendersReference?: string;
  requestedSendTime: string;
  notificationChannel?: string ;
  notificationType?: string;
  deliveryAttempts: DeliveryAttempt[];
}

export interface DeliveryAttempt {
  nationalIdentityNumber?: string;
  channel?: string;
  emailAddress?: string;
  mobileNumber?: string;
  result?: string;
  resultTime?: string;
}

export interface NotificationAvailabilityRequest {
  nationalIdentityNumber: string;
  organizationNumber: string;
  resourceId: string;
  actionOnResource: string;
}

export interface NotificationAvailabilityResponse {
  hasAccessToResourceForOrg: boolean;
  inResourceIncludeList: boolean;
  hasContactInformationForOrg: boolean;
}