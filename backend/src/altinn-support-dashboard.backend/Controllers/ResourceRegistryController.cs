using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;



[Authorize(AzureRoles.Authenticated)]
[ApiController]
[Route("api/{environmentName}/resource")]
public class ResourceRegistryController : ControllerBase
{
    private readonly IResourceRegistryService _resourceRegistryService;

    public ResourceRegistryController(IResourceRegistryService resourceRegistryService)
    {
        _resourceRegistryService = resourceRegistryService;
    }
    
    [HttpGet("resourcelist")]
    public async Task<IActionResult> GetResourceList(string environmentName)
    {
        var result = await _resourceRegistryService.GetResourceList(environmentName);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchResources(string environmentName, [FromQuery] string query)
    {
        var result = await _resourceRegistryService.SearchResources(environmentName, query);
        return Ok(result);
    }
}