using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Security;


[Authorize(AzureRoles.Authenticated)]
[ApiController]
[Route("api/{environmentName}/brreg/{orgNumber}")]
public class ER_Roller_APIController : ControllerBase
{
    private readonly IDataBrregService _dataBrregService;
    private readonly ILogger<ER_Roller_APIController> _logger;

    public ER_Roller_APIController(IDataBrregService dataBrregService, ILogger<ER_Roller_APIController> logger)
    {
        _dataBrregService = dataBrregService;
        _logger = logger;
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
            if (result == null || (result.Rollegrupper?.Count == 0 && result.ApiRoller?.Count == 0))
            {
                return NotFound("Ingen data funnet");
            }
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid request for roles. OrgNumber: {OrgNumber}, Environment: {EnvironmentName}", orgNumber, environmentName);
            return BadRequest(ex.Message);
        }
        catch (HttpRequestException ex)
        {
            if (ex.Message.Contains("NotFound"))
            {
                _logger.LogInformation("No roles found for organization {OrgNumber} in environment {EnvironmentName}", orgNumber, environmentName);
                return NotFound("Ingen data funnet");
            }
            _logger.LogError(ex, "Failed to communicate with Brreg while fetching roles for orgNumber: {OrgNumber} in environment: {EnvironmentName}", orgNumber, environmentName);
            return StatusCode(503, ex.Message);
        }
        catch (KeyNotFoundException)
        {
            _logger.LogWarning("Unknown environment name provided for orgNumber: {OrgNumber}. Environment: {EnvironmentName}", orgNumber, environmentName);
            return BadRequest("Ugyldig miljønavn.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred while retrieving roles for orgNumber: {OrgNumber} in environment: {EnvironmentName}", orgNumber, environmentName);
            return StatusCode(500, $"Intern serverfeil: {ex.Message}");
        }
    }


    [HttpGet("underenhet")]
    public async Task<IActionResult> GetUnderenhet(string environmentName, string orgNumber)
    {
        if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
        {
            return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
        }

        if (!IsValidEnvironment(environmentName))
        {
            return BadRequest("Ugyldig miljønavn.");
        }

        var result = await _dataBrregService.GetUnderenhet(orgNumber, environmentName);

        return Ok(result);

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
            _logger.LogWarning(ex, "Invalid request for roles. OrgNumber: {OrgNumber}, Environment: {EnvironmentName}", orgNumber, environmentName);
            return BadRequest(ex.Message);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Failed to communicate with Brreg while fetching roles for orgNumber: {OrgNumber} in environment: {EnvironmentName}", orgNumber, environmentName);
            return StatusCode(503, ex.Message);
        }
        catch (KeyNotFoundException)
        {
            _logger.LogWarning("Unknown environment name provided for orgNumber: {OrgNumber}. Environment: {EnvironmentName}", orgNumber, environmentName);
            return BadRequest("Ugyldig miljønavn.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred while retrieving roles for orgNumber: {OrgNumber} in environment: {EnvironmentName}", orgNumber, environmentName);
            return StatusCode(500, $"Intern serverfeil: {ex.Message}");
        }
    }

    private bool IsValidEnvironment(string environmentName)
    {
        return environmentName == "TT02" || environmentName == "Production" || MockUtils.IsMock(environmentName);
    }
}
