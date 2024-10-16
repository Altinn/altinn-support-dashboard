﻿using Microsoft.AspNetCore.Mvc;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Validation;

namespace altinn_support_dashboard.Server.Controllers
{
    [ApiController]
    [Route("api/{environmentName}/brreg")]
    public class ER_Roller_APIController : ControllerBase
    {
        private readonly IDataBrregService _dataBrregService;

        public ER_Roller_APIController(IDataBrregService dataBrregService)
        {
            _dataBrregService = dataBrregService;
        }

        // GET: api/{environmentName}/brreg/{orgNumber}
        [HttpGet("{orgNumber}")]
        public async Task<IActionResult> GetRoles([FromRoute] string environmentName, string orgNumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
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
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/{environmentName}/brreg/{orgNumber}/underenheter
        [HttpGet("{orgNumber}/underenheter")]
        public async Task<IActionResult> GetUnderenheter([FromRoute] string environmentName, string orgNumber)
        {
            if (!ValidationService.IsValidOrgNumber(orgNumber))
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
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
