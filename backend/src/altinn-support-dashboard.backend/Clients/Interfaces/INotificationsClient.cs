public interface INotificationsClient
{
    Task<string> GetFutureNotificationsByShipmentId(string shipmentId, string environmentName);
    Task<string> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to, string environmentName);
    Task<string> GetFutureNotificationsByOrgNr(string orgNr, DateTime? from, DateTime? to, string environmentName);
    Task<string> GetFutureNotificationsByPhoneNumber(string phoneNumber, DateTime? from, DateTime? to, string environmentName);
    Task<string> GetFutureNotificationsByEmail(string phoneNumber, DateTime? from, DateTime? to, string environmentName);

    Task<string> GetNotificationLog(string? dialogId, string? transmissionId, string environmentName);
}
