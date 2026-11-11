using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;
using Models.notifications;

public class NotificationSendClient : INotificationSendClient
{
    private const string InstantEmailUrl ="notifications/api/v1/future/orders/instant/email";

    private readonly HttpClient _client;
    private readonly ILogger<INotificationSendClient> _logger;

    private static readonly JsonSerializerOptions _json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private static readonly string[] ExcludedHeaders = ["ApiKey", "authorization", "Ocp-Apim-Subscription-Key"];

    public NotificationSendClient(IHttpClientFactory factory, IOptions<Configuration> configuration, ILogger<INotificationSendClient> logger)
    {
        var config = configuration.Value.TT02;
        _client = factory.CreateClient("TT02");
        _client.BaseAddress = new Uri(config.BaseAddressAltinn3);
        _client.Timeout = TimeSpan.FromSeconds(config.Timeout);
        _client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", config.Ocp_Apim_Subscription_Key);
        _client.DefaultRequestHeaders.Add("ApiKey", config.ApiKey);
        _logger = logger;
    }

    public async Task<NotificationSendResponse> SendInstantEmail(InstantEmailOrderRequest order)
    {
        var requestBody = JsonSerializer.Serialize(order, _json);
        using var request = new HttpRequestMessage(HttpMethod.Post, InstantEmailUrl)
        {
            Content = new StringContent(requestBody, Encoding.UTF8, "application/json")
        };

        var response = await _client.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        var responseHeaders = response.Headers
            .Where(h => !ExcludedHeaders.Contains(h.Key, StringComparer.OrdinalIgnoreCase))
            .Select(h => $"{h.Key}: {string.Join(", ", h.Value)}");

        var result = new NotificationSendResponse
        {
            StatusCode = response.StatusCode,
            ResponseBody = responseBody,
            ResponseHeader = string.Join("\r\n", responseHeaders),
            RequestHeader = "Content-Type: application/json",
            RequestBody = requestBody
        };

        if (response.IsSuccessStatusCode)
        {
            result.Result = TryDeserialize<InstantEmailOrderResult>(responseBody);
        }
        else
        {
            _logger.LogWarning("Instant email order failed with status Code {StatusCode}", response.StatusCode);
            result.Problem = TryDeserialize<NotificationProblem>(responseBody);
        }

        return result;
    }

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
        catch
        {
            return null;
        }
    }
}