import {
    NotificationSendRequest,
    NotificationSendResponse
} from "../models/notificationSendModels";

export const sendTestEmail = async (
    request: NotificationSendRequest
): Promise<NotificationSendResponse> => {
    const token =
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    
    const res = await fetch("api/notification-send/email", {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
        },
        credentials: "include",
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `Requestv failed (${res.status})`);
    }

    return res.json();
}