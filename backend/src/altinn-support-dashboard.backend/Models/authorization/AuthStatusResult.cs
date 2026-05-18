namespace Models.authorization;

public class AuthStatusResult
{
	public required bool IsLoggedIn { get; set; }
	public required bool AzureAuthActive { get; set; }
	public string? Name { get; set; }
	public required List<string> Roles { get; set; }
}
