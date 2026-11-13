using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;
using Models.notifications;

public class NotificationSendClient : INotificationSendClient
{
    private const string InstantEmailUrl = "notifications/api/v1/future/orders/instant/email";

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

    public async Task<NotificationSendResponse> SendInstantEmail(InstantEmailOrderRequest order, string environmentName)
    {
        var config = GetEnvironmentConfiguration(environmentName);
        var client = _clientFactory.CreateClient(environmentName);
        client.Timeout = TimeSpan.FromSeconds(config.Timeout);

        var requestBody = JsonSerializer.Serialize(order, _json);
        using var request = new HttpRequestMessage(HttpMethod.Post, new Uri(new Uri(config.BaseAddressAltinn3), InstantEmailUrl))
        {
            Content = new StringContent(requestBody, Encoding.UTF8, "application/json")
        };
        request.Headers.Add("ApiKey", config.ApiKey);
        request.Headers.Add("Ocp-Apim-Subscription-Key", config.Ocp_Apim_Subscription_Key);

        var response = await client.SendAsync(request);
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
            _logger.LogWarning("Instant email order failed in environment {EnvironmentName} with status code {StatusCode}", environmentName, response.StatusCode);
            result.Problem = TryDeserialize<NotificationProblem>(responseBody);
        }

        return result;
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
