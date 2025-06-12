public class GiteaApiClient
{
    private readonly HttpClient _httpClient;

    public GiteaApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> GetCurrentUserAsync(string patToken, string giteaBaseUrl)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"{giteaBaseUrl}/api/v1/user");
        request.Headers.Add("Authorization", $"token {patToken}");

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }
        return await response.Content.ReadAsStringAsync();
    }
}
