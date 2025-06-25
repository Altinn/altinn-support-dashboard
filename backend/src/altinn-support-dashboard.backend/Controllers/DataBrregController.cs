using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/{environmentName}/brreg/{orgNumber}")]
public class ER_Roller_APIController : ControllerBase
{
    private readonly IDataBrregService _dataBrregService;

    public ER_Roller_APIController(IDataBrregService dataBrregService)
    {
        _dataBrregService = dataBrregService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoles(string environmentName, string orgNumber)
    {
        if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
        {
            return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
        }

        if (!IsValidEnvironment(environmentName))
        {
            return BadRequest("Ugyldig miljønavn.");
        }

        try
        {
            var result = await _dataBrregService.GetRolesAsync(orgNumber, environmentName);
            if (result == null)
            {
                return NotFound("Ingen data funnet");
            }
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (HttpRequestException ex)
        {
            if (ex.Message.Contains("NotFound"))
            {
                return NotFound("Ingen data funnet");
            }
            return StatusCode(503, ex.Message);
        }
        catch (KeyNotFoundException)
        {
            return BadRequest("Ugyldig miljønavn.");
        }
        catch (Exception ex)
        {
                return StatusCode(500, "Intern serverfeil");
            return StatusCode(500, $"Intern serverfeil: {ex.Message}");
        }
    }

    [HttpGet("underenheter")]
    public async Task<IActionResult> GetUnderenheter(string environmentName, string orgNumber)
    {
        if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
        {
            return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
        }

        if (!IsValidEnvironment(environmentName))
        {
            return BadRequest("Ugyldig miljønavn.");
        }

        try
        {
            var result = await _dataBrregService.GetUnderenheter(orgNumber, environmentName);
            if (result == null || (result is System.Collections.ICollection collection && collection.Count == 0))
            {
                return NotFound("Ingen data funnet");
            }
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
        catch (Exception ex)
        {
            return StatusCode(500, $"Intern serverfeil: {ex.Message}");
        }
    }

    private bool IsValidEnvironment(string environmentName)
    {
        return environmentName == "TT02" || environmentName == "Production";
    }
}
