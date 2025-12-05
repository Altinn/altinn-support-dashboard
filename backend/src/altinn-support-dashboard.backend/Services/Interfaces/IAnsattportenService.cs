

using System.Security.Claims;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface IAnsattportenService
{
    Task<List<string>> GetUserPolicies(ClaimsPrincipal user);
    Task<string> GetRepresentationOrgName(ClaimsPrincipal user);

}


