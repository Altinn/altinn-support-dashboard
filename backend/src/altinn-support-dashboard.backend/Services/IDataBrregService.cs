using altinn_support_dashboard.Server.Models;
using System.Threading.Tasks;

namespace altinn_support_dashboard.Server.Services
{
    public interface IDataBrregService
    {
        Task<RollerMain> GetRolesAsync(string orgNumber);
    }
}
