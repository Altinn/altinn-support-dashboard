using altinn_support_dashboard.Server.Models;

namespace altinn_support_dashboard.Server.Services
{
    public interface IDataBrregService
    {
        Task<RollerMain> GetRolesAsync(string orgNumber);
    }
}
