using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.Extensions.Compliance.Redaction;
using Models.notifications;
using System.Text.Json;

namespace altinn_support_dashboard.Server.Services;

public class NotificationsService : INotificationsService
{
    private readonly INotificationsClient _client;
    private readonly IPartyApiService _partyService;
    private readonly ILogger<INotificationsService> _logger;
    private readonly IRedactorProvider _redactorProvider;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    public NotificationsService(INotificationsClient client, IPartyApiService partyService, ILogger<INotificationsService> logger, IRedactorProvider redactorProvider)
    {
        _partyService = partyService;
        _client = client;
        _logger = logger;
        _redactorProvider = redactorProvider;
    }

    private void RedactNationalIdentityNumbers(List<FutureNotificationDto> notifications)
    {
        foreach (var notification in notifications)
        {
            foreach (var attempt in notification.DeliveryAttempts)
            {
                if (attempt == null || string.IsNullOrEmpty(attempt.NationalIdentityNumber))
                {
                    continue;
                }

                try
                {
                    attempt.DisplayedNationalIdentityNumber = _redactorProvider.GetRedactor(CustomDataClassifications.SSN).Redact(attempt.NationalIdentityNumber);
                    attempt.NationalIdentityNumber = null;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to redact national identity number for a notification delivery attempt");
                }
            }
        }
    }

    public async Task<List<FutureNotificationDto>> GetFutureNotificationsByShipmentId(string shipmentId, string environmentName)
    {
        var result = await _client.GetFutureNotificationsByShipmentId(shipmentId, environmentName);
        var notifications = JsonSerializer.Deserialize<List<FutureNotificationDto>>(result, _jsonOptions) ?? throw new Exception("Error deserializing future notifications response");
        RedactNationalIdentityNumbers(notifications);
        return notifications;
    }

    public async Task<List<FutureNotificationDto>> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to, string environmentName)
    {
        var result = await _client.GetFutureNotificationsByNin(nin, from, to, environmentName);
        var notifications = JsonSerializer.Deserialize<List<FutureNotificationDto>>(result, _jsonOptions) ?? throw new Exception("Error deserializing future notifications response");
        RedactNationalIdentityNumbers(notifications);
        return notifications;
    }

    public async Task<List<FutureNotificationDto>> GetFutureNotificationsByOrgNr(string orgNr, DateTime? from, DateTime? to, string environmentName)
    {
        var result = await _client.GetFutureNotificationsByOrgNr(orgNr, from, to, environmentName);
        var notifications = JsonSerializer.Deserialize<List<FutureNotificationDto>>(result, _jsonOptions) ?? throw new Exception("Error deserializing future notifications response");
        RedactNationalIdentityNumbers(notifications);
        return notifications;
    }

    public async Task<List<FutureNotificationDto>> GetFutureNotificationsByPhoneNumber(string phoneNumber, DateTime? from, DateTime? to, string environmentName)
    {
        if (!phoneNumber.StartsWith('+'))
        {
            phoneNumber = "+47" + phoneNumber;
        }

        var result = await _client.GetFutureNotificationsByPhoneNumber(phoneNumber, from, to, environmentName);
        var notifications = JsonSerializer.Deserialize<List<FutureNotificationDto>>(result, _jsonOptions) ?? throw new Exception("Error deserializing future notifications response");
        RedactNationalIdentityNumbers(notifications);
        return notifications;
    }

    public async Task<List<FutureNotificationDto>> GetFutureNotificationsByEmail(string email, DateTime? from, DateTime? to, string environmentName)
    {
        var result = await _client.GetFutureNotificationsByEmail(email, from, to, environmentName);
        var notifications = JsonSerializer.Deserialize<List<FutureNotificationDto>>(result, _jsonOptions) ?? throw new Exception("Error deserializing future notifications response");
        RedactNationalIdentityNumbers(notifications);
        return notifications;
    }


    public async Task<List<FutureNotificationDto>> GetFutureNotificationsByPartyId(string partyId, DateTime? from, DateTime? to, string environmentName)
    {

        var party = await _partyService.GetPartyByIdAsync(partyId, environmentName);
        if (party?.OrgNumber != null)
        {
            return await GetFutureNotificationsByOrgNr(party.OrgNumber, from, to, environmentName);
        }
        else if (party?.Ssn != null)
        {
            return await GetFutureNotificationsByNin(party.Ssn, from, to, environmentName);
        }

        return new List<FutureNotificationDto>();
    }

    public async Task<List<FutureNotificationDto>> GetFutureNotificationsByPartyUuid(string partyUuid, DateTime? from, DateTime? to, string environmentName)
    {

        var party = await _partyService.GetPartyByUuidAsync(partyUuid, environmentName);
        if (party?.OrgNumber != null)
        {
            return await GetFutureNotificationsByOrgNr(party.OrgNumber, from, to, environmentName);
        }
        else if (party?.Ssn != null)
        {
            return await GetFutureNotificationsByNin(party.Ssn, from, to, environmentName);
        }

        return new List<FutureNotificationDto>();
    }

    public async Task<List<NotificationLog>> GetNotificationLogsAsync(string? dialogId, string? transmissionId, string environmentName)
    {
        var result = await _client.GetNotificationLog(dialogId, transmissionId, environmentName);
        return JsonSerializer.Deserialize<List<NotificationLog>>(result, _jsonOptions) ?? throw new Exception("Error deserializing notification logs response");
    }

}
