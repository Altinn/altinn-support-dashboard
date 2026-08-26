using altinn_support_dashboard.Server.Services.Interfaces;
using Models.dialogporten;
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

    public async Task<DialogDto?> GetDialogByUrn(string urn, string environment, bool includeTitle)
    {
        string result = await _client.GetDialogByUrn(urn, environment);
        if (result == string.Empty)
        {
            return null;
        }
        DialogDto dialog = JsonSerializer.Deserialize<DialogDto>(result, _jsonOptions) ?? throw new Exception("Error serializing dialog payload");

        //Title may include sensetive information
        if (!includeTitle)
        {
            dialog.Title = null;
        }

        return dialog;
    }
}
