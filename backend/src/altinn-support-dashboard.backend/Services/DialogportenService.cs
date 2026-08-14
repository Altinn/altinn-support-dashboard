using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Models.notifications;
using System.Net;
using System.Text.Json;

namespace altinn_support_dashboard.Server.Services;

public class DialogportenService : IDialogportenService
{
    private readonly IDialogportenClient _client;
    private readonly ILogger<IDialogportenService> _logger;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true
    };

    public DialogportenService(IDialogportenClient client, ILogger<IDialogportenService> logger)
    {
        _client = client;
        _logger = logger;
    }

    public async Task<string> GetDialogById(string urn, string environment)
    {
        return await _client.GetDialogById(urn, environment);
    }
}
