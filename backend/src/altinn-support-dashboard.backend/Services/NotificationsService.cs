using altinn_support_dashboard.Server.Services.Interfaces;
using Models.notifications;
using System.Text.Json;

namespace altinn_support_dashboard.Server.Services;

public class NotificationsService : INotificationsService
{
    private readonly INotificationsClient _client;
    private readonly ILogger<INotificationsService> _logger;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    public NotificationsService(INotificationsClient client, ILogger<INotificationsService> logger)
    {
        _client = client;
        _logger = logger;
    }

    public async Task<NotificationOrderResponseDto> GetEmailNotificationsByOrderId(string orderId)
    {
        var result = await _client.GetEmailNotificationsByOrderId(orderId);
        return JsonSerializer.Deserialize<NotificationOrderResponseDto>(result, _jsonOptions) ?? throw new Exception("Error deserializing email notifications response");
    }

    public async Task<NotificationOrderResponseDto> GetSmsNotificationsByOrderId(string orderId)
    {
        var result = await _client.GetSmsNotificationsByOrderId(orderId);
        return JsonSerializer.Deserialize<NotificationOrderResponseDto>(result, _jsonOptions) ?? throw new Exception("Error deserializing SMS notifications response");
    }
}
