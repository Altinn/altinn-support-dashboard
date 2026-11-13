using altinn_support_dashboard.Server.Services.Interfaces;
using Models.notifications;

namespace altinn_support_dashboard.Server.Services;

public static class NotificationSendTelemetryExtensions
{
    private const string FeatureArea = "notifications";

    // The recipient's email is intentionally not logged.
    // Successful sends can be traced to the recipient via shipmentId.
    public static void TrackTestEmailSent(this ITelemetryService telemetry, NotificationSendResponse response, string userId, string environment)
    {
        var extra = new Dictionary<string, string>
        {
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
