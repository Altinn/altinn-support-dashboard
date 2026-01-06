

public class SsnTokenService : ISsnTokenService
{
    private static Dictionary<string, (string ssn, DateTime Expiry)> _tokens = new ();

    public string GenerateSsnToken(string ssn)
    {
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