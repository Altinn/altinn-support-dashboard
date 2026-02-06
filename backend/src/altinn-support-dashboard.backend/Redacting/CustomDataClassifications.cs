

using Microsoft.Extensions.Compliance.Classification;

public static class CustomDataClassifications
{
    public static DataClassification SSN { get; } = new DataClassification(
        "AltinnSupportDashboard",
        "SSN"
    );
}