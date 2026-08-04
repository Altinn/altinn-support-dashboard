namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface ITelemetryService
{
    void TrackEvent(string eventName, IDictionary<string, string>? properties = null);
    void TrackSsnUnmasked(string userId, string environment, string ssn);
    void TrackSearch(string featureArea, string searchType, string userId, string environment, IDictionary<string, string>? extra = null);
}
