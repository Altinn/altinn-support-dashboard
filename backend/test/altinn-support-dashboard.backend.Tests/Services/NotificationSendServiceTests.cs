using System.Collections.Generic;
using System.Threading.Tasks;
using Models.notifications;
using Moq;
using Xunit;

public class NotificationSendServiceTests
{
    private const string EnvironmentName = "TT02";
    private const string SendersReference = "asd-test-ref";

    private readonly Mock<INotificationSendClient> _clientMock;
    private readonly NotificationSendService _service;

    public NotificationSendServiceTests()
    {
        _clientMock = new Mock<INotificationSendClient>();
        _clientMock
            .Setup(c => c.SendInstantEmail(It.IsAny<InstantEmailOrderRequest>(), It.IsAny<string>()))
            .ReturnsAsync(new NotificationSendResponse());

        _service = new NotificationSendService(_clientMock.Object);
    }

    [Fact]
    public async Task SendTestEmail_WithValidEmail_PassesOrderAndEnvironmentToClient()
    {
        var request = new NotificationSendRequest { EmailAddress = "test@example.com" };

        await _service.SendTestEmail(request, EnvironmentName, SendersReference);

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o =>
                o.RecipientEmail.EmailAddress == "test@example.com" &&
                o.RecipientEmail.EmailSettings.ContentType == "Plain"),
            EnvironmentName),
            Times.Once);
    }

    [Fact]
    public async Task SendTestEmail_AlwaysUsesFixedSubjectAndBody()
    {
        await _service.SendTestEmail(new NotificationSendRequest { EmailAddress = "test@example.com" }, EnvironmentName, SendersReference);

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o =>
                o.RecipientEmail.EmailSettings.Subject == "Varsel test Altinn" &&
                o.RecipientEmail.EmailSettings.Body.StartsWith("Test varsel fra Altinn") &&
                o.RecipientEmail.EmailSettings.Body.Contains("Denne mailen kan ikke besvares")),
            EnvironmentName),
            Times.Once);
    }

    [Fact]
    public async Task SendTestEmail_UsesSendersReferenceFromCaller()
    {
        await _service.SendTestEmail(new NotificationSendRequest { EmailAddress = "test@example.com" }, EnvironmentName, "asd-test-123");

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o => o.SendersReference == "asd-test-123"),
            EnvironmentName),
            Times.Once);
    }

    [Fact]
    public async Task SendTestEmail_TrimsEmailAddress()
    {
        var request = new NotificationSendRequest { EmailAddress = "  test@example.com  " };

        await _service.SendTestEmail(request, EnvironmentName, SendersReference);

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o => o.RecipientEmail.EmailAddress == "test@example.com"),
            EnvironmentName),
            Times.Once);
    }

    [Fact]
    public async Task SendTestEmail_GeneratesUniqueIdempotencyIdPerOrder()
    {
        var orders = new List<InstantEmailOrderRequest>();
        _clientMock
            .Setup(c => c.SendInstantEmail(It.IsAny<InstantEmailOrderRequest>(), It.IsAny<string>()))
            .Callback<InstantEmailOrderRequest, string>((o, _) => orders.Add(o))
            .ReturnsAsync(new NotificationSendResponse());

        var request = new NotificationSendRequest { EmailAddress = "test@example.com" };
        await _service.SendTestEmail(request, EnvironmentName, SendersReference);
        await _service.SendTestEmail(request, EnvironmentName, SendersReference);

        Assert.Equal(2, orders.Count);
        Assert.NotEqual(orders[0].IdempotencyId, orders[1].IdempotencyId);
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    [InlineData("missing@domain")]
    public async Task SendTestEmail_WithInvalidEmail_ThrowsBadRequest(string email)
    {
        var request = new NotificationSendRequest { EmailAddress = email };

        await Assert.ThrowsAsync<BadRequestException>(() => _service.SendTestEmail(request, EnvironmentName, SendersReference));

        _clientMock.Verify(c => c.SendInstantEmail(It.IsAny<InstantEmailOrderRequest>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task SendTestEmail_ReturnsClientResponse()
    {
        var expected = new NotificationSendResponse { ResponseBody = "body" };
        _clientMock
            .Setup(c => c.SendInstantEmail(It.IsAny<InstantEmailOrderRequest>(), EnvironmentName))
            .ReturnsAsync(expected);

        var result = await _service.SendTestEmail(new NotificationSendRequest { EmailAddress = "test@example.com" }, EnvironmentName, SendersReference);

        Assert.Same(expected, result);
    }
}
