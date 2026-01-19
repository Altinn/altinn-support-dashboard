
using System.Net;

public class CorrespondenceResponse
{

    public HttpStatusCode StatusCode { get; set; }
    public String? ResponseHeader { get; set; }
    public String? ResponseBody { get; set; }
    public String? RequestHeader { get; set; }
    public String?RequestBody { get; set; }
}
