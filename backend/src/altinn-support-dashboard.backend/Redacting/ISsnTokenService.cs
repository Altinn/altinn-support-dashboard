
using altinn_support_dashboard.Server.Services.Interfaces;
public interface ISsnTokenService
{
    public string GenerateSsnToken(string ssn);
    public string GetSsnFromToken(string token);
}