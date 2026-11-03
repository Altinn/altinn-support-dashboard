
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils.AccessTokenAuth;
using Microsoft.Extensions.Caching.Memory;

public class AccessTokenAuthService : IAccessTokenAuthService
{
    private readonly IMemoryCache _cache;
    private readonly IAccessTokenAuthClient _client;

    public AccessTokenAuthService(IMemoryCache cache, IAccessTokenAuthClient client)
    {
        _cache = cache;
        _client = client;
    }

    // Will use cached jwt for given environment until it is no longer valid
    public async Task<string> GetJwt(string environment)
    {
        return await _cache.GetOrCreateAsync<string>($"AccessTokenJwt_{environment}", async entry =>
        {
            var result = await _client.GetJwt(environment);
            var jwt = JsonSerializer.Deserialize<string>(result) ?? throw new Exception("Failed to deserialize AccessToken Jwt");

            //will refresh 30 seconds before jwt expires
            entry.AbsoluteExpiration = new JwtSecurityTokenHandler().ReadJwtToken(jwt).ValidTo.AddMinutes(-0.5);
            return jwt;

        }) ?? throw new Exception("Cache returned null");
    }
}
