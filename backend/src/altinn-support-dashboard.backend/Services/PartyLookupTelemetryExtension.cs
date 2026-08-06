using altinn_support_dashboard.Server.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace altinn_support_dashboard.Server.Services;

public static class PartyLookupTelemetryExtension
{
    private const string FeatureName = "internalIdLookup";

    public static void TrackPartyOrgLookup(this ITelemetryService telemetryService, string orgNumber, string userId, string environment)
    {
        telemetryService.TrackSearch(FeatureName, "orgNumber", userId, environment,
            new Dictionary<string, string> { { "orgNumber", orgNumber } });
    }

    public static void TrackPartySsnLookup(this ITelemetryService telemetryService, string ssn, string userId, string environment)
    {
        var ssnHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(ssn)));
        telemetryService.TrackSearch(FeatureName, "ssn", userId, environment,
            new Dictionary<string, string> { { "ssnHash", ssnHash } });
    }

    public static void TrackPartyUuidLookup(this ITelemetryService telemetryService, string uuid, string userId, string environment)
    {
        telemetryService.TrackSearch(FeatureName, "uuid", userId, environment,
            new Dictionary<string, string> { { "uuid", uuid } });
    }

    public static void TrackPartyIdLookup(this ITelemetryService telemetryService, string partyId, string userId, string environment)
    {
        telemetryService.TrackSearch(FeatureName, "partyId", userId, environment,
            new Dictionary<string, string> { { "partyId", partyId } });
    }
}
