using Altinn.ApiClients.Maskinporten.Config;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Models.notifications;
using Moq;
using Moq.Protected;
using System.Net;
using Xunit;

namespace altinn_support_dashboard.backend.Tests.Clients;

public class MockNotificationSendClientTests
{
    private static IOptions<Configuration> CreateConfiguration()
    {
        static EnvironmentConfiguration Env(string name, string baseAddress) => new()
        {
            Name = name,
            ThemeName = "test-theme",
            BaseAddressAltinn3 = baseAddress,
            Timeout = 30,
            ApiKey = "test-api-key",
            Ocp_Apim_Subscription_Key = "test",
            MaskinportenSettings = new MaskinportenSettings { }
        };

        return Options.Create(new Configuration
        {
            TT02 = Env("TT02", "https://platform.tt02.altinn.no"),
            Production = Env("Production", "https://platform.altinn.no"),
            Correspondence = new CorrespondenceResourceType
            {
                DefaultResourceId = "default",
                ConfidentialityResourceId = "confident",
                SelfIdentifiedResourceId = "self",
                SecurityLvl4ResourceId = "lvl4"
            }
        });
    }

    private static (MockNotificationSendClient Client, Mock<HttpMessageHandler> Handler) CreateClient()
    {
        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(() => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("""{"notificationOrderId":"3fa85f64-5717-4562-b3fc-2c963f66afa6"}""")
            });

        var factoryMock = new Mock<IHttpClientFactory>();
        factoryMock
            .Setup(f => f.CreateClient(It.IsAny<string>()))
            .Returns(() => new HttpClient(handlerMock.Object));

        var inner = new NotificationSendClient(factoryMock.Object, CreateConfiguration(), Mock.Of<ILogger<INotificationSendClient>>());
        return (new MockNotificationSendClient(inner), handlerMock);
    }

    private static InstantEmailOrderRequest CreateOrder() => new()
    {
        SendersReference = "ref-1",
        RecipientEmail = new InstantRecipientEmail { EmailAddress = "test@example.com" }
    };

    [Theory]
    [InlineData("mock")]
    [InlineData("MOCK")]
    public async Task SendInstantEmail_InMockEnvironment_ReturnsFakeSuccess_WithoutHttpCall(string environmentName)
    {
        var (client, handler) = CreateClient();

        var result = await client.SendInstantEmail(CreateOrder(), environmentName);

        Assert.Equal(HttpStatusCode.Created, result.StatusCode);
        Assert.Null(result.Problem);
        Assert.NotNull(result.Result);
        Assert.NotEqual(Guid.Empty, result.Result!.NotificationOrderId);
        Assert.NotEqual(Guid.Empty, result.Result.Notification!.ShipmentId);
        Assert.Equal("ref-1", result.Result.Notification.SendersReference);
        Assert.Contains("test@example.com", result.RequestBody);
        Assert.Contains("notificationOrderId", result.ResponseBody);

        handler.Protected().Verify(
            "SendAsync",
            Times.Never(),
            ItExpr.IsAny<HttpRequestMessage>(),
            ItExpr.IsAny<CancellationToken>());
    }

    [Fact]
    public async Task SendInstantEmail_InRealEnvironment_DelegatesToInnerClient()
    {
        var (client, handler) = CreateClient();

        var result = await client.SendInstantEmail(CreateOrder(), "TT02");

        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
        handler.Protected().Verify(
            "SendAsync",
            Times.Once(),
            ItExpr.IsAny<HttpRequestMessage>(),
            ItExpr.IsAny<CancellationToken>());
    }
}
