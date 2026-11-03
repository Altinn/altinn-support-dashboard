namespace altinn_support_dashboard.Server.Utils.AccessTokenAuth;

public interface IAccessTokenAuthClient
{
	Task<string> GetJwt(string environment);
}
