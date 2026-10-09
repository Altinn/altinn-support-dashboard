public class MockNotificationsClient(NotificationsClient inner) : INotificationsClient
{
    public Task<string> GetFutureNotificationsByShipmentId(string shipmentId, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("notifications-future.json"))
            : inner.GetFutureNotificationsByShipmentId(shipmentId, environmentName);

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
            : inner.GetFutureNotificationsByEmail(email, from, to, environmentName);


    public Task<string> GetNotificationLog(string? dialogId, string? transmissionId, string environmentName) =>
        MockUtils.IsMock(environmentName)
            ? Task.FromResult(MockUtils.Read("notification-log.json"))
            : inner.GetNotificationLog(dialogId, transmissionId, environmentName);
}
