using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using altinn_support_dashboard.Server.Utils;
using Microsoft.Extensions.Compliance.Redaction;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text.Json;
using Xunit;

public class NotificationsServiceTests
{
    private readonly Mock<INotificationsClient> _clientMock;
    private readonly Mock<IPartyApiService> _partyServiceMock;
    private readonly Mock<IRedactorProvider> _redactorProviderMock;
    private readonly NotificationsService _service;

    private const string EnvironmentName = "TT02";

    private const string ShipmentId = "dec90ca7-4f8d-410f-96ed-666fe019c946";

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
    private const string ValidFutureNotificationsWithNinJson = """
        [
            {
                "shipmentId": "dec90ca7-4f8d-410f-96ed-666fe019c946",
                "creatorName": "test-creator",
                "resourceId": null,
                "sendersReference": "ref-1",
                "requestedSendTime": "2024-01-01T00:00:00",
                "notificationChannel": "email",
                "deliveryAttempts": [
                    {
                        "nationalIdentityNumber": "12345678901",
                        "channel": "email",
                        "emailAddress": "test@test.no",
                        "result": "Delivered",
                        "resultTime": "2024-01-01T00:05:00"
                    }
                ]
            }
        ]
        """;

    private const string ValidNotificationLogJson = """
        [
            {
                "notificationId": "00000000-0000-0000-0000-000000000001",
                "dialogId": "00000000-0000-0000-0000-000000000002",
                "transmissionId": "00000000-0000-0000-0000-000000000003",
                "type": "Email",
                "channel": "Email",
                "destination": "test@test.no",
                "status": "Sent",
                "requestedSendTime": "2026-08-01T10:00:00Z",
                "lastUpdateTime": "2026-08-01T10:05:00Z"
            }
        ]
    """;

    public NotificationsServiceTests()
    {
        _clientMock = new Mock<INotificationsClient>();
        _partyServiceMock = new Mock<IPartyApiService>();
        _redactorProviderMock = new Mock<IRedactorProvider>();
        var logger = Mock.Of<ILogger<INotificationsService>>();
        _service = new NotificationsService(_clientMock.Object, _partyServiceMock.Object, logger, _redactorProviderMock.Object);
    }

    // --- GetFutureNotificationsByShipmentId ---

    [Fact]
    public async Task GetFutureNotificationsByShipmentId_ReturnsDeserializedResponse_WhenClientSucceeds()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByShipmentId(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(ValidFutureNotificationsJson);

        var result = await _service.GetFutureNotificationsByShipmentId(ShipmentId, EnvironmentName);

        Assert.Single(result);
        Assert.Equal("test-creator", result[0].CreatorName);
    }

    [Fact]
    public async Task GetFutureNotificationsByShipmentId_DelegatesToClient_WithCorrectShipmentId()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByShipmentId(ShipmentId, EnvironmentName))
            .ReturnsAsync(ValidFutureNotificationsJson);

        await _service.GetFutureNotificationsByShipmentId(ShipmentId, EnvironmentName);

        _clientMock.Verify(c => c.GetFutureNotificationsByShipmentId(ShipmentId, EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetFutureNotificationsByShipmentId_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByShipmentId(It.IsAny<string>(), It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetFutureNotificationsByShipmentId(ShipmentId, EnvironmentName));
    }

    [Fact]
    public async Task GetFutureNotificationsByShipmentId_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByShipmentId(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetFutureNotificationsByShipmentId(ShipmentId, EnvironmentName));
    }

    [Fact]
    public async Task GetFutureNotificationsByShipmentId_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByShipmentId(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetFutureNotificationsByShipmentId(ShipmentId, EnvironmentName));
    }

    [Fact]
    public async Task GetFutureNotificationsByShipmentId_MasksNationalIdentityNumber_AndClearsRawValue()
    {
        _redactorProviderMock.Setup(p => p.GetRedactor(CustomDataClassifications.SSN)).Returns(new SsnRedactor());
        _clientMock.Setup(c => c.GetFutureNotificationsByShipmentId(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(ValidFutureNotificationsWithNinJson);

        var result = await _service.GetFutureNotificationsByShipmentId(ShipmentId, EnvironmentName);

        var attempt = result[0].DeliveryAttempts[0];
        Assert.Null(attempt!.NationalIdentityNumber);
        Assert.Equal("123456*****", attempt.DisplayedNationalIdentityNumber);
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

    [Fact]
    public async Task GetFutureNotificationsByNin_MasksNationalIdentityNumber_AndClearsRawValue()
    {
        _redactorProviderMock.Setup(p => p.GetRedactor(CustomDataClassifications.SSN)).Returns(new SsnRedactor());
        _clientMock.Setup(c => c.GetFutureNotificationsByNin(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync(ValidFutureNotificationsWithNinJson);

        var result = await _service.GetFutureNotificationsByNin("12345678901", null, null, EnvironmentName);

        var attempt = result[0].DeliveryAttempts[0];
        Assert.Null(attempt!.NationalIdentityNumber);
        Assert.Equal("123456*****", attempt.DisplayedNationalIdentityNumber);
    }

    // --- GetFutureNotificationsByPhoneNumber ---

    [Fact]
    public async Task GetFutureNotificationsByPhoneNumber_ReturnsDeserializedResponse_WhenClientSucceeds()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByPhoneNumber(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync(ValidFutureNotificationsJson);

        var result = await _service.GetFutureNotificationsByPhoneNumber("+4712345678", null, null, EnvironmentName);

        Assert.Single(result);
        Assert.Equal("test-creator", result[0].CreatorName);
    }

    [Fact]
    public async Task GetFutureNotificationsByPhoneNumber_DelegatesToClient_WithCorrectParameters()
    {
        var from = new DateTime(2024, 1, 1);
        var to = new DateTime(2024, 2, 1);
        _clientMock.Setup(c => c.GetFutureNotificationsByPhoneNumber("+4712345678", from, to, EnvironmentName))
            .ReturnsAsync(ValidFutureNotificationsJson);

        await _service.GetFutureNotificationsByPhoneNumber("+4712345678", from, to, EnvironmentName);

        _clientMock.Verify(c => c.GetFutureNotificationsByPhoneNumber("+4712345678", from, to, EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetFutureNotificationsByPhoneNumber_PrependsNorwayCountryCode_WhenPhoneNumberHasNoPlusPrefix()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByPhoneNumber("+4712345678", null, null, EnvironmentName))
            .ReturnsAsync(ValidFutureNotificationsJson);

        await _service.GetFutureNotificationsByPhoneNumber("12345678", null, null, EnvironmentName);

        _clientMock.Verify(c => c.GetFutureNotificationsByPhoneNumber("+4712345678", null, null, EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetFutureNotificationsByPhoneNumber_DoesNotModifyPhoneNumber_WhenItAlreadyHasPlusPrefix()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByPhoneNumber("+4612345678", null, null, EnvironmentName))
            .ReturnsAsync(ValidFutureNotificationsJson);

        await _service.GetFutureNotificationsByPhoneNumber("+4612345678", null, null, EnvironmentName);

        _clientMock.Verify(c => c.GetFutureNotificationsByPhoneNumber("+4612345678", null, null, EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetFutureNotificationsByPhoneNumber_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByPhoneNumber(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetFutureNotificationsByPhoneNumber("12345678", null, null, EnvironmentName));
    }

    [Fact]
    public async Task GetFutureNotificationsByPhoneNumber_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByPhoneNumber(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetFutureNotificationsByPhoneNumber("12345678", null, null, EnvironmentName));
    }

    [Fact]
    public async Task GetFutureNotificationsByPhoneNumber_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByPhoneNumber(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetFutureNotificationsByPhoneNumber("12345678", null, null, EnvironmentName));
    }

    // --- GetFutureNotificationsByEmail ---

    [Fact]
    public async Task GetFutureNotificationsByEmail_ReturnsDeserializedResponse_WhenClientSucceeds()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByEmail(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync(ValidFutureNotificationsJson);

        var result = await _service.GetFutureNotificationsByEmail("test@test.no", null, null, EnvironmentName);

        Assert.Single(result);
        Assert.Equal("test-creator", result[0].CreatorName);
    }

    [Fact]
    public async Task GetFutureNotificationsByEmail_DelegatesToClient_WithCorrectParameters()
    {
        var from = new DateTime(2024, 1, 1);
        var to = new DateTime(2024, 2, 1);
        _clientMock.Setup(c => c.GetFutureNotificationsByEmail("test@test.no", from, to, EnvironmentName))
            .ReturnsAsync(ValidFutureNotificationsJson);

        await _service.GetFutureNotificationsByEmail("test@test.no", from, to, EnvironmentName);

        _clientMock.Verify(c => c.GetFutureNotificationsByEmail("test@test.no", from, to, EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetFutureNotificationsByEmail_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByEmail(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetFutureNotificationsByEmail("test@test.no", null, null, EnvironmentName));
    }

    [Fact]
    public async Task GetFutureNotificationsByEmail_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByEmail(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetFutureNotificationsByEmail("test@test.no", null, null, EnvironmentName));
    }

    [Fact]
    public async Task GetFutureNotificationsByEmail_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(c => c.GetFutureNotificationsByEmail(It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>(), It.IsAny<string>()))
            .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetFutureNotificationsByEmail("test@test.no", null, null, EnvironmentName));
    }

    [Fact]
    public async Task GetNotificationLogsAsync_ReturnsDeserializedResponse_WhenClientSucceeds()
    {
        _clientMock.Setup(c => c.GetNotificationLog(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(ValidNotificationLogJson);
        
        var result = await _service.GetNotificationLogsAsync("00000000-0000-0000-0000-000000000002", "", EnvironmentName);

        Assert.Single(result);
        Assert.Equal("Sent", result[0].Status);
    }

    [Fact]
    public async Task GetNotificationLogsAsync_DelegatesToClient_WithCorrectParameters()
    {
        const string dialogId = "00000000-0000-0000-0000-000000000002";
        const string transmissionId = "00000000-0000-0000-0000-000000000003";
        _clientMock.Setup(c => c.GetNotificationLog(dialogId, transmissionId, EnvironmentName))
            .ReturnsAsync(ValidNotificationLogJson);
        
        await _service.GetNotificationLogsAsync(dialogId, transmissionId, EnvironmentName);

        _clientMock.Verify(c => c.GetNotificationLog(dialogId, transmissionId, EnvironmentName), Times.Once);
    }

    [Fact]
    public async Task GetNotificationLogsAsync_ThrowsException_WhenClientThrows()
    {
        _clientMock.Setup(c => c.GetNotificationLog(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ThrowsAsync(new Exception("API request failed"));

        await Assert.ThrowsAsync<Exception>(() => _service.GetNotificationLogsAsync("dialog-1", "", EnvironmentName));
    }

    [Fact]
    public async Task GetNotificationLogsAsync_ThrowsJsonException_WhenResponseIsInvalidJson()
    {
        _clientMock.Setup(c => c.GetNotificationLog(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("not-valid-json");

        await Assert.ThrowsAsync<JsonException>(() => _service.GetNotificationLogsAsync("dialog-1", "", EnvironmentName));
    }

    [Fact]
    public async Task GetNotificationLogsAsync_ThrowsException_WhenResponseDeserializesToNull()
    {
        _clientMock.Setup(C => C.GetNotificationLog(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() => _service.GetNotificationLogsAsync("dialog-1", "", EnvironmentName));
    }
}
