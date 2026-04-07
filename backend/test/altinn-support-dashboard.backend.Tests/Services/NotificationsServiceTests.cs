using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text.Json;
using Xunit;

public class NotificationsServiceTests
{
    private readonly Mock<INotificationsClient> _clientMock;
    private readonly NotificationsService _service;

    private const string ValidOrderJson = """
        {
            "orderId": "order-123",
            "sendersReference": "ref-abc",
            "generated": 2,
            "succeeded": 1,
            "notifications": []
        }
        """;

    public NotificationsServiceTests()
    {
        _clientMock = new Mock<INotificationsClient>();
        var logger = Mock.Of<ILogger<INotificationsService>>();
        _service = new NotificationsService(_clientMock.Object, logger);
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_ReturnsDeserializedResponse_WhenClientSucceeds()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>())).ReturnsAsync(ValidOrderJson);

        var result = await _service.GetEmailNotificationsByOrderId("order-123");

        Assert.Equal("order-123", result.OrderId);
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_DelegatesToClient_WithCorrectOrderId()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId("order-123")).ReturnsAsync(ValidOrderJson);

        await _service.GetEmailNotificationsByOrderId("order-123");

        _clientMock.Verify(c => c.GetEmailNotificationsByOrderId("order-123"), Times.Once);
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetEmailNotificationsByOrderId("order-123"));
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>())).ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetEmailNotificationsByOrderId("order-123"));
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>())).ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetEmailNotificationsByOrderId("order-123"));
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_ReturnsDeserializedResponse_WhenClientSucceeds()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>())).ReturnsAsync(ValidOrderJson);

        var result = await _service.GetSmsNotificationsByOrderId("order-123");

        Assert.Equal("order-123", result.OrderId);
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_DelegatesToClient_WithCorrectOrderId()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId("order-123")).ReturnsAsync(ValidOrderJson);

        await _service.GetSmsNotificationsByOrderId("order-123");

        _clientMock.Verify(c => c.GetSmsNotificationsByOrderId("order-123"), Times.Once);
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetSmsNotificationsByOrderId("order-123"));
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>())).ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetSmsNotificationsByOrderId("order-123"));
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>())).ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetSmsNotificationsByOrderId("order-123"));
    }
}
