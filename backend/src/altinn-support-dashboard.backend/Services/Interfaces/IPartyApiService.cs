using altinn_support_dashboard.Server.Models;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    public interface IPartyApiService
    {
        Task<ErRollerModel> GetRolesFromOrgAsync(string orgNumber, string environmentName);
        Task<string> GetRolesFromPartyAsync(string uuid, string environmentName);
        Task<PartyModel> GetPartyFromOrgAsync(string orgNumber, string environmentName);
        Task<PartyModel> GetPartyFromSsnAsync(string ssn, string environmentName);
        Task<PartyModel> GetPartyFromUuidAsync(string uuid, string environmentName);
    }
}
