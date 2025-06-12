using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace altinn_support_dashboard.Server.Models.Gitea
{
    /// <summary>
    /// Enum for tilgangsnivåer i Gitea
    /// </summary>
    public enum Permission
    {
        /// <summary>
        /// Lesetilgang
        /// </summary>
        Read,
        
        /// <summary>
        /// Skrivetilgang
        /// </summary>
        Write,
        
        /// <summary>
        /// Administratortilgang
        /// </summary>
        Admin,
        
        /// <summary>
        /// Ingen tilgang
        /// </summary>
        None
    }
    
    /// <summary>
    /// Representerer en Gitea-bruker
    /// </summary>
    public class GiteaUser
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("username")]
        public required string Username { get; set; }

        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("full_name")]
        public required string FullName { get; set; }
    }

    /// <summary>
    /// Representerer en Gitea-organisasjon
    /// </summary>
    public class GiteaOrganization
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("username")]
        public required string Username { get; set; }

        [JsonPropertyName("full_name")]
        public required string FullName { get; set; }

        [JsonPropertyName("website")]
        public required string Website { get; set; }

        [JsonPropertyName("visibility")]
        public required string Visibility { get; set; }
    }

    /// <summary>
    /// Modell for å opprette en ny organisasjon
    /// </summary>
    public class GiteaOrganizationCreate
    {
        [JsonPropertyName("username")]
        public required string Username { get; set; }

        [JsonPropertyName("full_name")]
        public required string FullName { get; set; }

        [JsonPropertyName("website")]
        public required string Website { get; set; }

        [JsonPropertyName("visibility")]
        public required string Visibility { get; set; } = "public";

        [JsonPropertyName("repo_admin_change_team_access")]
        public bool RepoAdminChangeTeamAccess { get; set; } = false;
    }

    /// <summary>
    /// Modell for respons på validering av PAT
    /// </summary>
    public class PatValidationResult
    {
        public bool IsValid { get; set; }
        public required string Message { get; set; } = string.Empty;
    }

    /// <summary>
    /// Representerer et Gitea-team
    /// </summary>
    public class GiteaTeam
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public required string Name { get; set; }

        [JsonPropertyName("description")]
        public required string Description { get; set; }

        [JsonPropertyName("permission")]
        public required string Permission { get; set; }
    }

    /// <summary>
    /// Modell for å opprette et nytt team
    /// </summary>
    public class GiteaTeamCreate
    {
        [JsonPropertyName("name")]
        public required string Name { get; set; }

        [JsonPropertyName("description")]
        public required string Description { get; set; }

        [JsonPropertyName("permission")]
        public required string Permission { get; set; }

        [JsonPropertyName("includes_all_repositories")]
        public bool IncludesAllRepositories { get; set; }
    }

    /// <summary>
    /// Representerer et Gitea-repository
    /// </summary>
    public class GiteaRepository
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public required string Name { get; set; }

        [JsonPropertyName("owner")]
        public required GiteaUser Owner { get; set; }

        [JsonPropertyName("full_name")]
        public required string FullName { get; set; }

        [JsonPropertyName("clone_url")]
        public required string CloneUrl { get; set; }
    }

    /// <summary>
    /// Modell for å opprette et nytt repository
    /// </summary>
    public class GiteaRepositoryCreate
    {
        [JsonPropertyName("name")]
        public required string Name { get; set; }

        [JsonPropertyName("auto_init")]
        public bool AutoInit { get; set; } = true;

        [JsonPropertyName("default_branch")]
        public string DefaultBranch { get; set; } = "main";

        [JsonPropertyName("private")]
        public bool Private { get; set; } = false;

        [JsonPropertyName("trust_model")]
        public string TrustModel { get; set; } = "default";
    }
    
    /// <summary>
    /// Modell for overføring av repository til ny eier
    /// </summary>
    public class GiteaRepositoryTransfer
    {
        [JsonPropertyName("new_owner")]
        public required string NewOwner { get; set; }
        
        [JsonPropertyName("team_ids")]
        public List<int>? TeamIds { get; set; } = new List<int>();
    }

    /// <summary>
    /// Modell for opprettelse av ny organisasjon med teams og repository
    /// </summary>
    public class OrganizationCreationRequest
    {
        public required string ShortName { get; set; }
        public required string FullName { get; set; }
        public string WebsiteUrl { get; set; } = string.Empty;
        public string EmailDomain { get; set; } = string.Empty;
        public string OrgNumber { get; set; } = string.Empty;
        public List<string> Owners { get; set; } = new List<string>();
        public string LogoFile { get; set; } = string.Empty;
    }

    /// <summary>
    /// Modell for resultat av organisasjonsopprettelse
    /// </summary>
    public class OrganizationCreationResult
    {
        public bool Success { get; set; }
        public required string Message { get; set; } = string.Empty;
        public GiteaOrganization? Organization { get; set; }
        public List<GiteaTeam> Teams { get; set; } = new List<GiteaTeam>();
        public GiteaRepository? DefaultRepository { get; set; }
    }
}
