public interface IDialogportenClient
{
    Task<string> GetDialogByUrn(string urn, string environmentName);
}
