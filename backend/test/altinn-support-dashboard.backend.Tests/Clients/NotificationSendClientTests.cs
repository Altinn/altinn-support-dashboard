using Altinn.ApiClients.Maskinporten.Config;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Models.notifications;
using Moq;
using Moq.Protected;
using System.Net;
using System.Text.Json;
using Xunit;

namespace altinn_support_dashboard.backend.Tests.Clients;

public class NotificationSendClientTests
{
    private const string TT02BaseAddress = "https://platform.tt02.altinn.no";
    private const string ProductionBaseAddress = "https://platform.altinn.no";
    private const string InstantEmailPath = "/notifications/api/v1/future/orders/instant/email";

    private sealed class CapturedRequest
    {
        public HttpMethod? Method { get; set; }
        public Uri? Uri { get; set; }
        public string Body { get; set; } = "";
        public string? ApiKey { get; set; }
        public string? SubscriptionKey { get; set; }
    }

    private static IOptions<Configuration> CreateConfiguration()
    {
        var config = new Configuration
        {
            TT02 = new EnvironmentConfiguration
            {
                Name = "TT02",
                ThemeName = "test-theme",
                BaseAddressAltinn3 = TT02BaseAddress,
                Timeout = 30,
                ApiKey = "tt02-api-key",
                Ocp_Apim_Subscription_Key = "tt02-sub-key",
                MaskinportenSettings = new MaskinportenSettings { }
            },
            Production = new EnvironmentConfiguration
            {
                Name = "Production",
                ThemeName = "test-theme",
                BaseAddressAltinn3 = ProductionBaseAddress,
                Timeout = 30,
                ApiKey = "prod-api-key",
                Ocp_Apim_Subscription_Key = "prod-sub-key",
                MaskinportenSettings = new MaskinportenSettings { }
            },
            Correspondence = new CorrespondenceResourceType
            {
                DefaultResourceId = "default",
                ConfidentialityResourceId = "confident",
                SelfIdentifiedResourceId = "self",
                SecurityLvl4ResourceId = "lvl4"
            }
        };

        return Options.Create(config);
    }

    private static NotificationSendClient CreateClient(Mock<HttpMessageHandler> handlerMock)
    {
        var factoryMock = new Mock<IHttpClientFactory>();
        factoryMock
            .Setup(f => f.CreateClient(It.IsAny<string>()))
            .Returns(() => new HttpClient(handlerMock.Object));

        var logger = Mock.Of<ILogger<INotificationSendClient>>();
        return new NotificationSendClient(factoryMock.Object, CreateConfiguration(), logger);
    }

    private static (NotificationSendClient Client, CapturedRequest Captured, Mock<HttpMessageHandler> Handler) CreateClient(
        HttpStatusCode statusCode, string responseBody)
    {
        var captured = new CapturedRequest();
        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .Callback<HttpRequestMessage, CancellationToken>((req, _) =>
            {
                // Read everything here: the request is disposed when SendInstantEmail returns
                captured.Method = req.Method;
                captured.Uri = req.RequestUri;
                captured.Body = req.Content!.ReadAsStringAsync().Result;
                captured.ApiKey = req.Headers.GetValues("ApiKey").SingleOrDefault();
                captured.SubscriptionKey = req.Headers.GetValues("Ocp-Apim-Subscription-Key").SingleOrDefault();
            })
            .ReturnsAsync(() => new HttpResponseMessage(statusCode)
            {
                Content = new StringContent(responseBody)
            });

        return (CreateClient(handlerMock), captured, handlerMock);
    }

    private static InstantEmailOrderRequest CreateOrder() => new()
    {
        IdempotencyId = "idem-1",
        SendersReference = "ref-1",
        RecipientEmail = new InstantRecipientEmail
        {
            EmailAddress = "test@example.com",
            EmailSettings = new InstantEmailSettings
            {
                Subject = "Subject",
                Body = "Body"
            }
        }
    };

    private const string SuccessBody = """
        {
          "notificationOrderId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "notification": {
            "shipmentId": "4fa85f64-5717-4562-b3fc-2c963f66afa6",
            "sendersReference": "ref-1"
          }
        }
        """;

    private const string ProblemBody = """
        {
          "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
          "title": "One or more validation errors occurred.",
          "status": 400,
          "detail": "Invalid email",
          "errors": {
            "RecipientEmail.EmailAddress": ["Invalid email address format."]
          },
          "traceId": "abc-123"
        }
        """;

    [Theory]
    [InlineData("TT02", TT02BaseAddress, "tt02-api-key", "tt02-sub-key")]
    [InlineData("Production", ProductionBaseAddress, "prod-api-key", "prod-sub-key")]
    public async Task SendInstantEmail_UsesConfigurationForGivenEnvironment(
        string environmentName, string expectedBaseAddress, string expectedApiKey, string expectedSubKey)
    {
        var (client, captured, _) = CreateClient(HttpStatusCode.OK, SuccessBody);

        await client.SendInstantEmail(CreateOrder(), environmentName);

        Assert.Equal(HttpMethod.Post, captured.Method);
        Assert.Equal(new Uri(expectedBaseAddress + InstantEmailPath), captured.Uri);
        Assert.Equal(expectedApiKey, captured.ApiKey);
        Assert.Equal(expectedSubKey, captured.SubscriptionKey);
    }

    [Fact]
    public async Task SendInstantEmail_SerializesOrderAsCamelCaseJson_WithoutNullFields()
    {
        var (client, captured, _) = CreateClient(HttpStatusCode.OK, SuccessBody);

        await client.SendInstantEmail(CreateOrder(), "TT02");

        using var doc = JsonDocument.Parse(captured.Body);
        var root = doc.RootElement;
        Assert.Equal("idem-1", root.GetProperty("idempotencyId").GetString());
        Assert.Equal("ref-1", root.GetProperty("sendersReference").GetString());

        var email = root.GetProperty("recipientEmail");
        Assert.Equal("test@example.com", email.GetProperty("emailAddress").GetString());

        var settings = email.GetProperty("emailSettings");
        Assert.Equal("Subject", settings.GetProperty("subject").GetString());
        Assert.Equal("Body", settings.GetProperty("body").GetString());
        Assert.Equal("Plain", settings.GetProperty("contentType").GetString());
        Assert.False(settings.TryGetProperty("senderEmailAddress", out _));
    }

    [Fact]
    public async Task SendInstantEmail_OnSuccess_ParsesResult()
    {
        var (client, _, _) = CreateClient(HttpStatusCode.Created, SuccessBody);

        var result = await client.SendInstantEmail(CreateOrder(), "TT02");

        Assert.Equal(HttpStatusCode.Created, result.StatusCode);
        Assert.Null(result.Problem);
        Assert.NotNull(result.Result);
        Assert.Equal(Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afa6"), result.Result!.NotificationOrderId);
        Assert.Equal(Guid.Parse("4fa85f64-5717-4562-b3fc-2c963f66afa6"), result.Result.Notification!.ShipmentId);
        Assert.Equal("ref-1", result.Result.Notification.SendersReference);
        Assert.Equal(SuccessBody, result.ResponseBody);
        Assert.False(string.IsNullOrEmpty(result.RequestBody));
    }

    [Fact]
    public async Task SendInstantEmail_OnError_ParsesProblemDetails()
    {
        var (client, _, _) = CreateClient(HttpStatusCode.BadRequest, ProblemBody);

        var result = await client.SendInstantEmail(CreateOrder(), "TT02");

        Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        Assert.Null(result.Result);
        Assert.NotNull(result.Problem);
        Assert.Equal("One or more validation errors occurred.", result.Problem!.Title);
        Assert.Equal(400, result.Problem.Status);
        Assert.Equal("Invalid email", result.Problem.Detail);
        Assert.Equal(["Invalid email address format."], result.Problem.Errors!["RecipientEmail.EmailAddress"]);
        Assert.True(result.Problem.Extensions!.ContainsKey("traceId"));
    }

    [Fact]
    public async Task SendInstantEmail_OnNonJsonError_ReturnsRawBodyWithoutProblem()
    {
        var (client, _, _) = CreateClient(HttpStatusCode.BadGateway, "<html>Bad gateway</html>");

        var result = await client.SendInstantEmail(CreateOrder(), "TT02");

        Assert.Equal(HttpStatusCode.BadGateway, result.StatusCode);
        Assert.Null(result.Result);
        Assert.Null(result.Problem);
        Assert.Equal("<html>Bad gateway</html>", result.ResponseBody);
    }

    [Fact]
    public async Task SendInstantEmail_OnEmptyErrorBody_ReturnsNullProblem()
    {
        var (client, _, _) = CreateClient(HttpStatusCode.Unauthorized, "");

        var result = await client.SendInstantEmail(CreateOrder(), "TT02");

        Assert.Equal(HttpStatusCode.Unauthorized, result.StatusCode);
        Assert.Null(result.Problem);
    }

    [Fact]
    public async Task SendInstantEmail_ResponseHeaders_ExcludeSensitiveHeaders()
    {
        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(() =>
            {
                var response = new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(SuccessBody) };
                response.Headers.Add("ApiKey", "should-not-leak");
                response.Headers.Add("X-Custom-Header", "custom-value");
                return response;
            });

        var client = CreateClient(handlerMock);

        var result = await client.SendInstantEmail(CreateOrder(), "TT02");

        Assert.Contains("X-Custom-Header: custom-value", result.ResponseHeader);
        Assert.DoesNotContain("should-not-leak", result.ResponseHeader);
    }

    [Theory]
    [InlineData("mock")]
    [InlineData("tt02")]
    [InlineData("")]
    public async Task SendInstantEmail_WithUnsupportedEnvironment_ThrowsBadRequest(string environmentName)
    {
        var (client, _, handler) = CreateClient(HttpStatusCode.OK, SuccessBody);

        await Assert.ThrowsAsync<BadRequestException>(() => client.SendInstantEmail(CreateOrder(), environmentName));

        handler.Protected().Verify(
            "SendAsync",
            Times.Never(),
            ItExpr.IsAny<HttpRequestMessage>(),
            ItExpr.IsAny<CancellationToken>());
    }
}
