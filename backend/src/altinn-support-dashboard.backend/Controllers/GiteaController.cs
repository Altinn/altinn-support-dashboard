using System;
using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models.Gitea;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AltinnSupportDashboard.Controllers
{
    /// <summary>
    /// API-kontroller for integrasjon mot Gitea (Altinn Studio)
    /// </summary>
    [ApiController]
    [Route("api/gitea")]
    public class GiteaController : ControllerBase
    {
        private readonly IGiteaService _giteaService;
        private readonly ILogger<GiteaController> _logger;

        /// <summary>
        /// Initialiserer en ny instans av GiteaController
        /// </summary>
        public GiteaController(IGiteaService giteaService, ILogger<GiteaController> logger)
        {
            _giteaService = giteaService;
            _logger = logger;
        }

        /// <summary>
        /// Validerer en PAT-token for et gitt miljø
        /// </summary>
        /// <param name="environmentName">Miljøet (development/production)</param>
        /// <param name="token">PAT token som skal valideres</param>
        /// <returns>Resultat av valideringen</returns>
        /// <response code="200">Validering utført</response>
        /// <response code="400">Ugyldig forespørsel</response>
        /// <response code="500">Intern serverfeil</response>
        [HttpPost("{environmentName}/validate-token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PatValidationResult>> ValidateToken(
            [FromRoute] string environmentName,
            [FromBody] TokenRequest tokenRequest)
        {
            if (string.IsNullOrEmpty(tokenRequest?.Token))
            {
                return BadRequest(new PatValidationResult
                {
                    IsValid = false,
                    Message = "Token kan ikke være tom"
                });
            }

            if (environmentName != "development" && environmentName != "production")
            {
                return BadRequest(new PatValidationResult
                {
                    IsValid = false,
                    Message = "Miljø må være enten 'development' eller 'production'"
                });
            }

            try
            {
                var result = await _giteaService.ValidateTokenAsync(environmentName, tokenRequest.Token);

                if (result.IsValid)
                {
                    _giteaService.SetToken(environmentName, tokenRequest.Token);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved validering av token for miljø {environmentName}");
                return StatusCode(500, new PatValidationResult
                {
                    IsValid = false,
                    Message = $"Serverfeil: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Sjekker om en organisasjon eksisterer
        /// </summary>
        /// <param name="environmentName">Miljøet (development/production)</param>
        /// <param name="orgName">Organisasjonens kortnavn</param>
        /// <returns>True hvis organisasjonen eksisterer</returns>
        /// <response code="200">Sjekk utført</response>
        /// <response code="400">Ugyldig forespørsel</response>
        /// <response code="500">Intern serverfeil</response>
        [HttpGet("{environmentName}/organizations/{orgName}/exists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<bool>> OrganizationExists(
            [FromRoute] string environmentName,
            [FromRoute] string orgName)
        {
            if (string.IsNullOrEmpty(orgName))
            {
                return BadRequest("Organisasjonsnavn kan ikke være tomt");
            }

            if (environmentName != "development" && environmentName != "production")
            {
                return BadRequest("Miljø må være enten 'development' eller 'production'");
            }

            try
            {
                // Hent token fra Authorization header
                string authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized("Manglende eller ugyldig authorization header");
                }

                // Hent ut tokenet fra Bearer-formatet
                string token = authHeader.Substring("Bearer ".Length).Trim();

                // Sett token på klienten før API-kall
                _giteaService.SetToken(environmentName, token);

                bool exists = await _giteaService.OrganizationExistsAsync(environmentName, orgName);
                return Ok(exists);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved sjekk av organisasjon {orgName} for miljø {environmentName}");
                return StatusCode(500, $"Serverfeil: {ex.Message}");
            }
        }

        /// <summary>
        /// Oppretter en ny organisasjon i Gitea med standardteam og repository
        /// </summary>
        /// <param name="environmentName">Miljøet (development/production)</param>
        /// <param name="request">Forespørsel med organisasjonsdetaljer</param>
        /// <returns>Resultat av organisasjonsopprettingen</returns>
        /// <response code="201">Organisasjon opprettet</response>
        /// <response code="400">Ugyldig forespørsel</response>
        /// <response code="500">Intern serverfeil</response>
        [HttpPost("{environmentName}/organizations")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<OrganizationCreationResult>> CreateOrganization(
            [FromRoute] string environmentName,
            [FromBody] OrganizationCreationRequest request)
        {
            if (request == null)
            {
                return BadRequest("Forespørsel kan ikke være tom");
            }

            if (environmentName != "development" && environmentName != "production")
            {
                return BadRequest("Miljø må være enten 'development' eller 'production'");
            }

            try
            {
                // Hent token fra Authorization header
                string authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(new OrganizationCreationResult
                    {
                        Success = false,
                        Message = "Manglende eller ugyldig authorization header"
                    });
                }

                // Hent ut tokenet fra Bearer-formatet
                string token = authHeader.Substring("Bearer ".Length).Trim();

                // Sett token på klienten før API-kall
                _giteaService.SetToken(environmentName, token);

                var result = await _giteaService.CreateOrganizationAsync(environmentName, request);

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                // Returner 201 Created med resultatet
                return Created($"api/gitea/{environmentName}/organizations/{request.ShortName}", result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Feil ved opprettelse av organisasjon for miljø {environmentName}");
                return StatusCode(500, new OrganizationCreationResult
                {
                    Success = false,
                    Message = $"Serverfeil: {ex.Message}"
                });
            }
        }
    }

    /// <summary>
    /// Forespørsel om tokenvalidering
    /// </summary>
    public class TokenRequest
    {
        /// <summary>
        /// PAT-token som skal valideres
        /// </summary>
        public required string Token { get; set; }
    }
}
