using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;
using Models.notifications;

public class NotificationSendClient : INotificationSendClient
{
    private const string InstantEmailUrl = "notifications/api/v1/future/orders/instant/email";
    private const string InstantSmsUrl = "notifications/api/v1/future/orders/instant/sms";

    private readonly IHttpClientFactory _clientFactory;
    private readonly Configuration _configuration;
    private readonly ILogger<INotificationSendClient> _logger;

    private static readonly JsonSerializerOptions _json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private static readonly string[] ExcludedHeaders = ["ApiKey", "authorization", "Ocp-Apim-Subscription-Key"];

    public NotificationSendClient(IHttpClientFactory clientFactory, IOptions<Configuration> configuration, ILogger<INotificationSendClient> logger)
    {
        _clientFactory = clientFactory;
        _configuration = configuration.Value;
        _logger = logger;
    }

    public Task<NotificationSendResponse> SendInstantEmail(InstantEmailOrderRequest order, string environmentName) =>
        SendInstantOrder(order, InstantEmailUrl, "email", environmentName);
    
    public Task<NotificationSendResponse> SendInstantSms(InstantSmsOrderRequest order, string environmentName) =>
        SendInstantOrder(order, InstantSmsUrl, "SMS", environmentName);

    private async Task<NotificationSendResponse> SendInstantOrder<TOrder>(TOrder order, string url, string channel, string environmentName)
    {
        var config = GetEnvironmentConfiguration(environmentName);
        var client = _clientFactory.CreateClient(environmentName);
        client.Timeout = TimeSpan.FromSeconds(config.Timeout);
    }

    private EnvironmentConfiguration GetEnvironmentConfiguration(string environmentName) =>
        environmentName switch
        {
            nameof(Configuration.TT02) => _configuration.TT02,
            nameof(Configuration.Production) => _configuration.Production,
            _ => throw new BadRequestException($"Environment {environmentName} is not supported for sending notifications")
        };

    private static T? TryDeserialize<T>(string body) where T : class
    {
        if (string.IsNullOrWhiteSpace(body))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<T>(body, _json);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
