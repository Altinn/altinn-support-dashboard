export interface CorrespondenceUploadRequest {
  correspondence?: Correspondence;
  recipients: string[];
}
export interface Correspondence {
  content?: CorrespondenceContent;
  isConfirmationNeeded?: boolean;
}

export interface CorrespondenceContent {
  messageTitle?: string;
  messageBody?: string;
  messageSummary?: string;
}

export interface CorrespondenceResponse {
  responseBody: string;
  responseHeader: string;
  requestBody: string;
  statusCode: string;
}
