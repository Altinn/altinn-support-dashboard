namespace Models.notifications;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Net;


// From frontend
public class NotificationSendRequest
{
    public string EmailAddress { get; set; } = "";
    public string? Subject { get; set; }
    public string? Body { get; set; }
}

// From our backend to Altinn
public class InstantEmailOrderRequest
{
    public string IdempotencyId { get; set; } = Guid.NewGuid().ToString();
    public string SendersReference {get; set; } = $"asd-test-{Guid.NewGuid()}";
    public InstantRecipientEmail RecipientEmail {get; set; } = new();
}

public class InstantRecipientEmail
{
    public string EmailAddress { get; set; } = "";
    public InstantEmailSettings EmailSettings { get; set; } = new(); 
}

public class InstantEmailSettings
{
    public string Subject { get; set; } = "";
    public string Body { get; set; } = "";
    public string? SenderEmailAddress { get; set; }
    public string ContentType { get; set; } = "Plain";
}

public class NotificationSendResponse
{
    public HttpStatusCode StatusCode { get; set; }
    public string ResponseBody { get; set; } = "";
    public string ResponseHeader { get; set; } = "";
    public string RequestHeader { get; set; } = "";
    public string RequestBody { get; set; } = "";

    public InstantEmailOrderResult? Result { get; set; }
    public NotificationProblem? Problem { get; set; }

}

// Success 200/201
public class InstantEmailOrderResult
{
    public Guid NotificationOrderId { get; set; }
    public InstantNotificationShipment? Notification { get; set; }
}

public class InstantNotificationShipment
{
    public Guid ShipmentId { get; set; }
    public string? SendersReference { get; set; }
}

// Error (ProblemDetails / ValidtaionProblemDetails)
public class NotificationProblem
{
    public string? Type { get; set; }
    public string? Title { get; set; }
    public int? Status { get; set; }
    public string? Detail { get; set; }
    public string? Instance { get; set; }
    public Dictionary<string, string[]>? Errors { get; set; }

    // Catches  additionalProp1..n
    [JsonExtensionData]
    public Dictionary<string, JsonElement>? Extensions { get; set; }
}