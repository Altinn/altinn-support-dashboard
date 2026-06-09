using System.Text.Json;
using altinn_support_dashboard.Server.Clients;
using altinn_support_dashboard.Server.Models;
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
        SetupCacheMiss();
        _mockClient.Setup(x => x.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        var results = await _service.SearchResources("TT02", "skatt");

        Assert.All(results, r => Assert.Equal("AltinnApp", r.ResourceType));
    }

    [Fact]
    public async Task SearchResources_FiltersByTitleCaseInsensitive()
    {
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        var results = await _service.SearchResources("TT02", "SKATT");

        Assert.All(results, r =>
            Assert.True(r.Title?.Values.Any(v => v.Contains("skatt", StringComparison.OrdinalIgnoreCase))));
    }

    [Fact]
    public async Task SearchResources_ReturnsEmpty_WhenNoTitleMatches()
    {
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        var results = await _service.SearchResources("TT02", "ingen treff");

        Assert.Empty(results);
    }

    [Fact]
    public async Task SearchResources_DelegatesToClient()
    {
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceListJson);

        await _service.SearchResources("TT02", "skatt");

        _mockClient.Verify(c => c.GetResourceList("TT02"), Times.Once);
    }

    [Fact]
    public async Task SearchResources_ThrowsException_WhenClientThrows()
    {
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ThrowsAsync(new Exception("API error"));

        await Assert.ThrowsAsync<Exception>(() => _service.SearchResources("TT02", "skatt"));
    }

    [Fact]
    public async Task GetResourceByIdentifier_ReturnsDeserializedResource()
    {
        var json = """{"identifier":"app1","title":{"nb":"Skattemelding"}}""";
        _mockClient.Setup(c => c.GetResourceByIdentifier(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(json);

        var result = await _service.GetResourceByIdentifier("TT02", "app1");

        Assert.NotNull(result);
        Assert.Equal("app1", result.Identifier);
    }

    [Fact]
    public async Task GetResourceByIdentifier_ReturnsNull_WhenClientReturnsNull()
    {
        _mockClient.Setup(c => c.GetResourceByIdentifier(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync((string)null!);

        var result = await _service.GetResourceByIdentifier("TT02", "app1");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetResourceByIdentifier_DelegatesToClient()
    {
        _mockClient.Setup(c => c.GetResourceByIdentifier(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("{}");

        await _service.GetResourceByIdentifier("TT02", "app1");

        _mockClient.Verify(c => c.GetResourceByIdentifier("TT02", "app1"), Times.Once);
    }

    [Fact]
    public async Task GetResourcePolicyRules_ReturnsDeserializedList()
    {
        var json = """[{"subject":[{"type":"urn:altinn:rolecode","value":"dagl"}],"action":{"type":"urn:oasis:names:tc:xacml:1.0:action:action-id","value":"read"},"resource":[{"type":"urn:altinn:org","value":"brg"}]}]""";
        _mockClient.Setup(c => c.GetResourcePolicyRules(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(json);

        var result = await _service.GetResourcePolicyRules("TT02", "app1");

        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("read", result[0].Action?.Value);
    }

    [Fact]
    public async Task GetResourcePolicyRules_ReturnsNull_WhenClientReturnsNull()
    {
        _mockClient.Setup(c => c.GetResourcePolicyRules(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync((string)null!);

        var result = await _service.GetResourcePolicyRules("TT02", "app1");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetResourcePolicyRules_DelegatesToClient()
    {
        _mockClient.Setup(c => c.GetResourcePolicyRules(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("[]");

        await _service.GetResourcePolicyRules("TT02", "app1");

        _mockClient.Verify(c => c.GetResourcePolicyRules("TT02", "app1"), Times.Once);
    }

    [Fact]
    public async Task GetResourcePolicyRights_ReturnsDeserializedList()
    {
        var json = """[{"action":{"type":"urn:oasis:names:tc:xacml:1.0:action:action-id","value":"read"},"resource":[{"type":"urn:altinn:org","value":"brg"}],"subjects":[{"subjectAttributes":[{"type":"urn:altinn:rolecode","value":"dagl"}]}],"rightKey":"read;app1;brg;abc123","subjectTypes":["urn:altinn:rolecode"]}]""";
        _mockClient.Setup(c => c.GetResourcePolicyRights(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(json);

        var result = await _service.GetResourcePolicyRights("TT02", "app1");

        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("read;app1;brg;abc123", result[0].RightKey);
    }

    [Fact]
    public async Task GetResourcePolicyRights_ReturnsNull_WhenClientReturnsNull()
    {
        _mockClient.Setup(c => c.GetResourcePolicyRights(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync((string)null!);

        var result = await _service.GetResourcePolicyRights("TT02", "app1");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetResourcePolicyRights_DelegatesToClient()
    {
        _mockClient.Setup(c => c.GetResourcePolicyRights(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("[]");

        await _service.GetResourcePolicyRights("TT02", "app1");

        _mockClient.Verify(c => c.GetResourcePolicyRights("TT02", "app1"), Times.Once);
    }

    [Fact]
    public async Task GetResourceList_CallsClient_WhenCacheMiss()
    {
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceDetailListJson);

        await _service.GetResourceList("TT02");

        _mockClient.Verify(c => c.GetResourceList("TT02"), Times.Once);
    }

    [Fact]
    public async Task GetResourceList_ReturnsDeserializedList_WhenCacheMiss()
    {
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync(ResourceDetailListJson);

        var result = await _service.GetResourceList("TT02");

        Assert.Equal(2, result.Count);
        Assert.Equal("app1", result[0].Identifier);
    }

    [Fact]
    public async Task GetResourceList_DoesNotCallClient_WhenCacheHit()
    {
        object? cachedValue = new List<ResourceSearchResult>
        {
            new ResourceSearchResult { Identifier = "app1" }
        };
        _mockCache.Setup(x => x.TryGetValue(It.IsAny<object>(), out cachedValue)).Returns(true);

        await _service.GetResourceList("TT02");

        _mockClient.Verify(c => c.GetResourceList(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task GetResourceList_ThrowsJsonException_WhenInvalidJson()
    {
        SetupCacheMiss();
        _mockClient.Setup(c => c.GetResourceList(It.IsAny<string>())).ReturnsAsync("invalid json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetResourceList("TT02"));
    }
}
