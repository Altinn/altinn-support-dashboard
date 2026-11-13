using altinn_support_dashboard.Server.Utils;
using Models.notifications;

public class NotificationSendService : INotificationSendService
{
    private const string DefaultSubject = "Varsel test Altinn";
    private const string DefaultBody = "Test varsel fra Altinn";

    private readonly INotificationSendClient _client;

    public NotificationSendService(INotificationSendClient client)
    {
        _client = client;
    }

    public async Task<NotificationSendResponse> SendTestEmail(NotificationSendRequest request, string environmentName)
    {
        var email = request.EmailAddress?.Trim() ?? "";
        if (!ValidationService.IsValidEmail(email))
        {
            throw new BadRequestException("Not a valid email");
        }

        var order = new InstantEmailOrderRequest
        {
            RecipientEmail = new InstantRecipientEmail
            {
                EmailAddress = email,
                EmailSettings = new InstantEmailSettings
                {
                    Subject = string.IsNullOrWhiteSpace(request.Subject) ? DefaultSubject : request.Subject,
                    Body = string.IsNullOrWhiteSpace(request.Body) ? DefaultBody : request.Body
                }
            }
        };

        return await _client.SendInstantEmail(order, environmentName);
    }
}