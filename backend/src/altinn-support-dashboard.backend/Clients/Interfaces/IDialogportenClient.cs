public interface IDialogportenClient
{
    Task<string> GetDialogByUrn(string urn, string environmentName);
    Task<string> GetDialogDetails(string dialogId, string environmentName);
    Task<DeleteDialogResponse> DeleteDialogById(string dialogId, string revision, Boolean hardDelete, string environmentName);
}
