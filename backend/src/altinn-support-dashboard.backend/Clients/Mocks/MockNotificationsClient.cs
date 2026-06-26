public class MockNotificationsClient(NotificationsClient inner) : INotificationsClient
{
    private static bool IsMock(string env) =>
        string.Equals(env, "mock", StringComparison.OrdinalIgnoreCase);

    public Task<string> GetEmailNotificationsByOrderId(string orderId, string environmentName) =>
        IsMock(environmentName)
            ? Task.FromResult(MockDataReader.Read("notifications-email-order.json"))
            : inner.GetEmailNotificationsByOrderId(orderId, environmentName);

    public Task<string> GetSmsNotificationsByOrderId(string orderId, string environmentName) =>
        IsMock(environmentName)
            ? Task.FromResult(MockDataReader.Read("notifications-sms-order.json"))
            : inner.GetSmsNotificationsByOrderId(orderId, environmentName);

    public Task<string> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to, string environmentName) =>
        IsMock(environmentName)
            ? Task.FromResult(MockDataReader.Read("notifications-future.json"))
            : inner.GetFutureNotificationsByNin(nin, from, to, environmentName);
}
