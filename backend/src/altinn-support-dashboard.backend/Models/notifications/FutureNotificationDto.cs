namespace Models.notifications;

public class FutureNotificationDto
{
	public Guid ShipmentId { get; set; }

	public required string CreatorName { get; set; }

	public string? ResourceId { get; set; }

	public string? SendersReference { get; set; }

	public DateTime RequestedSendTime { get; set; }

	public string? NotificationChannel { get; set; }

	public string? NotificationType { get; set; }

	public string? DialogId { get; init; }

	public string? TransmissionId { get; init; }

	public string? SenderAddress { get; init; }

	public List<FutureNotificationDeliveryAttemptDto?> DeliveryAttempts { get; set; } = [];

}

