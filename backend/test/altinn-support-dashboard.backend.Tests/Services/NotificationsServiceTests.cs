using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text.Json;
using Xunit;

public class NotificationsServiceTests
{
    private readonly Mock<INotificationsClient> _clientMock;
    private readonly Mock<IPartyApiService> _partyServiceMock;
    private readonly NotificationsService _service;

    private const string EnvironmentName = "TT02";

    private const string ValidOrderJson = """
        {
            "orderId": "order-123",
            "sendersReference": "ref-abc",
            "generated": 2,
            "succeeded": 1,
            "notifications": []
        }
        """;

    private const string ValidFutureNotificationsJson = """
        [
            {
                "shipmentId": "dec90ca7-4f8d-410f-96ed-666fe019c946",
                "creatorName": "test-creator",
                "resourceId": null,
                "sendersReference": "ref-1",
                "requestedSendTime": "2024-01-01T00:00:00",
                "notificationChannel": "email",
                "deliveryAttempts": []
            }
        ]
        """;

    public NotificationsServiceTests()
    {
        _clientMock = new Mock<INotificationsClient>();
        _partyServiceMock = new Mock<IPartyApiService>();
        var logger = Mock.Of<ILogger<INotificationsService>>();
        _service = new NotificationsService(_clientMock.Object, _partyServiceMock.Object, logger);
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_ReturnsDeserializedResponse_WhenClientSucceeds()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(ValidOrderJson);

        var result = await _service.GetEmailNotificationsByOrderId("order-123", EnvironmentName);

        Assert.Equal("order-123", result.OrderId);
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_DelegatesToClient_WithCorrectOrderId()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId("order-123", EnvironmentName)).ReturnsAsync(ValidOrderJson);

        await _service.GetEmailNotificationsByOrderId("order-123", EnvironmentName);

        _clientMock.Verify(c => c.GetEmailNotificationsByOrderId("order-123", EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetEmailNotificationsByOrderId("order-123", EnvironmentName));
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetEmailNotificationsByOrderId("order-123", EnvironmentName));
    }

    [Fact]
    public async Task GetEmailNotificationsByOrderId_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetEmailNotificationsByOrderId("order-123", EnvironmentName));
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_ReturnsDeserializedResponse_WhenClientSucceeds()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(ValidOrderJson);

        var result = await _service.GetSmsNotificationsByOrderId("order-123", EnvironmentName);

        Assert.Equal("order-123", result.OrderId);
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_DelegatesToClient_WithCorrectOrderId()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId("order-123", EnvironmentName)).ReturnsAsync(ValidOrderJson);

        await _service.GetSmsNotificationsByOrderId("order-123", EnvironmentName);

        _clientMock.Verify(c => c.GetSmsNotificationsByOrderId("order-123", EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetSmsNotificationsByOrderId("order-123", EnvironmentName));
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetSmsNotificationsByOrderId("order-123", EnvironmentName));
    }

    [Fact]
    public async Task GetSmsNotificationsByOrderId_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetSmsNotificationsByOrderId("order-123", EnvironmentName));
    }

    // --- GetAllNotificationsByOrderId ---

    [Fact]
    public async Task GetAllNotificationsByOrderId_ReturnsBothResults_WhenBothCallsSucceed()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(ValidOrderJson);
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(ValidOrderJson);

        var result = await _service.GetAllNotificationsByOrderId("order-123", EnvironmentName);

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetAllNotificationsByOrderId_ReturnsSingleResult_WhenEmailFails()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ThrowsAsync(new Exception("Email API failure"));
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(ValidOrderJson);

        var result = await _service.GetAllNotificationsByOrderId("order-123", EnvironmentName);

        Assert.Single(result);
    }

    [Fact]
    public async Task GetAllNotificationsByOrderId_ReturnsSingleResult_WhenSmsFails()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(ValidOrderJson);
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ThrowsAsync(new Exception("SMS API failure"));

        var result = await _service.GetAllNotificationsByOrderId("order-123", EnvironmentName);

        Assert.Single(result);
    }

    [Fact]
    public async Task GetAllNotificationsByOrderId_ThrowsError_WhenBothCallsFail()
    {
        _clientMock.Setup(c => c.GetEmailNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ThrowsAsync(new Exception("Email API failure"));
        _clientMock.Setup(c => c.GetSmsNotificationsByOrderId(It.IsAny<string>(), It.IsAny<string>())).ThrowsAsync(new Exception("SMS API failure"));

        await Assert.ThrowsAsync<HttpRequestException>(() => _service.GetAllNotificationsByOrderId("order-123", EnvironmentName));
    }

    // --- GetFutureNotificationsByNin ---

    [Fact]
    public async Task GetFutureNotificationsByNin_ReturnsDeserializedResponse_WhenClientSucceeds()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByNin(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync(ValidFutureNotificationsJson);

        var result = await _service.GetFutureNotificationsByNin("12345678901", null, null, EnvironmentName);

        Assert.Single(result);
        Assert.Equal("test-creator", result[0].CreatorName);
    }

    [Fact]
    public async Task GetFutureNotificationsByNin_DelegatesToClient_WithCorrectParameters()
    {
        var from = new DateTime(2024, 1, 1);
        var to = new DateTime(2024, 2, 1);
        _clientMock.Setup(c => c.GetFutureNotificationsByNin("12345678901", from, to, EnvironmentName))
            .ReturnsAsync(ValidFutureNotificationsJson);

        await _service.GetFutureNotificationsByNin("12345678901", from, to, EnvironmentName);

        _clientMock.Verify(c => c.GetFutureNotificationsByNin("12345678901", from, to, EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetFutureNotificationsByNin_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByNin(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetFutureNotificationsByNin("12345678901", null, null, EnvironmentName));
    }

    [Fact]
    public async Task GetFutureNotificationsByNin_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByNin(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetFutureNotificationsByNin("12345678901", null, null, EnvironmentName));
    }

    [Fact]
    public async Task GetFutureNotificationsByNin_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByNin(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetFutureNotificationsByNin("12345678901", null, null, EnvironmentName));
    }
}
