namespace Models.notifications;



public class FutureNotificationDeliveryAttemptDto
{

	public string? NationalIdentityNumber { get; set; }

	public string? Channel { get; set; }

	public string? EmailAddress { get; set; }

	public string? MobileNumber { get; set; }

	public string? Result { get; set; }

	public DateTime? ResultTime { get; set; }
}
