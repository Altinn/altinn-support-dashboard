using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using System.Threading.Tasks;
using System.Net.Http;

namespace altinn_support_dashboard.Server.Controllers
{
    [Authorize] // Securing the entire controller
    [ApiController]
    [Route("api/brreg")]
    public class ER_Roller_APIController : ControllerBase
    {
        private readonly IDataBrregService _dataBrregService;

        public ER_Roller_APIController(IDataBrregService dataBrregService)
        {
            _dataBrregService = dataBrregService;
        }

        [HttpGet("{environmentName}/{orgNumber}")]
        public async Task<IActionResult> GetRoles(string environmentName, string orgNumber)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            try
            {
                var result = await _dataBrregService.GetRolesAsync(orgNumber, environmentName);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(503, ex.Message);
            }
            catch (KeyNotFoundException)
            {
                return BadRequest("Ugyldig miljønavn.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Intern serverfeil");
            }
        }

        [HttpGet("{environmentName}/{orgNumber}/underenheter")]
        public async Task<IActionResult> GetUnderenheter(string environmentName, string orgNumber)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
            }

            try
            {
                var result = await _dataBrregService.GetUnderenheter(orgNumber, environmentName);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(503, ex.Message);
            }
            catch (KeyNotFoundException)
            {
                return BadRequest("Ugyldig miljønavn.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Intern serverfeil");
            }
        }
    }
}
