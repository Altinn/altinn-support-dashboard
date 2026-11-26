using System.Collections.Generic;
using System.Threading.Tasks;
using Models.notifications;
using Moq;
using Xunit;

public class NotificationSendServiceTests
{
    private const string EnvironmentName = "TT02";
    private const string IdempotencyId = "5f98c36c-653f-4de0-b75f-24711eaee568";
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

        await _service.SendTestEmail(request, EnvironmentName, IdempotencyId, SendersReference);

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
        await _service.SendTestEmail(new NotificationSendRequest { EmailAddress = "test@example.com" }, EnvironmentName, IdempotencyId, SendersReference);

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o =>
                o.RecipientEmail.EmailSettings.Subject == "Varslingstest Altinn" &&
                o.RecipientEmail.EmailSettings.Body.StartsWith("Dette er en varslingstest fra Altinn") &&
                o.RecipientEmail.EmailSettings.Body.Contains("Denne meldingen kan ikke besvares")),
            EnvironmentName),
            Times.Once);
    }

    [Fact]
    public async Task SendTestEmail_UsesSendersReferenceFromCaller()
    {
        await _service.SendTestEmail(new NotificationSendRequest { EmailAddress = "test@example.com" }, EnvironmentName, IdempotencyId, "asd-test-123");

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o => o.SendersReference == "asd-test-123"),
            EnvironmentName),
            Times.Once);
    }

    [Fact]
    public async Task SendTestEmail_UsesIdempotencyIdFromCaller()
    {
        await _service.SendTestEmail(new NotificationSendRequest { EmailAddress = "test@example.com" }, EnvironmentName, IdempotencyId, SendersReference);

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o => o.IdempotencyId == IdempotencyId),
            EnvironmentName),
            Times.Once);
    }

    [Fact]
    public async Task SendTestEmail_SameIdempotencyId_IsSentUnchangedOnRetry()
    {
        var orders = new List<InstantEmailOrderRequest>();
        _clientMock
            .Setup(c => c.SendInstantEmail(It.IsAny<InstantEmailOrderRequest>(), It.IsAny<string>()))
            .Callback<InstantEmailOrderRequest, string>((o, _) => orders.Add(o))
            .ReturnsAsync(new NotificationSendResponse());

        var request = new NotificationSendRequest { EmailAddress = "test@example.com" };
        await _service.SendTestEmail(request, EnvironmentName, IdempotencyId, SendersReference);
        await _service.SendTestEmail(request, EnvironmentName, IdempotencyId, SendersReference);

        Assert.Equal(2, orders.Count);
        Assert.All(orders, o => Assert.Equal(IdempotencyId, o.IdempotencyId));
    }

    [Fact]
    public async Task SendTestEmail_TrimsEmailAddress()
    {
        var request = new NotificationSendRequest { EmailAddress = "  test@example.com  " };

        await _service.SendTestEmail(request, EnvironmentName, IdempotencyId, SendersReference);

        _clientMock.Verify(c => c.SendInstantEmail(
            It.Is<InstantEmailOrderRequest>(o => o.RecipientEmail.EmailAddress == "test@example.com"),
            EnvironmentName),
            Times.Once);
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    [InlineData("missing@domain")]
    public async Task SendTestEmail_WithInvalidEmail_ThrowsBadRequest(string email)
    {
        var request = new NotificationSendRequest { EmailAddress = email };

        await Assert.ThrowsAsync<BadRequestException>(() => _service.SendTestEmail(request, EnvironmentName, IdempotencyId, SendersReference));

        _clientMock.Verify(c => c.SendInstantEmail(It.IsAny<InstantEmailOrderRequest>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task SendTestEmail_ReturnsClientResponse()
    {
        var expected = new NotificationSendResponse { ResponseBody = "body" };
        _clientMock
            .Setup(c => c.SendInstantEmail(It.IsAny<InstantEmailOrderRequest>(), EnvironmentName))
            .ReturnsAsync(expected);

        var result = await _service.SendTestEmail(new NotificationSendRequest { EmailAddress = "test@example.com" }, EnvironmentName, IdempotencyId, SendersReference);

        Assert.Same(expected, result);
    }
}
