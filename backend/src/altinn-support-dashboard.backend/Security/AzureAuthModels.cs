using System.Text.Json.Serialization;

namespace Security;

// Maps the X-MS-CLIENT-PRINCIPAL header injected by Azure App Service Easy Auth
public record AppServicePrincipal(
    [property: JsonPropertyName("claims")] List<AppServiceClaim> Claims,
    [property: JsonPropertyName("name_typ")] string NameTyp,
    [property: JsonPropertyName("role_typ")] string RoleTyp
);

public record AppServiceClaim(
    [property: JsonPropertyName("typ")] string Typ,
    [property: JsonPropertyName("val")] string Val
);
