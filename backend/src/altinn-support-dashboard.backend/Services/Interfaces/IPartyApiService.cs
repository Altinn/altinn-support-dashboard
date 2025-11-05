using altinn_support_dashboard.Server.Models;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    public interface IPartyApiService
    {
        Task<ErRollerModel> GetRolesAsync(string orgNumber);
    }
}
