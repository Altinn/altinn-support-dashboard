namespace Models.notifications;

public class NotificationLog
{
    public required string notificationId { get; set; }
    public required string dialogId { get; set; }
    public required string transmissionId { get; set; }
    public required string type { get; set; }
    public required string channel { get; set; }
    public required string destination { get; set; }
    public required string status { get; set; }
    public required DateTime requestedSendTime { get; set; }
    public required DateTime lastUpdateTime { get; set; }
}