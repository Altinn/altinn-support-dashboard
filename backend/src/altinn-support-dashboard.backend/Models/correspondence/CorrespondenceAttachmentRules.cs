namespace altinn_support_dashboard.Server.Models.correspondence;

public static class CorrespondenceAttachmentRules
{
    public const int MinAttachments = 1;
    public const int MaxAttachments = 50;

    public static readonly List<string> AllowedFileTypes =
    [
        ".doc",
        ".xls",
        ".docx",
        ".xlsx",
        ".ppt",
        ".pps",
        ".zip",
        ".pdf",
        ".html",
        ".txt",
        ".xml",
        ".jpg",
        ".jpeg",
        ".gif",
        ".bmp",
        ".png",
        ".json",
        ".csv",
        ".dcm",
        ".dicom"
    ];
}
