using altinn_support_dashboard.Server.Utils;
using Models.notifications;

public class NotificationSendService : INotificationSendService
{
    private const string DefaultSubject = "Varslingstest Altinn";
    private const string DefaultBody = "Dette er en varslingstest fra Altinn.\nDenne meldingen kan ikke besvares.";

    private readonly INotificationSendClient _client;

    public NotificationSendService(INotificationSendClient client)
    {
        _client = client;
    }

    public async Task<NotificationSendResponse> SendTestEmail(NotificationSendRequest request, string environmentName, string idempotencyId, string sendersReference)
    {
        var email = request.EmailAddress?.Trim() ?? "";
        if (!ValidationService.IsValidEmail(email))
        {
            throw new BadRequestException("Not a valid email");
        }

        var order = new InstantEmailOrderRequest
        {
            IdempotencyId = idempotencyId,
            SendersReference = sendersReference,
            RecipientEmail = new InstantRecipientEmail
            {
                EmailAddress = email,
                EmailSettings = new InstantEmailSettings
                {
                    Subject = DefaultSubject,
                    Body = DefaultBody
                }
            }
        };

        return await _client.SendInstantEmail(order, environmentName);
    }
}