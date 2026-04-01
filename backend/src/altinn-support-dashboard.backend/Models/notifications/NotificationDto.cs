namespace Models.notifications;

public class NotificationDto
{
    public required string Id { get; set; }
    public required bool Succeeded { get; set; }
    public required NotificationRecipientDto Recipient { get; set; }
    public required NotificationSendStatusDto SendStatus { get; set; }
}
