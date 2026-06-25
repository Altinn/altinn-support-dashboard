public class MockNotificationsClient(NotificationsClient inner) : INotificationsClient
{
    private static bool IsMock(string env) =>
        string.Equals(env, "mock", StringComparison.OrdinalIgnoreCase);

    public Task<string> GetEmailNotificationsByOrderId(string orderId, string environmentName) =>
        IsMock(environmentName)
            ? Task.FromResult(MockOrderResponseEmail)
            : inner.GetEmailNotificationsByOrderId(orderId, environmentName);

    public Task<string> GetSmsNotificationsByOrderId(string orderId, string environmentName) =>
        IsMock(environmentName)
            ? Task.FromResult(MockOrderResponseSms)
            : inner.GetSmsNotificationsByOrderId(orderId, environmentName);

    public Task<string> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to, string environmentName) =>
        IsMock(environmentName)
            ? Task.FromResult(MockFutureNotifications)
            : inner.GetFutureNotificationsByNin(nin, from, to, environmentName);


    private const string MockOrderResponseEmail = """
        {
            "orderId": "mock-order-email-001",
            "sendersReference": "mock-ref-001",
            "generated": 1,
            "succeeded": 1,
            "notifications": [{
                "id": "mock-notif-email-001",
                "succeeded": true,
                "recipient": { "emailAddress": "test@digdir.no" },
                "sendStatus": {
                    "status": "Succeeded",
                    "description": "Email delivered successfully",
                    "lastUpdate": "2024-01-15T10:00:00"
                }
            }]
        }
        """;

    private const string MockOrderResponseSms = """
        {
            "orderId": "mock-order-sms-001",
            "sendersReference": "mock-ref-001",
            "generated": 1,
            "succeeded": 1,
            "notifications": [{
                "id": "mock-notif-sms-001",
                "succeeded": true,
                "recipient": { "mobileNumber": "99999999" },
                "sendStatus": {
                    "status": "Succeeded",
                    "description": "SMS delivered successfully",
                    "lastUpdate": "2024-01-15T10:00:00"
                }
            }]
        }
        """;

    private const string MockFutureNotifications = """
        [{
            "shipmentId": "00000000-0000-0000-0000-000000000001",
            "creatorName": "digdir",
            "resourceId": "mock-resource-id",
            "sendersReference": "mock-ref-001",
            "requestedSendTime": "2024-06-01T12:00:00",
            "notificationChannel": "SmsAndEmail",
            "notificationType": "Notification",
            "deliveryAttempts": [{
                "nationalIdentityNumber": "13896895898",
                "channel": "Email",
                "emailAddress": "test@digdir.no",
                "result": "Succeeded",
                "resultTime": "2024-06-01T12:01:00"
            },
            {
                "nationalIdentityNumber": "13896895898",
                "channel": "Sms",
                "mobileNumber": "99999999",
                "result": "Succeeded",
                "resultTime": "2024-06-01T12:01:00"
            }]
        }]
        """;

}
