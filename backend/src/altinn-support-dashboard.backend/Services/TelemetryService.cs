using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.ApplicationInsights;

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
}
