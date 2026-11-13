using Models.notifications;

public interface INotificationSendClient
{
    Task<NotificationSendResponse> SendInstantEmail(InstantEmailOrderRequest order, string environmentName);
}