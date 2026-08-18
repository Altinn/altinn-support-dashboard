public interface IDialogportenClient
{
    Task<string> GetDialogById(string urn, string environmentName);
}
