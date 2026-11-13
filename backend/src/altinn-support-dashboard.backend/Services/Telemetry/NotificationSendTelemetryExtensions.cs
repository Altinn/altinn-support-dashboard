using altinn_support_dashboard.Server.Services.Interfaces;
using Models.notifications;

namespace altinn_support_dashboard.Server.Services;

public static class NotificationSendTelemetryExtensions
{
    private const string FeatureArea = "notifications";

    public static void TrackTestEmailSent(this ITelemetryService telemetry, string email, NotificationSendResponse response, string userId, string environment)
    {
        var extra = new Dictionary<string, string>
        {
            { "email", email },
            { "statusCode", ((int)response.StatusCode).ToString() },
            { "success", (response.Result != null).ToString() }
        };

        if (response.Result != null)
        {
            extra["notificationOrderId"] = response.Result.NotificationOrderId.ToString();
            if (response.Result.Notification != null)
            {
                extra["shipmentId"] = response.Result.Notification.ShipmentId.ToString();
            }
        }

        telemetry.TrackSend(FeatureArea, "testEmail", userId, environment, extra);
    }
}
