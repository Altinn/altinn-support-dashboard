using Models.notifications;

public interface INotificationSendService
{
    Task<NotificationSendResponse> SendTestEmail(NotificationsSendRequest request);
}