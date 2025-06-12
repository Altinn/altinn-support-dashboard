using System.Threading.Tasks;
using altinn_support_dashboard.Server.Models.Gitea;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    /// <summary>
    /// Grensesnitt for Gitea-tjenester
    /// </summary>
    public interface IGiteaService
    {
        /// <summary>
        /// Validerer en PAT-token for et gitt miljø
        /// </summary>
        /// <param name="environmentName">Miljønavnet</param>
        /// <param name="token">PAT-token som skal valideres</param>
        /// <returns>Resultat av valideringen</returns>
        Task<PatValidationResult> ValidateTokenAsync(string environmentName, string token);

        /// <summary>
        /// Setter aktiv PAT-token for et miljø
        /// </summary>
        /// <param name="environmentName">Miljønavnet</param>
        /// <param name="token">PAT-token som skal brukes</param>
        void SetToken(string environmentName, string token);

        /// <summary>
        /// Sjekker om en organisasjon eksisterer
        /// </summary>
        /// <param name="environmentName">Miljønavnet</param>
        /// <param name="orgName">Organisasjonens kortnavn</param>
        /// <returns>True hvis organisasjonen eksisterer</returns>
        Task<bool> OrganizationExistsAsync(string environmentName, string orgName);

        /// <summary>
        /// Oppretter en ny organisasjon med standardteam og repository
        /// </summary>
        /// <param name="environmentName">Miljønavnet</param>
        /// <param name="request">Forespørsel om organisasjonsoppretting</param>
        /// <returns>Resultat av organisasjonsopprettingen</returns>
        Task<OrganizationCreationResult> CreateOrganizationAsync(string environmentName, OrganizationCreationRequest request);
    }
}
