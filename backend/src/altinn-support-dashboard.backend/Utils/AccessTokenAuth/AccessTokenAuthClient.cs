

using System.Net.Http.Headers;
using System.Text;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Utils.AccessTokenAuth;
using Microsoft.Extensions.Options;

public class AccessTokenAuthClient : IAccessTokenAuthClient
{
	private readonly ILogger<AccessTokenAuthClient> _logger;
	private HttpClient _client;
	private AccessTokenConfiguration _config;
	public AccessTokenAuthClient(IOptions<Configuration> configuration, ILogger<AccessTokenAuthClient> logger, IHttpClientFactory clientFactory)
	{
		_config = configuration.Value.AccessToken;
		_client = clientFactory.CreateClient();
		_client.BaseAddress = new Uri(_config.TokenGeneratorUrl);

		var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_config.Auth.TokenAuthUser}:{_config.Auth.TokenAuthPW}"));
		_client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", credentials);

		_logger = logger;
	}
	public async Task<string> GetJwt(string environment)
	{
		var url = $"/api/GetEnterpriseToken?env={environment}&scopes={_config.Scopes}&org=ttd";
		var response = await _client.GetAsync(url);

		if (!response.IsSuccessStatusCode)
		{
			_logger.LogError("Failed to retrieve Jwt from AccessToken");
			throw new HttpRequestException($"AccessToken request failed with status code {response.StatusCode}");
		}
		var responseBody = await response.Content.ReadAsStringAsync();
		return responseBody;
	}
}
