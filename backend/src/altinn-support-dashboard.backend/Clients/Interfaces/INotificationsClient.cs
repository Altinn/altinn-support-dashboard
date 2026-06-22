public interface INotificationsClient
{
    Task<string> GetEmailNotificationsByOrderId(string orderId);
    Task<string> GetSmsNotificationsByOrderId(string orderId);
    Task<string> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to);
}
