using Altinn.ApiClients.Maskinporten.Config;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using Microsoft.Extensions.Options;
using Models.altinn3Dtos;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Services;


public class AltinnApiServiceTest
{
    private readonly AltinnApiService _altinnApiService;
    private readonly Mock<AltinnApiClient> _mockAltinn2Client;
    private readonly Mock<Altinn3ApiClient> _mockAltinn3Client;

    public AltinnApiServiceTest()
    {
        var mockHttpClient = new Mock<IHttpClientFactory>();
        var mockConfig = new Mock<IOptions<Configuration>>();

        mockConfig.Setup(x => x.Value).Returns(new Configuration
    {
        TT02 = new EnvironmentConfiguration
        {
            Name = "TT02",
            ThemeName = "test-theme",
            BaseAddressAltinn2 = "https://tt02.altinn.no",
            BaseAddressAltinn3 = "https://platform.tt02.altinn.no",
            Timeout = 30,
            ApiKey = "test-api-key",
            MaskinportenSettings = new MaskinportenSettings
            {}
        },
        Production = new EnvironmentConfiguration
        {
            Name = "Production",
            ThemeName = "test-theme",
            BaseAddressAltinn2 = "https://altinn.no",
            BaseAddressAltinn3 = "https://platform.altinn.no",
            Timeout = 30,
            ApiKey = "test-api-key",
            MaskinportenSettings = new MaskinportenSettings
            {}
        }
    });
    mockHttpClient.Setup(x => x.CreateClient(It.IsAny<string>()))
        .Returns(new HttpClient());

        _mockAltinn2Client = new Mock<AltinnApiClient>(
            mockConfig.Object, 
            mockHttpClient.Object
        );
        _mockAltinn3Client = new Mock<Altinn3ApiClient>(
            mockConfig.Object, 
            mockHttpClient.Object
        );
        _altinnApiService = new AltinnApiService(_mockAltinn2Client.Object, _mockAltinn3Client.Object);        
    }

    [Fact]
    public async Task GetOrganizationInfo_ReturnsOrganization_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        _mockAltinn2Client
        .Setup(x => x.GetOrganizationInfo(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("{\"organizationNumber\": \"123456789\"}");

        var result = await _altinnApiService.GetOrganizationInfo(validOrgNumber, "TT02");

        Assert.NotNull(result);
        Assert.Equal("123456789", result.OrganizationNumber);
    }

    [Fact]
    public async Task GetNotificationAddressesAltinn3_ReturnsData_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        NotificationAddressDto notificationAddress1 = new NotificationAddressDto
            {
                NotificationAddressId = 1,
                CountryCode = "NO",
                Email = "test@test.no",
                Phone = "12345678",
                SourceOrgNumber = "123456789",
                RequestedOrgNumber = "987654321",
                LastChanged = DateTime.Parse("2024-12-02T10:00:00")
        };
        var jsonResponse = @"[
        {
            ""notificationAddressId"": 1,
            ""countryCode"": ""NO"",
            ""email"": ""test@test.no"",
            ""phone"": ""12345678"",
            ""sourceOrgNumber"": ""123456789"",
            ""requestedOrgNumber"": ""987654321"",
            ""lastChanged"": ""2024-12-02T10:00:00""
        }
    ]";        
        _mockAltinn3Client
        .Setup(x => x.GetNotificationAddresses(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(jsonResponse);

        var resultList = await _altinnApiService.GetNotificationAddressesAltinn3(validOrgNumber, "TT02");
        var result = resultList[0];

        Assert.NotNull(result);
        Assert.Equal("test@test.no", result.Email);
        Assert.Equal(1, result.NotificationAddressId);
        Assert.Equal("NO", result.CountryCode);
        Assert.Equal("12345678", result.Phone);
        Assert.Equal("123456789", result.SourceOrgNumber);
        Assert.Equal("987654321", result.RequestedOrgNumber);
        Assert.Equal(DateTime.Parse("2024-12-02T10:00:00"), result.LastChanged);
    }


}