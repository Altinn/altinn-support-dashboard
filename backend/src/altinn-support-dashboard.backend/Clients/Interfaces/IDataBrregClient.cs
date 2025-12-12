

public interface IDataBrregClient
{
    Task<string> GetRolesAsync(string orgNumber, string environmentName);
    Task<string> GetUnderenheter(string orgNumber, string environmentName);
    Task<string> GetEnhetsdetaljer(string orgNumber, string environmentName);
}