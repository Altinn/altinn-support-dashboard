using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace altinn_support_dashboard.Server.Models.correspondence;

public class Correspondence
{

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public CorrespondenceTypes ResourceId { get; set; }
    public string SendersReference { get; set; } = "testReference";
    public CorrespondenceNotification Notification { get; set; } = new CorrespondenceNotification();
    public CorrespondenceContent Content { get; set; } = new CorrespondenceContent();
    public string? MessageSender { get; set; }
    public DateTime? RequestedPublicTime { get; set; }
    public DateTime? AllowSystemDeleteAfter { get; set; }
    public DateTime DueDateTime { get; set; } = DateTime.UtcNow.AddDays(7);
    public List<CorrespondenceExternalReference>? ExternalRefences { get; set; }
    public List<CorrespondenceReplyOptions>? ReplyOptions { get; set; }

    public Dictionary<string, string>? PropertyList { get; set; }

    public bool? IgnoreReservation { get; set; }
    public DateTime? Published { get; set; }
    public bool? IsConfirmationNeeded { get; set; }
    public bool? IsConfidential { get; set; }
}
public enum CorrespondenceTypes
{
    [EnumMember(Value = "default")]
    Default,

    [EnumMember(Value = "confidentiality")]
    Confidentiality

}
