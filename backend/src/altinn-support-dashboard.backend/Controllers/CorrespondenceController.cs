using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;


namespace AltinnSupportDashboard.Controllers;

[ApiController]
[Route("api/correspondence")]
[Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
public class CorrespondenceController : ControllerBase
{
    private readonly ICorrespondenceService _service;

    public CorrespondenceController(ICorrespondenceService service)
    {
        _service = service;
    }

    [HttpPost]
    [Route("upload")]
    public async Task<IActionResult> PostCorrespondenceUpload([FromBody] CorrespondenceUploadRequest request)
    {

        var response = await _service.UploadCorrespondence(request);

        return Ok(response);


    }


}
