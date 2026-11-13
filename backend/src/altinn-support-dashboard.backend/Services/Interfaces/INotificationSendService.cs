using Models.notifications;

public interface INotificationSendService
{
    Task<NotificationSendResponse> SendTestEmail(NotificationSendRequest request, string environmentName);
}