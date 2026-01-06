using altinn_support_dashboard.Server.Models;
using System.Threading.Tasks;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    public interface IDataBrregService
    {
        Task<ErRollerModel> GetRolesAsync(string orgNumber, string environmentName);
        Task<UnderenhetRootObject> GetUnderenheter(string orgNumber, string environmentName);
        Task<UnderEnhet> GetUnderenhet(string orgNumber, string environmentName);
        Task<object> GetEnhetsdetaljer(string orgNumber, string environmentName);
    }
}
