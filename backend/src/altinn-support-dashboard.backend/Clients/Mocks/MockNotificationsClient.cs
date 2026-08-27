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

    public Task<string> GetFutureNotificationsByOrgNr(string orgNr, DateTime? from, DateTime? to, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("notifications-future.json"))
            : inner.GetFutureNotificationsByOrgNr(orgNr, from, to, environmentName);

    public Task<string> GetFutureNotificationsByPhoneNumber(string phonenumber, DateTime? from, DateTime? to, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("notifications-future.json"))
            : inner.GetFutureNotificationsByPhoneNumber(phonenumber, from, to, environmentName);

    public Task<string> GetFutureNotificationsByEmail(string email, DateTime? from, DateTime? to, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("notifications-future.json"))
            : inner.GetFutureNotificationsByPhoneNumber(email, from, to, environmentName);


    public Task<string> GetNotificationLog(string? dialogId, string? transmissionId, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("notification-log.json"))
            : inner.GetNotificationLog(dialogId, transmissionId, environmentName);
}
