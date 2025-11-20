
namespace Security;

public class AnsattportenConstants
{
    public const string AnsattportenAuthenticationScheme = "AnsattportenAuthScheme";
    public const string AnsattportenAuthorizationPolicy = "AnsattportenAuthenticated";
    public const string AnsattportenCookiesAuthenticationScheme = "AnsattportenCookies";
    public const string AnsattportenClaimType = "ansattporten:altinn:resource";


    //these constants give authentication for different parts of the dashboard
    public const string AnsattportenTT02AuthorizationPolicy = "TT02Authenticated";
    public const string AnsattportenProductionAuthorizationPolicy = "ProductionAuthenticated";

    public static List<string> GetPolicies()
    {
        List<string> policies = new List<string>();

        policies.Add(AnsattportenAuthorizationPolicy);
        policies.Add(AnsattportenTT02AuthorizationPolicy);
        policies.Add(AnsattportenProductionAuthorizationPolicy);

        return policies;
    }

}

