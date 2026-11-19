export interface NotificationSendRequest {
    emailAddress: string;
    idempotencyId?: string;
}

export interface InstantEmailOrderResult {
    notificationOrderId: string;
    notification?: {
        shipmentId: string;
        sendersReference?: string;
    };
}

export interface NotificationProblem{
    type?:  string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string[]>;
    [key: string]: unknown;
}

export interface NotificationSendResponse {
    responseBody: string;
    responseHeader: string;
    requestHeader: string;
    requestBody: string;
    // HttpStatusCodes enum on the backend, serialized as a number
    statusCode: number;
    result?: InstantEmailOrderResult;
    problem?: NotificationProblem;
}