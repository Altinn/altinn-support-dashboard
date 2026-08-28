
namespace altinn_support_dashboard.Server.Services;

public static class DialogPortenTelemetryExtension
{
	private const string FeatureArea = "Dialogporten";

	public static void TrackDialogSearchByUrn(this ITelemetryService telemetry, string urn, string userId, string environment)
	{
		telemetry.TrackSearch(FeatureArea, "Dialog", userId, environment,
		new Dictionary<string, string> { { "Dialog", urn } });
	}
}
