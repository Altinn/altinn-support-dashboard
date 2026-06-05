using System.Text.Json;
using altinn_support_dashboard.Server.Controllers;
using altinn_support_dashboard.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Models.altinn3Dtos;
using Moq;

namespace AltinnSupportDashboard.Tests.Controllers;

public class ResourceRegistryControllerTests
{
    private readonly Mock<IResourceRegistryService> _mockService;
    private readonly ResourceRegistryController _controller;

    public ResourceRegistryControllerTests()
    {
        _mockService = new Mock<IResourceRegistryService>();
        _controller = new ResourceRegistryController(_mockService.Object);
    }

    [Fact]
    public async Task GetResourceList_ReturnsOk_WithList()
    {
        // Arrange
        var expected = new List<ResourceDetailsDto>
        {
            new ResourceDetailsDto { Identifier = "app1", Title = new ResourceTitle { NB = "Skattemelding" } },
        };
        _mockService.Setup(s => s.GetResourceList(It.IsAny<string>())).ReturnsAsync(expected);

        // Act
        var result = await _controller.GetResourceList("TT02");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expected, okResult.Value);
    }

    [Fact]
    public async Task GetResourceList_DelegatesToService()
    {
        // Arrange
        _mockService.Setup(s => s.GetResourceList(It.IsAny<string>())).ReturnsAsync(new List<ResourceDetailsDto>());

        // Act
        await _controller.GetResourceList("TT02");

        // Assert
        _mockService.Verify(s => s.GetResourceList("TT02"), Times.Once);
    }

    [Fact]
    public async Task SearchResources_ReturnsOk_WithFilteredList()
    {
        // Arrange
        var expected = new List<ResourceSearchResult>
        {
            new ResourceSearchResult { Identifier = "app1", Title = new Dictionary<string, string> { { "nb", "Skattemelding" } }, ResourceType = "AltinnApp" },
            new ResourceSearchResult { Identifier = "app4", Title = new Dictionary<string, string> { { "nb", "Inntektsskatt" } }, ResourceType = "AltinnApp" }
        };
        _mockService.Setup(s => s.SearchResources(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(expected);

        // Act
        var result = await _controller.SearchResources("TT02", "skatt");

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expected, okResult.Value);
    }

    [Fact]
    public async Task SearchResources_DelegatesToService()
    {
        // Arrange
        _mockService.Setup(s => s.SearchResources(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(new List<ResourceSearchResult>());

        // Act
        await _controller.SearchResources("TT02", "skatt");

        // Assert
        _mockService.Verify(s => s.SearchResources("TT02", "skatt"), Times.Once);
    }

    [Fact]
    public async Task GetResourceByIdentifier_ReturnsOk_WithJsonElement()
    {
        // Arrange
        var json = """{"identifier":"app1","title":{"nb":"Skattemelding"}}""";
        _mockService.Setup(s => s.GetResourceByIdentifier("TT02", "app1")).ReturnsAsync(json);

        // Act
        var result = await _controller.GetResourceByIdentifier("TT02", "app1");

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.IsType<JsonElement>(ok.Value);
    }

    [Fact]
    public async Task GetResourceByIdentifier_DelegatesToService()
    {
        // Arrange
        _mockService.Setup(s => s.GetResourceByIdentifier(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("{}");

        // Act
        await _controller.GetResourceByIdentifier("TT02", "app1");

        // Assert
        _mockService.Verify(s => s.GetResourceByIdentifier("TT02", "app1"), Times.Once);
    }

    [Fact]
    public async Task GetResourcePolicyRules_ReturnsOk_WithJsonElement()
    {
        // Arrange
        var json = """[{"rule":"test"}]""";
        _mockService.Setup(s => s.GetResourcePolicyRules("TT02", "app1")).ReturnsAsync(json);

        // Act
        var result = await _controller.GetResourcePolicyRules("TT02", "app1");

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.IsType<JsonElement>(ok.Value);
    }

    [Fact]
    public async Task GetResourcePolicyRules_DelegatesToService()
    {
        // Arrange
        _mockService.Setup(s => s.GetResourcePolicyRules(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("[]");

        // Act
        await _controller.GetResourcePolicyRules("TT02", "app1");

        // Assert
        _mockService.Verify(s => s.GetResourcePolicyRules("TT02", "app1"), Times.Once);
    }

    [Fact]
    public async Task GetResourcePolicyRights_ReturnsOk_WithJsonElement()
    {
        // Arrange
        var json = """[{"right":"test"}]""";
        _mockService.Setup(s => s.GetResourcePolicyRights("TT02", "app1")).ReturnsAsync(json);

        // Act
        var result = await _controller.GetResourcePolicyRights("TT02", "app1");

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.IsType<JsonElement>(ok.Value);
    }

    [Fact]
    public async Task GetResourcePolicyRights_DelegatesToService()
    {
        // Arrange
        _mockService.Setup(s => s.GetResourcePolicyRights(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("[]");

        // Act
        await _controller.GetResourcePolicyRights("TT02", "app1");

        // Assert
        _mockService.Verify(s => s.GetResourcePolicyRights("TT02", "app1"), Times.Once);
    }

    [Fact]
    public async Task GetResourceByIdentifier_ReturnsNotFound_WhenServiceReturnsNull()
    {
        // Arrange
        _mockService.Setup(s => s.GetResourceByIdentifier(It.IsAny<string>(), It.IsAny<string>())).Returns(Task.FromResult<string>(null!));

        // Act
        var result = await _controller.GetResourceByIdentifier("TT02", "nonexistent");

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetResourcePolicyRules_ReturnsNotFound_WhenServiceReturnsNull()
    {
        // Arrange
        _mockService.Setup(s => s.GetResourcePolicyRules(It.IsAny<string>(), It.IsAny<string>())).Returns(Task.FromResult<string>(null!));

        // Act
        var result = await _controller.GetResourcePolicyRules("TT02", "nonexistent");

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetResourcePolicyRights_ReturnsNotFound_WhenServiceReturnsNull()
    {
        // Arrange
        _mockService.Setup(s => s.GetResourcePolicyRights(It.IsAny<string>(), It.IsAny<string>())).Returns(Task.FromResult<string>(null!));

        // Act
        var result = await _controller.GetResourcePolicyRights("TT02", "nonexistent");

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}