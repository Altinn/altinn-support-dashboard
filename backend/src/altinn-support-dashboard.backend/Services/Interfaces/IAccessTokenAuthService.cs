namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface IAccessTokenAuthService
{
	Task<string> GetJwt(string environment);
}
