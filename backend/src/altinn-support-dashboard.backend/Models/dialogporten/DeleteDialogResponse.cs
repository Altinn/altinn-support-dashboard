
using System.Net;

public class DeleteDialogResponse
{
    public HttpStatusCode StatusCode { get; set; }
    public String? ResponseHeader { get; set; }
    public String? ResponseBody { get; set; }
    public String? RequestBody { get; set; }
}
