

public interface ISsnTokenService
{
    public string GenerateSsnToken(string ssn);
    public string GetSsnFromToken(string token);
}