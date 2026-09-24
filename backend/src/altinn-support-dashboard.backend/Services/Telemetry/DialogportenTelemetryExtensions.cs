using altinn_support_dashboard.Server.Services.Interfaces;

namespace altinn_support_dashboard.Server.Services;

public static class DialogPortenTelemetryExtension
{
	private const string FeatureArea = "Dialogporten";

	public static void TrackDialogSearchByUrn(this ITelemetryService telemetry, string urn, string userId, string environment)
	{
		telemetry.TrackSearch(FeatureArea, "Dialog", userId, environment,
		new Dictionary<string, string> { { "Dialog", urn } });
	}

	public static void TrackDialogHardDelete(this ITelemetryService telemetry, string dialogId, string userId, string environment)
	{
		telemetry.TrackSearch(FeatureArea, "HardDelete", userId, environment,
		new Dictionary<string, string> { { "Dialog", dialogId } });
	}

	public static void TrackDialogSoftDelete(this ITelemetryService telemetry, string dialogId, string userId, string environment)
	{
		telemetry.TrackSearch(FeatureArea, "SoftDelete", userId, environment,
		new Dictionary<string, string> { { "Dialog", dialogId } });
	}
}
