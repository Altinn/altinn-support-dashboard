using altinn_support_dashboard.Server.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace altinn_support_dashboard.Server.Services;

public static class PartyLookupTelemetryExtension
{
    private const string FeatureName = "internalIdLookup";

    public static void TrackPartyLookup(this ITelemetryService telemetryService, string orgNumber, string userId, string environment)
    {
        telemetryService.TrackSearch(FeatureName, "orgNumber", userId, environment,
            new Dictionary<string, string> { { "orgNumber", orgNumber } });
    }
}