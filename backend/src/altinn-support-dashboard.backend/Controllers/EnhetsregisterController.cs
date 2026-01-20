using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace altinn_support_dashboard.Server.Controllers
{

    [Authorize(AnsattportenConstants.AnsattportenAuthorizationPolicy)]
    [ApiController]
    [Route("api/{environmentName}/brreg/enhet/{orgNumber}")]
    public class EnhetsregisterController : ControllerBase
    {
        private readonly IDataBrregService _dataBrregService;

        public EnhetsregisterController(IDataBrregService dataBrregService)
        {
            _dataBrregService = dataBrregService;
        }

        /// <summary>
        /// Henter detaljert organisasjonsinformasjon fra Br\u00f8nn\u00f8ysundregistrene
        /// </summary>
        /// <param name="environmentName">Milj\u00f8et \u00e5 hente data fra (Production eller TT02)</param>
        /// <param name="orgNumber">Organisasjonsnummeret til enheten</param>
        /// <returns>Detaljert informasjon om organisasjonen</returns>
        [HttpGet]
        public async Task<IActionResult> GetEnhetsdetaljer(string environmentName, string orgNumber)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || !ValidationService.IsValidOrgNumber(orgNumber))
            {
                return BadRequest("Organisasjonsnummeret er ugyldig. Det m\u00e5 v\u00e6re 9 sifre langt.");
            }

            var validEnvironments = new List<string> { "Production", "TT02" };
            if (!validEnvironments.Contains(environmentName))
            {
                return BadRequest("Ugyldig milj\u00f8navn. Gyldige verdier er: Production, TT02");
            }

            try
            {
                var result = await _dataBrregService.GetEnhetsdetaljer(orgNumber, environmentName);
                if (result == null)
                {
                    return NotFound("Ingen data funnet for dette organisasjonsnummeret");
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
                    return NotFound("Ingen data funnet for dette organisasjonsnummeret");
                }
                return StatusCode(503, $"Feil ved kommunikasjon med Br\u00f8nn\u00f8ysundregistrene: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"En feil oppstod: {ex.Message}");
            }
        }
    }
}
