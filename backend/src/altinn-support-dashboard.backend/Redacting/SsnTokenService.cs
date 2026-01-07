using System.Collections.Concurrent;

namespace altinn_support_dashboard.Server.Services.Interfaces;
public class SsnTokenService : ISsnTokenService
{
    private static ConcurrentDictionary<string, (string ssn, DateTime Expiry)> _tokens = new ();

    public string GenerateSsnToken(string ssn)
    {
        if (string.IsNullOrWhiteSpace(ssn) || ssn.Length != 11 || !long.TryParse(ssn, out _))
        {
            throw new ArgumentException("Invalid SSN");
        }
        var token = Guid.NewGuid().ToString();
        _tokens[token] = (ssn, DateTime.UtcNow.AddMinutes(15));
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
}