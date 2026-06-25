public interface INotificationsClient
{
    Task<string> GetEmailNotificationsByOrderId(string orderId, string environmentName);
    Task<string> GetSmsNotificationsByOrderId(string orderId, string environmentName);
    Task<string> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to, string environmentName);
}
