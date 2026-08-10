namespace Models.notifications;

public class NotificationLog
{
    public required string NotificationId { get; set; }
    public required string DialogId { get; set; }
    public required string TransmissionId { get; set; }
    public required string Type { get; set; }
    public required string Channel { get; set; }
    public required string Destination { get; set; }
    public required string Status { get; set; }
    public required DateTime RequestedSendTime { get; set; }
    public required DateTime LastUpdateTime { get; set; }
}