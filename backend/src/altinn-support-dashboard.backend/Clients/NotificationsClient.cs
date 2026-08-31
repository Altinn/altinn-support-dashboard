using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Options;

public class NotificationsClient : INotificationsClient
{
    private readonly Dictionary<string, HttpClient> _clients = new();
    private readonly ILogger<INotificationsClient> _logger;

    public NotificationsClient(IOptions<Configuration> configuration, IHttpClientFactory clientFactory, ILogger<INotificationsClient> logger)
    {
        _logger = logger;
        InitClient(nameof(configuration.Value.TT02), configuration.Value.TT02, clientFactory);
        InitClient(nameof(configuration.Value.Production), configuration.Value.Production, clientFactory);
    }

    private void InitClient(string environmentName, EnvironmentConfiguration config, IHttpClientFactory clientFactory)
    {
        var client = clientFactory.CreateClient(environmentName);
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", config.Ocp_Apim_Subscription_Key);
        client.BaseAddress = new Uri(config.BaseAddressAltinn3);
        client.Timeout = TimeSpan.FromSeconds(config.Timeout);
        client.DefaultRequestHeaders.Add("ApiKey", config.ApiKey);
        _clients.Add(environmentName, client);
    }

    public async Task<string> GetEmailNotificationsByOrderId(string orderId, string environmentName)
    {
        var client = _clients[environmentName];
        var response = await client.GetAsync($"notifications/api/v1/orders/{orderId}/notifications/email");
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(
                $"Api request failed with status code {response.StatusCode}: {responseBody}",
                inner: null,
                statusCode: response.StatusCode);
        }

        return responseBody;
    }

    public async Task<string> GetSmsNotificationsByOrderId(string orderId, string environmentName)
    {
        var client = _clients[environmentName];
        var response = await client.GetAsync($"notifications/api/v1/orders/{orderId}/notifications/sms");
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(
                $"Api request failed with status code {response.StatusCode}: {responseBody}",
                inner: null,
                statusCode: response.StatusCode);
        }

        return responseBody;
    }

    public async Task<string> GetFutureNotificationsByNin(string nin, DateTime? from, DateTime? to, string environmentName)
    {
        var url = "notifications/api/v1/future/dashboard/recipients/notifications/nin";
        return await GetFutureNotifications(url, "NationalIdentityNumber", nin, from, to, environmentName);
    }

    public async Task<string> GetFutureNotificationsByPhoneNumber(string phoneNumber, DateTime? from, DateTime? to, string environmentName)
    {
        var url = "notifications/api/v1/future/dashboard/recipients/notifications/phonenumber";
        return await GetFutureNotifications(url, "PhoneNumber", phoneNumber, from, to, environmentName);
    }

    public async Task<string> GetFutureNotificationsByEmail(string email, DateTime? from, DateTime? to, string environmentName)
    {
        var url = "notifications/api/v1/future/dashboard/recipients/notifications/email";
        return await GetFutureNotifications(url, "Email", email, from, to, environmentName);
    }

    public async Task<string> GetFutureNotificationsByOrgNr(string orgNr, DateTime? from, DateTime? to, string environmentName)
    {
        var url = "notifications/api/v1/future/dashboard/recipients/notifications/orgnumber";
        return await GetFutureNotifications(url, "OrganizationNumber", orgNr, from, to, environmentName);
    }
    private async Task<string> GetFutureNotifications(string url, string headerName, string headerValue, DateTime? from, DateTime? to, string environmentName)
    {

        var client = _clients[environmentName];
        var query = new List<string>();

        if (from.HasValue)
        {
            query.Add($"from={Uri.EscapeDataString(from.Value.ToString("O"))}");
        }
        if (to.HasValue)
        {
            query.Add($"to={Uri.EscapeDataString(to.Value.ToString("O"))}");
        }
        if (query.Count > 0)
        {
            url += "?" + string.Join("&", query);
        }

        using var request = new HttpRequestMessage(HttpMethod.Get, url);

        request.Headers.Add(headerName, headerValue);
        var response = await client.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(
                $"Api request failed with status code {response.StatusCode}: {responseBody}",
                inner: null,
                statusCode: response.StatusCode);
        }
        return responseBody;
    }

    public async Task<string> GetNotificationLog(string? dialogId, string? transmissionId, string environmentName)
    {
        var client = _clients[environmentName];
        var query = new List<string>();

        if (!string.IsNullOrEmpty(dialogId))
        {
            query.Add($"dialogId={Uri.EscapeDataString(dialogId)}");
        }
        if (!string.IsNullOrEmpty(transmissionId))
        {
            query.Add($"transmissionId={Uri.EscapeDataString(transmissionId)}");
        }
        var url = "notifications/api/v1/future/log";
        if (query.Count > 0)
        {
            url += "?" + string.Join("&", query);
        }

        var response = await client.GetAsync(url);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(
                $"Api request failed with status code {response.StatusCode}: {responseBody}",
                inner: null,
                statusCode: response.StatusCode);
        }

        return responseBody;
    }
}
