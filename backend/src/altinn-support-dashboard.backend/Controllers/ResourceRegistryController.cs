using System.Text.Json;
using altinn_support_dashboard.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Security;

namespace altinn_support_dashboard.Server.Controllers;

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

    [HttpGet("{identifier}")]
    public async Task<IActionResult> GetResourceByIdentifier(string environmentName, string identifier)
    {
        var result = await _resourceRegistryService.GetResourceByIdentifier(environmentName, identifier);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(JsonSerializer.Deserialize<JsonElement>(result));
    }

    [HttpGet("{identifier}/policy/rules")]
    public async Task<IActionResult> GetResourcePolicyRules(string environmentName, string identifier)
    {
        var result = await _resourceRegistryService.GetResourcePolicyRules(environmentName, identifier);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(JsonSerializer.Deserialize<JsonElement>(result));
    }

    [HttpGet("{identifier}/policy/rights")]
    public async Task<IActionResult> GetResourcePolicyRights(string environmentName, string identifier)
    {
        var result = await _resourceRegistryService.GetResourcePolicyRights(environmentName, identifier);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(JsonSerializer.Deserialize<JsonElement>(result));
    }
}