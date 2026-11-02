using altinn_support_dashboard.Server.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;
using Models.legalrequest;

namespace altinn_support_dashboard.Server.Services;

public static class LegalRequestTelemetryExtensions
{
    private const string FeatureArea = "legalrequest";

    public static void TrackLegalRequestExport(this ITelemetryService telemetry, LegalRequestLookupRequest request, string userId, string environment)
    {
        //To not have actual NIN in the logs, it gets hashed
        var ninHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(request.NationalIdentityNumber)));
        telemetry.TrackSearch(FeatureArea, "export", userId, environment, new Dictionary<string, string>
        {
            { "ninHash", ninHash },
            { "organizationNumber", request.OrganizationNumber ?? "" },
            { "caseReference", request.CaseReference },
            { "from", request.From.UtcDateTime.ToString("O") },
            { "to", request.To.UtcDateTime.ToString("O") },
            { "categories", request.Categories is { Count: > 0 } ? string.Join(",", request.Categories) : "all" }
        });
    }
}
