using Models.notifications;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface INotificationsService
{
    Task<NotificationOrderResponseDto> GetEmailNotificationsByOrderId(string orderId, string environmentName);
    Task<NotificationOrderResponseDto> GetSmsNotificationsByOrderId(string orderId, string environmentName);
    Task<List<NotificationOrderResponseDto>> GetAllNotificationsByOrderId(string orderId, string environmentName);
    Task<List<FutureNotificationDto>> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to, string environmentName);
}
