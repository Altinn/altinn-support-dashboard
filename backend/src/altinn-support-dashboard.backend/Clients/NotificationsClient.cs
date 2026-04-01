using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;

public class NotificationsClient : INotificationsClient
{
    private readonly HttpClient _client;
    private readonly ILogger<INotificationsClient> _logger;

    public NotificationsClient(IOptions<Configuration> configuration, IHttpClientFactory clientFactory, ILogger<INotificationsClient> logger)
    {
        _logger = logger;

        var tt02 = configuration.Value.TT02;
        _client = clientFactory.CreateClient(nameof(configuration.Value.TT02));
        _client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", tt02.Ocp_Apim_Subscription_Key);
        _client.BaseAddress = new Uri(tt02.BaseAddressAltinn3);
        _client.Timeout = TimeSpan.FromSeconds(tt02.Timeout);
        _client.DefaultRequestHeaders.Add("ApiKey", tt02.ApiKey);
    }

    public async Task<string> GetEmailNotificationsByOrderId(string orderId)
    {
        return "";
    }

    public async Task<string> GetSmsNotificationsByOrderId(string orderId)
    {
        return "";
    }
}
