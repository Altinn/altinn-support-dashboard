using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Models.dialogporten;
using Moq;
using System.Text.Json;
using Xunit;

namespace altinn_support_dashboard.backend.Tests.Services;

public class DialogportenServiceTests
{
    private readonly Mock<IDialogportenClient> _clientMock;
    private readonly DialogportenService _service;

    private const string Urn = "urn:altinn:dialog-id:11111111-1111-1111-1111-111111111111";
    private const string EnvironmentName = "TT02";

    private const string ValidDialogJson = """
        {
            "dialogId": "d1",
            "instanceRef": "urn:altinn:dialog-id:11111111-1111-1111-1111-111111111111",
            "party": "urn:altinn:organization:identifier-no:123456789",
            "serviceResource": {
                "id": "res-1",
                "isDelegable": true,
                "minimumAuthenticationLevel": 3,
                "name": [
                    { "value": "Test resource", "languageCode": "nb" }
                ]
            },
            "serviceOwner": {
                "orgNumber": "123456789",
                "code": "ttd",
                "name": [
                    { "value": "Test owner", "languageCode": "nb" }
                ]
            },
            "title": [
                { "value": "Sensitive title", "languageCode": "nb" }
            ]
        }
        """;
        private const string DialogId = "11111111-1111-1111-1111-111111111111";
        private const string DetailsJson = """{"dialogId":"d1", "raw":"payload"}""";
    public DialogportenServiceTests()
    {
        _clientMock = new Mock<IDialogportenClient>();
        var logger = Mock.Of<ILogger<IDialogportenService>>();
        _service = new DialogportenService(_clientMock.Object, logger);
    }

    [Fact]
    public async Task GetDialogByUrn_ReturnsDeserializedDialog_WithTitle_WhenIncludeTitleIsTrue()
    {
        _clientMock.Setup(c => c.GetDialogByUrn(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(ValidDialogJson);

        var result = await _service.GetDialogByUrn(Urn, EnvironmentName, includeTitle: true);

        Assert.NotNull(result);
        Assert.Equal("d1", result!.DialogId);
        Assert.NotNull(result.Title);
        Assert.Equal("Sensitive title", result.Title![0].Value);
    }

    [Fact]
    public async Task GetDialogByUrn_NullsTitle_WhenIncludeTitleIsFalse()
    {
        _clientMock.Setup(c => c.GetDialogByUrn(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(ValidDialogJson);

        var result = await _service.GetDialogByUrn(Urn, EnvironmentName, includeTitle: false);

        Assert.NotNull(result);
        Assert.Null(result!.Title);
    }

    [Fact]
    public async Task GetDialogByUrn_ReturnsNull_WhenClientReturnsEmptyString()
    {
        _clientMock.Setup(c => c.GetDialogByUrn(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("");

        var result = await _service.GetDialogByUrn(Urn, EnvironmentName, includeTitle: true);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetDialogByUrn_DelegatesToClient_WithCorrectUrnAndEnvironment()
    {
        _clientMock.Setup(c => c.GetDialogByUrn(Urn, EnvironmentName)).ReturnsAsync(ValidDialogJson);

        await _service.GetDialogByUrn(Urn, EnvironmentName, includeTitle: true);

        _clientMock.Verify(c => c.GetDialogByUrn(Urn, EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetDialogByUrn_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetDialogByUrn(It.IsAny<string>(), It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetDialogByUrn(Urn, EnvironmentName, includeTitle: true));
    }

    [Fact]
    public async Task GetDialogByUrn_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetDialogByUrn(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetDialogByUrn(Urn, EnvironmentName, includeTitle: true));
    }

    [Fact]
    public async Task GetDialogByUrn_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(c => c.GetDialogByUrn(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetDialogByUrn(Urn, EnvironmentName, includeTitle: true));
    }

    [Fact]
public async Task GetDialogDetails_ReturnsRawJson_WhenClientReturnsData()
{
    _clientMock.Setup(c => c.GetDialogDetails(DialogId, EnvironmentName)).ReturnsAsync(DetailsJson);

    var result = await _service.GetDialogDetails(DialogId, EnvironmentName);

    Assert.Equal(DetailsJson, result);
}

[Fact]
public async Task GetDialogDetails_ReturnsNull_WhenClientReturnsEmptyString()
{
    _clientMock.Setup(c => c.GetDialogDetails(DialogId, EnvironmentName)).ReturnsAsync("");

    var result = await _service.GetDialogDetails(DialogId, EnvironmentName);

    Assert.Null(result);
}

[Fact]
public async Task GetDialogDetails_DelegatesToClient_WithCorrectDialogIdAndEnvironment()
{
    _clientMock.Setup(c => c.GetDialogDetails(DialogId, EnvironmentName)).ReturnsAsync(DetailsJson);

    await _service.GetDialogDetails(DialogId, EnvironmentName);

    _clientMock.Verify(c => c.GetDialogDetails(DialogId, EnvironmentName), Times.Once);
}

[Fact]
public async Task GetDialogDetails_ThrowsException_WhenClientThrows()
{
    _clientMock.Setup(c => c.GetDialogDetails(It.IsAny<string>(), It.IsAny<string>()))
        .ThrowsAsync(new Exception("API request failed"));

    await Assert.ThrowsAsync<Exception>(() => _service.GetDialogDetails(DialogId, EnvironmentName));
}
}
