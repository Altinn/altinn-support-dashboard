public interface INotificationsClient
{
    Task<string> GetEmailNotificationsByOrderId(string orderId);
    Task<string> GetSmsNotificationsByOrderId(string orderId);
}
