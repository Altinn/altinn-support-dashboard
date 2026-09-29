using Altinn.ApiClients.Maskinporten.Config;
using altinn_support_dashboard.Server.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Moq.Protected;
using System.Net;

namespace altinn_support_dashboard.backend.Tests.Clients;

public class DialogportenClientTests
{
    private const string DialogId = "11111111-1111-1111-1111-111111111111";
    private const string Revision = "\"revision-123\"";
    private const string EnvironmentName = "TT02";
    private const string BaseAddress = "https://platform.tt02.altinn.no";

    private static IOptions<Configuration> CreateConfiguration()
    {
        var config = new Configuration
        {
            TT02 = new EnvironmentConfiguration
            {
                Name = "TT02",
                ThemeName = "test-theme",
                BaseAddressAltinn3 = BaseAddress,
                Timeout = 30,
                ApiKey = "test-api-key",
                Ocp_Apim_Subscription_Key = "test",
                MaskinportenSettings = new MaskinportenSettings { }
            },
            Production = new EnvironmentConfiguration
            {
                Name = "Production",
                ThemeName = "test-theme",
                BaseAddressAltinn3 = "https://platform.altinn.no",
                Timeout = 30,
                ApiKey = "test-api-key",
                Ocp_Apim_Subscription_Key = "test",
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

    private static (DialogportenClient Client, Mock<HttpMessageHandler> HandlerMock) CreateClient()
    {
        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("")
            });

        var httpClient = new HttpClient(handlerMock.Object);
        var factoryMock = new Mock<IHttpClientFactory>();
        factoryMock.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(httpClient);

        var logger = Mock.Of<ILogger<IDialogportenClient>>();
        var client = new DialogportenClient(CreateConfiguration(), factoryMock.Object, logger);

        return (client, handlerMock);
    }

    [Fact]
    public async Task DeleteDialogById_SendsHttpDelete_ToDialogEndpoint_WhenSoftDeleting()
    {
        var (client, handlerMock) = CreateClient();

        await client.DeleteDialogById(DialogId, Revision, hardDelete: false, EnvironmentName);

        handlerMock.Protected().Verify(
            "SendAsync",
            Times.Once(),
            ItExpr.Is<HttpRequestMessage>(req =>
                req.Method == HttpMethod.Delete &&
                req.RequestUri!.PathAndQuery == $"/dialogporten/api/v1/serviceowner/dialogs/{DialogId}"),
            ItExpr.IsAny<CancellationToken>());
    }

    [Fact]
    public async Task DeleteDialogById_SendsHttpPost_ToPurgeEndpoint_WhenHardDeleting()
    {
        var (client, handlerMock) = CreateClient();

        await client.DeleteDialogById(DialogId, Revision, hardDelete: true, EnvironmentName);

        handlerMock.Protected().Verify(
            "SendAsync",
            Times.Once(),
            ItExpr.Is<HttpRequestMessage>(req =>
                req.Method == HttpMethod.Post &&
                req.RequestUri!.PathAndQuery == $"/dialogporten/api/v1/serviceowner/dialogs/{DialogId}/actions/purge"),
            ItExpr.IsAny<CancellationToken>());
    }
}
