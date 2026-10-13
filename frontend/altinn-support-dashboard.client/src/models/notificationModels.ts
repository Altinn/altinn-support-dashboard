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
  displayedNationalIdentityNumber?: string;
  organizationNumber?: string;
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

export interface NotificationLog {
  notificationId: string;
  dialogId: string;
  transmissionId: string;
  type: string;
  channel: string;
  destination: string;
  status: string;
  requestedSendTime: string;
  lastUpdateTime: string;
}