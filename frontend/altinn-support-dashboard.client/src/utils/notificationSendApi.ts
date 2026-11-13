import { authorizedPost, getBaseUrl } from "./utils";
import {
    NotificationSendRequest,
    NotificationSendResponse
} from "../models/notificationSendModels";

export type SendTestEmailArgs = {
    environment: string;
    request: NotificationSendRequest;
};

export const sendTestEmail = async ({
    environment,
    request
}: SendTestEmailArgs): Promise<NotificationSendResponse> => {    
    const res = await authorizedPost(
        `${getBaseUrl(environment)}/notification-send/email`,
        request
    )

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `Request failed (${res.status})`);
    }

    return res.json();
}