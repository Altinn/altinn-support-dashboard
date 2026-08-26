using Models.dialogporten;
using Models.notifications;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface IDialogportenService
{
    Task<DialogDto?> GetDialogByUrn(string urn, string environment, bool includeTitle);

}
