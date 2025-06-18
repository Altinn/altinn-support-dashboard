using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

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
        catch (Exception)
        {
                return StatusCode(500, "Intern serverfeil");
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
    
    /// <summary>
    /// Gets organization name from BRREG by organization number
    /// </summary>
    /// <param name="orgNumber">9-digit organization number</param>
    /// <returns>Organization name</returns>
    [Route("/api/brreg/organization/{orgNumber}")]
    [HttpGet]
    public async Task<IActionResult> GetOrgName(string orgNumber)
    {
        if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
        {
            return BadRequest("Organisasjonsnummeret er ugyldig. Det må være 9 sifre langt.");
        }

        try
        {
            // Use our service that now has a direct implementation
            var orgInfo = await _dataBrregService.GetOrgInfoAsync(orgNumber, "Production");
            
            if (orgInfo == null)
            {
                return NotFound($"Ingen organisasjon funnet med organisasjonsnummer {orgNumber}");
            }
            
            return Ok(new { name = orgInfo.Name });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (HttpRequestException ex)
        {
            if (ex.Message.Contains("NotFound"))
            {
                return NotFound($"Ingen organisasjon funnet med organisasjonsnummer {orgNumber}");
            }
            return StatusCode(503, $"Kunne ikke koble til BRREG API: {ex.Message}");
        }
        catch (Exception ex)
        {
            // Include basic error info but not the full stack trace in production
            return StatusCode(500, $"Intern serverfeil: {ex.Message.Split('|')[0]}");
        }
    }
}
