namespace altinn_support_dashboard.Server.Models.correspondence;

public class CorrespondenceNotification
{
    public string NotificationTemplate { get; set; } = "GenericAltinnMessage";
    public string? EmailSubject { get; set; }
    public string? EmailBody { get; set; }
    public string? EmailContentType { get; set; }
    public string? SmsBody { get; set; }
    public bool? SendReminder { get; set; }
    public string? ReminderEmailSubject { get; set; }
    public string? ReminderEmailContentType { get; set; }
    public string? ReminderSmsBody { get; set; }
    public NotificationChannel? NotificationChannel { get; set; }
    public string? ReminderNotificationChannel { get; set; }
    public string? SendersRefernce { get; set; }
    public DateTime? RequestedSendTime { get; set; }
    public List<CorrespondenceRecipient>? CustomRecipients { get; set; }
    public bool? OverrideRegisteredContactInformation { get; set; }
}


public enum NotificationChannel
{
    Email = 0,
    Sms = 1,
    EmailPreffered = 2,
    SmsPreffered = 3,
    EmailAndSms = 4
}


