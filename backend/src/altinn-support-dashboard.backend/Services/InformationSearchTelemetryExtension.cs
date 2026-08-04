using altinn_support_dashboard.Server.Services.Interfaces;

namespace altinn_support_dashboard.Server.Services;

public static class InformationSearchTelemetryExtensions
{
    private const string FeatureArea = "oppslag";

    public static void TrackOrgNumberSearch(this ITelemetryService telemetry, string orgNumber, string userId, string environment)
    {
        telemetry.TrackSearch(FeatureArea, "orgNumber", userId, environment, 
        new Dictionary<string, string> { { "orgNumber", orgNumber } });
    }

    public static void TrackEmailSearch(this ITelemetryService telemetry, string email, string userId, string environment)
    {
        telemetry.TrackSearch(FeatureArea, "email", userId, environment,
        new Dictionary<string, string> { { "email", email} });
    }

    public static void TrackPhoneSearch(this ITelemetryService telemetry, string phoneNumber, string userId, string environment)
    {
        telemetry.TrackSearch(FeatureArea, "phoneNumber", userId, environment,
        new Dictionary<string, string> { { "phoneNumber", phoneNumber} });
    }

    public static void TrackSsnSearch(this ITelemetryService telemetry, string ssn, string userId, string environment)
    {
        var ssnHash = Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(ssn)));
        telemetry.TrackSearch(FeatureArea, "ssn", userId, environment,
        new Dictionary<string, string> { { "ssnHash", ssnHash} });
    }
}