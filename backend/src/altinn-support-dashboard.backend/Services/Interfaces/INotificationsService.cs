namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface INotificationsService
{
    Task<string> GetEmailNotificationsByOrderId(string orderId);
    Task<string> GetSmsNotificationsByOrderId(string orderId);
}
