using System.Text.Json;
using altinn_support_dashboard.Server.Clients;
using altinn_support_dashboard.Server.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using Models.altinn3Dtos;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Services;

public class ResourceRegistryServiceTest
{
    private readonly Mock<IResourceRegistryClient> _mockClient;
    private readonly Mock<IMemoryCache> _mockCache;
    private readonly ResourceRegistryService _service;

    private const string ResourceListJson = """
        [
            {"identifier": "app1", "title": {"nb": "Skattemelding"}, "resourceType": "AltinnApp", "hasCompetentAuthority": {"name": {"nb": "Skatteetaten"}}},
            {"identifier": "app2", "title": {"nb": "Noe annet"}, "resourceType": "MaskinportenSchema", "hasCompetentAuthority": {"name": {"nb": "Skatteetaten"}}},
            {"identifier": "app3", "title": {"nb": "Skatteoppgjør"}, "resourceType": "AltinnApp", "hasCompetentAuthority": {"name": {"nb": "Testdepartementet"}}},
            {"identifier": "app4", "title": {"nb": "Inntektsskatt"}, "resourceType": "AltinnApp", "hasCompetentAuthority": {"name": {"nb": "Skatteetaten"}}}
        ]
        """;
    private const string ResourceDetailListJson = """
        [
            {"identifier": "app1", "title": {"nb": "Skattemelding", "nn" : null, "en": null}},
            {"identifier": "app2", "title": {"nb": "Årsregnskap", "nn" : null, "en": null}}
        ]
        """;

    public ResourceRegistryServiceTest()
    {
        _mockClient = new Mock<IResourceRegistryClient>();
        _mockCache = new Mock<IMemoryCache>();
        _service = new ResourceRegistryService(_mockClient.Object, _mockCache.Object);
    }

    private void SetupCacheMiss()
    {
        object? value = null;
        _mockCache.Setup(x => x.TryGetValue(It.IsAny<object>(), out value)).Returns(false);

        var mockEntry = new Mock<ICacheEntry>();
        mockEntry.SetupGet(x => x.ExpirationTokens).Returns(new List<IChangeToken>());
        mockEntry.SetupGet(x => x.PostEvictionCallbacks).Returns(new List<PostEvictionCallbackRegistration>());
        mockEntry.SetupProperty(x => x.AbsoluteExpirationRelativeToNow);
        mockEntry.SetupProperty(x => x.Value);
        _mockCache.Setup(x => x.CreateEntry(It.IsAny<object>())).Returns(mockEntry.Object);
    }

    [Fact]
    public async Task SearchResources_ReturnsOnlyAltinnAppResources()
    {
        // Arrange
        SetupCacheMiss();
        _mockClient.Setup(x => x.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        // Act
        var results = await _service.SearchResources("TT02", "skatt");

        // Assert
        Assert.All(results, r => Assert.Equal("AltinnApp", r.ResourceType));
    }

    [Fact]
    public async Task SearchResources_ExcludesTestDepartementet()
    {
        // Arrange
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        //Act
        var results = await _service.SearchResources("TT02", "skatt");

        //Assert
        Assert.DoesNotContain(results, r =>
            r.CompetentAuthority?.Name?.Values.Any(v => v == "Testdepartementet") == true);
    }

    [Fact]
    public async Task SearchResources_FiltersByTitleCaseInsensitive()
    {
        // Arrange
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        // Act
        var results = await _service.SearchResources("TT02", "SKATT");

        // Assert
        Assert.All(results, r =>
            Assert.True(r.Title?.Values.Any(v => v.Contains("skatt", StringComparison.OrdinalIgnoreCase))));
    }

    [Fact]
    public async Task SearchResources_ReturnsEmpty_WhenNoTitleMatches()
    {
        // Arrange
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        // Act
        var results = await _service.SearchResources("TT02", "ingen treff");

        //Assert
        Assert.Empty(results);
    }

    [Fact]
    public async Task SearchResources_DelegatesToClient()
    {
        // Arrange
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        // Act
        await _service.SearchResources("TT02", "skatt");

        // Assert
        _mockClient.Verify(c => c.GetResourceList("TT02"), Times.Once);
    }

    [Fact]
    public async Task SearchResources_ThrowsException_WhenClientThrows()
    {
        // Arrange
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ThrowsAsync(new Exception("API error"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _service.SearchResources("TT02", "skatt"));
    }

    [Fact]
    public async Task GetResourceByIdentifier_ReturnsClientResponse()
    {
        // Arrange
        var expected = """{"identifier":"app1","title":{"nb":"Skattemelding"}}""";
        _mockClient.Setup(c => c.GetResourceByIdentifier(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(expected);

        // Act
        var result = await _service.GetResourceByIdentifier("TT02", "app1");

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public async Task GetResourceByIdentifier_DelegatesToClient()
    {
        // Arrange
        _mockClient.Setup(c => c.GetResourceByIdentifier(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("{}");

        // Act
        await _service.GetResourceByIdentifier("TT02", "app1");

        // Assert
        _mockClient.Verify(c => c.GetResourceByIdentifier("TT02", "app1"), Times.Once);
    }

    [Fact]
    public async Task GetResourcePolicyRules_ReturnsClientResponse()
    {
        // Arrange
        var expected = """[{"rule":"test"}]""";
        _mockClient.Setup(c => c.GetResourcePolicyRules(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(expected);

        // Act
        var result = await _service.GetResourcePolicyRules("TT02", "app1");

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public async Task GetResourcePolicyRules_DelegatesToClient()
    {
        // Arrange
        _mockClient.Setup(c => c.GetResourcePolicyRules(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("[]");

        // Act
        await _service.GetResourcePolicyRules("TT02", "app1");

        // Assert
        _mockClient.Verify(c => c.GetResourcePolicyRules("TT02", "app1"), Times.Once);
    }

    [Fact]
    public async Task GetResourcePolicyRights_ReturnsClientResponse()
    {
        // Arrange
        var expected = """[{"action":"read"}]""";
        _mockClient.Setup(c => c.GetResourcePolicyRights(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(expected);

        // Act
        var result = await _service.GetResourcePolicyRights("TT02", "app1");

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public async Task GetResourcePolicyRights_DelegatesToClient()
    {
        // Arrange
        _mockClient.Setup(c => c.GetResourcePolicyRights(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("[]");

        // Act
        await _service.GetResourcePolicyRights("TT02", "app1");

        // Assert
        _mockClient.Verify(c => c.GetResourcePolicyRights("TT02", "app1"), Times.Once);
    }

    [Fact]
    public async Task GetResourceList_CallsClient_WhenCacheMiss()
    {
        // Arrange
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceDetailListJson);

        // Act
        await _service.GetResourceList("TT02");

        // Assert
        _mockClient.Verify(c => c.GetResourceList("TT02"), Times.Once);
    }

    [Fact]
    public async Task GetResourceList_ReturnsDeserializedList_WhenCacheMiss()
    {
        // Arrange
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceDetailListJson);

        // Act
        var result = await _service.GetResourceList("TT02");

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("app1", result[0].Identifier);
    }

    [Fact]
    public async Task GetResourceList_DoesNotCallClient_WhenCacheHit()
    {
        // Arrange
        object? cachedValue = ResourceDetailListJson;
        _mockCache.Setup(x => x.TryGetValue(It.IsAny<object>(), out cachedValue)).Returns(true);

        // Act
        await _service.GetResourceList("TT02");

        // Assert
        _mockClient.Verify(c => c.GetResourceList(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task GetResourceList_ThrowsJsonException_WhenInvalidJson()
    {
        // Arrange
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync("invalid json");

        // Act & Assert
        await Assert.ThrowsAsync<JsonException>(() => _service.GetResourceList("TT02"));
    }
}