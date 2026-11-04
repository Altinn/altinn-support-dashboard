using System.Net.Http.Headers;
using altinn_support_dashboard.Server.Services.Interfaces;

namespace altinn_support_dashboard.Server.Utils;

public class AccessTokenHandler : DelegatingHandler
{
    private readonly IAccessTokenAuthService _tokenService;
    private readonly string _environment;

    public AccessTokenHandler(IAccessTokenAuthService tokenService, string environment)
    {
        _tokenService = tokenService;
        _environment = environment;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var jwt = await _tokenService.GetJwt(_environment);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", jwt);
        return await base.SendAsync(request, cancellationToken);
    }
}
