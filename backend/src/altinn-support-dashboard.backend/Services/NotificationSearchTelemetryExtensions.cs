using altinn_support_dashboard.Server.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace altinn_support_dashboard.Server.Services;

public static class NotificationSearchTelemetryExtensions
{
    private const string FeatureArea = "notifications";

    public static void TrackOrderIdSearch(this ITelemetryService telemetry, string channel, string orderId, string userId, string environment)
    {
        telemetry.TrackSearch(FeatureArea, $"orderId.{channel}", userId, environment, new Dictionary<string, string> { { "orderId", orderId } });
    }

    public static void TrackNinSearch(this ITelemetryService telemetry, string nin, string userId, string environment)
    {
        //To not have actual NIN in the logs, it gets hashed
        var ninHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(nin)));
        telemetry.TrackSearch(FeatureArea, "nin", userId, environment, new Dictionary<string, string> { { "ninHash", ninHash } });
    }

    public static void TrackOrgNrSearch(this ITelemetryService telemetry, string orgNr, string userId, string environment)
    {
        telemetry.TrackSearch(FeatureArea, "orgNr", userId, environment, new Dictionary<string, string> { { "orgNr", orgNr } });
    }

    public static void TrackPartyIdSearch(this ITelemetryService telemetry, string partyId, string userId, string environment)
    {
        telemetry.TrackSearch(FeatureArea, "partyId", userId, environment, new Dictionary<string,string> { { "partyId", partyId } });
    }

    public static void TrackPartyUuidSearch(this ITelemetryService telemetry, string partyUuid, string userId, string environment)
    {
        telemetry.TrackSearch(FeatureArea, "partyUuid", userId, environment, new Dictionary<string, string> { { "partyUuid", partyUuid } });
    }
}