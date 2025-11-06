using altinn_support_dashboard.Server.Models;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    public interface IPartyApiService
    {
        Task<ErRollerModel>? GetRolesFromOrgAsync(string orgNumber);
        Task<string>? GetRolesFromPartyAsync(string uuid);
        Task<PartyModel>? GetPartyFromOrgAsync(string orgNumber);
        Task<PartyModel>? GetPartyFromSsnAsync(string ssn);
        Task<PartyModel>? GetPartyFromUuidAsync(string uuid);
    }
}
