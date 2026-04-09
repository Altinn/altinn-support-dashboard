namespace Models.notifications;

public class NotificationSendStatusDto
{
    public required string Status { get; set; }
    public required string Description { get; set; }
    public required DateTime LastUpdate { get; set; }
}
