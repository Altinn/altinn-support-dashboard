using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.ApplicationInsights;
using System.Security.Cryptography;
using System.Text;

namespace altinn_support_dashboard.Server.Services;

public class TelemetryService : ITelemetryService
{
    private readonly TelemetryClient _telemetryClient;

    public TelemetryService(TelemetryClient telemetryClient)
    {
        _telemetryClient = telemetryClient;
    }

    public void TrackEvent(string eventName, IDictionary<string, string>? properties = null)
    {
        _telemetryClient.TrackEvent(eventName, properties);
    }

    public void TrackSsnUnmasked(string userId, string environment, string ssn)
    {
        var ssnHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(ssn)));
        _telemetryClient.TrackEvent("ssnUnmasked", new Dictionary<string, string>
        {
            { "userId", userId },
            { "environment", environment },
            { "ssnHash", ssnHash }
        });
    }
}
