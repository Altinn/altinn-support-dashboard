using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;



[Authorize(AzureRoles.Authenticated)]
[ApiController]
[Route("api/{environmentName}/resource")]
public class ResourceRegistryController : ControllerBase
{
    private readonly IResourceRegistryClient _resourceRegistryClient;

    public ResourceRegistryController(IResourceRegistryClient resourceRegistryClient)
    {
        _resourceRegistryClient = resourceRegistryClient;
    }
    
    [HttpGet("resourcelist")]
    public async Task<IActionResult> GetResourceList(string environmentName)
    {
        var result = await _resourceRegistryClient.GetResourceList(environmentName);
        return Ok(result);
    }
}