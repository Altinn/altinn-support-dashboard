

public class Correspondence
{
    public required string ResourceId { get; set; }
    public required string SendersReference { get; set; }
    public required CorrespondenceNotification Notification { get; set; }
    public required CorrespondenceContent Content { get; set; }
    public string? MessageSender { get; set; }
    public DateTime? RequestedPublicTime { get; set; }
    public DateTime? AllowSystemDeleteAfter { get; set; }
    public DateTime? DueDateTime { get; set; }
    public string[]? ExternalRefences { get; set; }
    public string[]? ReplyOptions { get; set; }

    //Should be object
    public string? PropertyList { get; set; }

    public bool? IgnoreReservation { get; set; }
    public DateTime? Published { get; set; }
    public bool? IsConfirmedNeeded { get; set; }
    public bool? IsConfidential { get; set; }
}
