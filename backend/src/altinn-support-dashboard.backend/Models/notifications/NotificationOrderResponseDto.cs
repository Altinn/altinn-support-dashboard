namespace Models.notifications;

public class NotificationOrderResponseDto
{
    public required string OrderId { get; set; }
    public required string SendersReference { get; set; }
    public required int Generated { get; set; }
    public required int Succeeded { get; set; }
    public required List<NotificationDto> Notifications { get; set; }
}
