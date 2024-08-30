using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Services;

namespace altinn_support_dashboard.Server.Controllers
{
    [ApiController]
    [Route("api/brreg")]
    public class ER_Roller_APIController : ControllerBase
    {
        private readonly IDataBrregService _dataBrregService;

        public ER_Roller_APIController(IDataBrregService dataBrregService)
        {
            _dataBrregService = dataBrregService;
        }

        // GET: databrreg/{orgNumber}
        [HttpGet("{orgNumber}")]
        public async Task<IActionResult> GetRoles(string orgNumber)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || orgNumber.Length != 9 || !long.TryParse(orgNumber, out _))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

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
