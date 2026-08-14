using Models.notifications;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface IDialogportenService
{
    Task<string> GetDialogById(string urn, string environment);

}
