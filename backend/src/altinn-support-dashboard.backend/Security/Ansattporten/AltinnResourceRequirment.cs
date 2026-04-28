using Microsoft.AspNetCore.Authorization;

public class AltinnResourceRequirement : IAuthorizationRequirement
{
    public string resource { get; }

    public AltinnResourceRequirement(string resource)
    {
        this.resource = resource;
    }



}
