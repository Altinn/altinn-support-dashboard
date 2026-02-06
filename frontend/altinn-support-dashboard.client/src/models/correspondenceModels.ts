export interface CorrespondenceUploadRequest {
  correspondence?: Correspondence;
  recipients: string[];
}
export interface Correspondence {
  resourceType: string;
  content?: CorrespondenceContent;
  notification?: CorrespondenceNotification;
  isConfirmationNeeded?: boolean;
  dueDateTime?: string;
}

export interface CorrespondenceContent {
  messageTitle?: string;
  messageBody?: string;
  messageSummary?: string;
}

export interface CorrespondenceResponse {
  responseBody: string;
  responseHeader: string;
  requestHeader: string;
  requestBody: string;
  statusCode: string;
}

export interface CorrespondenceNotification {
  notificationTemplate: string;
  notificationChannel: string;
}
