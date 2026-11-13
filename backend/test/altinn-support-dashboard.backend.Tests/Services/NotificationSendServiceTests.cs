using System.Collections.Generic;
using System.Threading.Tasks;
using Models.notifications;
using Moq;
using Xunit;

public class NotificationSendServiceTests
{
    private const string EnvironmentName = "TT02";

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
        var request = new NotificationSendRequest
        {
            EmailAddress = "test@example.com",
            Subject = "My subject",
            Body = "My body"
        };

        await _service.SendTestEmail(request, EnvironmentName);

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o =>
                o.RecipientEmail.EmailAddress == "test@example.com" &&
                o.RecipientEmail.EmailSettings.Subject == "My subject" &&
                o.RecipientEmail.EmailSettings.Body == "My body" &&
                o.RecipientEmail.EmailSettings.ContentType == "Plain"),
            EnvironmentName),
            Times.Once);
    }

    [Fact]
    public async Task SendTestEmail_TrimsEmailAddress()
    {
        var request = new NotificationSendRequest { EmailAddress = "  test@example.com  " };

        await _service.SendTestEmail(request, EnvironmentName);

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o => o.RecipientEmail.EmailAddress == "test@example.com"),
            EnvironmentName),
            Times.Once);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task SendTestEmail_WithEmptySubjectAndBody_UsesDefaults(string? value)
    {
        var request = new NotificationSendRequest
        {
            EmailAddress = "test@example.com",
            Subject = value,
            Body = value
        };

        await _service.SendTestEmail(request, EnvironmentName);

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o =>
                o.RecipientEmail.EmailSettings.Subject == "Varsel test Altinn" &&
                o.RecipientEmail.EmailSettings.Body == "Test varsel fra Altinn"),
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
        await _service.SendTestEmail(request, EnvironmentName);
        await _service.SendTestEmail(request, EnvironmentName);

        Assert.Equal(2, orders.Count);
        Assert.NotEqual(orders[0].IdempotencyId, orders[1].IdempotencyId);
        Assert.NotEqual(orders[0].SendersReference, orders[1].SendersReference);
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    [InlineData("missing@domain")]
    public async Task SendTestEmail_WithInvalidEmail_ThrowsBadRequest(string email)
    {
        var request = new NotificationSendRequest { EmailAddress = email };

        await Assert.ThrowsAsync<BadRequestException>(() => _service.SendTestEmail(request, EnvironmentName));

        _clientMock.Verify(c => c.SendInstantEmail(It.IsAny<InstantEmailOrderRequest>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task SendTestEmail_ReturnsClientResponse()
    {
        var expected = new NotificationSendResponse { ResponseBody = "body" };
        _clientMock
            .Setup(c => c.SendInstantEmail(It.IsAny<InstantEmailOrderRequest>(), EnvironmentName))
            .ReturnsAsync(expected);

        var result = await _service.SendTestEmail(new NotificationSendRequest { EmailAddress = "test@example.com" }, EnvironmentName);

        Assert.Same(expected, result);
    }
}
