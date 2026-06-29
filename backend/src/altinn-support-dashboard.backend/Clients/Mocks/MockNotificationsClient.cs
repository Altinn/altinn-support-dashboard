public class MockNotificationsClient(NotificationsClient inner) : INotificationsClient
{
    public Task<string> GetEmailNotificationsByOrderId(string orderId, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("notifications-email-order.json"))
            : inner.GetEmailNotificationsByOrderId(orderId, environmentName);

    public Task<string> GetSmsNotificationsByOrderId(string orderId, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("notifications-sms-order.json"))
            : inner.GetSmsNotificationsByOrderId(orderId, environmentName);

    public Task<string> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("notifications-future.json"))
            : inner.GetFutureNotificationsByNin(nin, from, to, environmentName);
}
