using Models.notifications;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface INotificationsService
{
    Task<NotificationOrderResponseDto> GetEmailNotificationsByOrderId(string orderId);
    Task<NotificationOrderResponseDto> GetSmsNotificationsByOrderId(string orderId);
}
