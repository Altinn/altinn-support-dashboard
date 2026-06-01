using altinn_support_dashboard.Server.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
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
        _mockClient.Setup(x => x.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        // Act
        var results = await _service.SearchResources("TT02", "skatt");

        // Assert
        Assert.All(results, r => Assert.Equal("AltinnApp", r.ResourceType));
    }
}