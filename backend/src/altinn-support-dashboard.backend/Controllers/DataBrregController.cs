using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Services;

namespace altinn_support_dashboard.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataBrregController : ControllerBase
    {
        private readonly IDataBrregService _dataBrregService;

        public DataBrregController(IDataBrregService dataBrregService)
        {
            _dataBrregService = dataBrregService;
        }

        // GET: databrreg/{orgNumber}
        [HttpGet("{orgNumber}")]
        public async Task<IActionResult> GetRoles(string orgNumber)
        {
            try
            {
                var result = await _dataBrregService.GetRolesAsync(orgNumber);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(503, ex.Message); // Service Unavailable
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
