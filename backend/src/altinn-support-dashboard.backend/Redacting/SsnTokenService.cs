using System.Collections.Concurrent;

namespace altinn_support_dashboard.Server.Services.Interfaces;
public class SsnTokenService : ISsnTokenService
{
    private static ConcurrentDictionary<string, (string ssn, DateTime Expiry)> _tokens = new ();
    private readonly Timer _removeTokenTimer;
    private readonly int _tokenExpiryMinutes;
    
    public SsnTokenService(IConfiguration configuration)
    {
        _tokenExpiryMinutes = configuration.GetValue<int>("SsnTokenSettings:TokenExpiryMinutes", 15); // Gets the value from appsettings.json. Default to 15 minutes if not set
        var removalIntervalMinutes = configuration.GetValue<int>("SsnTokenSettings:RemovalIntervalMinutes", 5); //Gets the value from appsettings.json. Default to 5 minutes if not set

        _removeTokenTimer = new Timer(
            RemoveExpiredTokens, 
            null, 
            TimeSpan.FromMinutes(removalIntervalMinutes), 
            TimeSpan.FromMinutes(removalIntervalMinutes)
        );
        // Sets up a timer to remove expired tokens at regular intervals (5min as defauilt if not set)
    }

    public string GenerateSsnToken(string ssn)
    {
        if (string.IsNullOrWhiteSpace(ssn) || ssn.Length != 11 || !long.TryParse(ssn, out _))
        {
            throw new ArgumentException("Invalid SSN");
        }
        var token = Guid.NewGuid().ToString();
        _tokens[token] = (ssn, DateTime.UtcNow.AddMinutes(_tokenExpiryMinutes)); 
        // Token valid for set time, or 15min by if not set
        return token;
    }

    public string GetSsnFromToken(string token)
    {
        if (_tokens.TryGetValue(token, out var data) && data.Expiry > DateTime.UtcNow)
        {
            return data.ssn;
        }
        return "";
    }

    private void RemoveExpiredTokens(object? state)
    {
        var now = DateTime.UtcNow;
        var expiredTokens = _tokens.Where(kvp => kvp.Value.Expiry <= now).Select(kvp => kvp.Key).ToList(); 
        // Create a list of expired tokens

        foreach (var token in expiredTokens)
        // Remove expired tokens from the dictionary
        {
            _tokens.TryRemove(token, out _);
        }
    }
}