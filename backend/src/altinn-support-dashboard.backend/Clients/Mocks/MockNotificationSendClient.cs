using System.Net;
using System.Text.Json;
using Models.notifications;

public class MockNotificationSendClient(NotificationSendClient inner) : INotificationSendClient
{
    private static readonly JsonSerializerOptions _json = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public Task<NotificationSendResponse> SendInstantEmail(InstantEmailOrderRequest order, string environmentName)
    {
        if (!MockUtils.IsMock(environmentName))
        {
            return inner.SendInstantEmail(order, environmentName);
        }

        // Fake success: nothing is sent in mock mode
        var result = new InstantEmailOrderResult
        {
            NotificationOrderId = Guid.NewGuid(),
            Notification = new InstantNotificationShipment
            {
                ShipmentId = Guid.NewGuid(),
                SendersReference = order.SendersReference
            }
        };

        return Task.FromResult(new NotificationSendResponse
        {
            StatusCode = HttpStatusCode.Created,
            ResponseBody = JsonSerializer.Serialize(result, _json),
            ResponseHeader = "",
            RequestHeader = "Content-Type: application/json",
            RequestBody = JsonSerializer.Serialize(order, _json),
            Result = result
        });
    }
}
