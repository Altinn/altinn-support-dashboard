
using Azure.Core;

public class AccessTokenConfiguration
{
	public required string TokenGeneratorUrl { get; set; }
	public required string Scopes { get; set; }
	public required AccessTokenAuth Auth { get; set; }
	public Dictionary<string, string> Environments { get; set; } = new();
}

public class AccessTokenAuth
{
	public required string TokenAuthUser { get; set; }
	public required string TokenAuthPW { get; set; }
}
