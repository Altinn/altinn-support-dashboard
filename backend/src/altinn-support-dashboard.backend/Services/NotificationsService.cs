using altinn_support_dashboard.Server.Services.Interfaces;

namespace altinn_support_dashboard.Server.Services;

public class NotificationsService : INotificationsService
{
    private readonly INotificationsClient _client;
    private readonly ILogger<INotificationsService> _logger;

    public NotificationsService(INotificationsClient client, ILogger<INotificationsService> logger)
    {
        _client = client;
        _logger = logger;
    }

    public async Task<string> GetEmailNotificationsByOrderId(string orderId)
    {
        return await _client.GetEmailNotificationsByOrderId(orderId);
    }

    public async Task<string> GetSmsNotificationsByOrderId(string orderId)
    {
        return await _client.GetSmsNotificationsByOrderId(orderId);
    }
}
