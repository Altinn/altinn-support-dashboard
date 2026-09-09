using System.Net;

namespace Models.dialogporten;

public class DeleteDialogRequest
{
	public required string DialogId { get; set; }
	public required string Revision { get; set; }
	public required Boolean HardDelete { get; set; }
}
