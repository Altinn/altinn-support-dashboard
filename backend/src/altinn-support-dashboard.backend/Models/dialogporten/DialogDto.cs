namespace Models.dialogporten;

public class DialogDto
{
	public required string DialogId { get; set; }
	public required string InstanceRef { get; set; }
	public required string Party { get; set; }
	public required ServiceResourceDto ServiceResource { get; set; }
	public required ServiceOwnerDto ServiceOwner { get; set; }
	public required List<ResourceNameDto> Title { get; set; }
	public List<ResourceNameDto>? NonSensetiveTitle { get; set; }

}

public class ServiceResourceDto
{
	public required string Id { get; set; }
	public required bool IsDelegable { get; set; }
	public required int MinimumAuthenticationLevel { get; set; }
	public required List<ResourceNameDto> Name { get; set; }

}
public class ResourceNameDto
{
	public required string Value { get; set; }
	public required string LanguageCode { get; set; }
}
public class ServiceOwnerDto
{
	public required string OrgNumber { get; set; }
	public required string Code { get; set; }
	public required List<ResourceNameDto> Name { get; set; }

}
