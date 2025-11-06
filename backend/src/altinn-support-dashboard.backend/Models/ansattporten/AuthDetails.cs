// Models/EnvironmentConfiguration.cs


namespace altinn_support_dashboard.Server.Models.ansattporten;


public class AuthDetails
{
    public bool IsLoggedIn { get; set; }

    //Temporary 
    public bool? AnsattportenActive { get; set; }

    public string? Name { get; set; }
}
