using Models.notifications;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface INotificationsService
{
    Task<List<FutureNotificationDto>> GetFutureNotificationsByShipmentId(string shipmentId, string environmentName);
    Task<List<FutureNotificationDto>> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to, string environmentName);
    Task<List<FutureNotificationDto>> GetFutureNotificationsByOrgNr(string orgNr, DateTime? from, DateTime? to, string environmentName);
    Task<List<FutureNotificationDto>> GetFutureNotificationsByPhoneNumber(string phoneNumber, DateTime? from, DateTime? to, string environmentName);
    Task<List<FutureNotificationDto>> GetFutureNotificationsByEmail(string email, DateTime? from, DateTime? to, string environmentName);
    Task<List<FutureNotificationDto>> GetFutureNotificationsByPartyId(string partyId, DateTime? from, DateTime? to, string environmentName);
    Task<List<FutureNotificationDto>> GetFutureNotificationsByPartyUuid(string partyUuid, DateTime? from, DateTime? to, string environmentName);
    Task<List<NotificationLog>> GetNotificationLogsAsync(string? dialogId, string? transmissionId, string environmentName);

}
