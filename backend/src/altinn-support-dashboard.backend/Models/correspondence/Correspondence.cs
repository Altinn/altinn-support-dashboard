
namespace altinn_support_dashboard.Server.Models;

public class Correspondence
{
    public required string ResourceId { get; set; }
    public string SendersReference { get; set; } = "testReference";
    public required CorrespondenceNotification Notification { get; set; }
    public required CorrespondenceContent Content { get; set; }
    public string? MessageSender { get; set; }
    public DateTime? RequestedPublicTime { get; set; }
    public DateTime? AllowSystemDeleteAfter { get; set; }
    public DateTime? DueDateTime { get; set; }
    public List<CorrespondenceExternalReference>? ExternalRefences { get; set; }
    public List<CorrespondenceReplyOptions>? ReplyOptions { get; set; }

    public Dictionary<string, string>? PropertyList { get; set; }

    public bool? IgnoreReservation { get; set; }
    public DateTime? Published { get; set; }
    public bool? IsConfirmedNeeded { get; set; }
    public bool? IsConfidential { get; set; }
}
