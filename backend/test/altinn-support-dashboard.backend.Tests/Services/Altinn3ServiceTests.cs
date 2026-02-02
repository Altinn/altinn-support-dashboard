using Altinn.ApiClients.Maskinporten.Config;
using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.Extensions.Compliance.Redaction;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Models.altinn3Dtos;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Services;


public class Altinn3ServiceTests
{
    private readonly Altinn3Service _altinnApiService;
    private readonly Mock<IAltinn3ApiClient> _mockAltinn3Client;
    private readonly Mock<IDataBrregService> _mockBreggService;
    private readonly Mock<ISsnTokenService> _mockSsnTokenService;
    private readonly Mock<IRedactorProvider> _mockRedactorProvider;
    private readonly Mock<ILogger<IAltinn3Service>> _mockLogger;
    private readonly Mock<IAltinnApiService> _mockAltinn2Service;

    public Altinn3ServiceTests()
    {
        var mockHttpClient = new Mock<IHttpClientFactory>();
        var mockConfig = new Mock<IOptions<Configuration>>();
        _mockBreggService = new Mock<IDataBrregService>();

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
                Ocp_Apim_Subscription_Key = "test",
                MaskinportenSettings = new MaskinportenSettings
                { }
            },
            Production = new EnvironmentConfiguration
            {
                Name = "Production",
                ThemeName = "test-theme",
                BaseAddressAltinn2 = "https://altinn.no",
                BaseAddressAltinn3 = "https://platform.altinn.no",
                Timeout = 30,
                Ocp_Apim_Subscription_Key = "test",
                ApiKey = "test-api-key",
                MaskinportenSettings = new MaskinportenSettings
                { }
            },
            Correspondence = new CorrespondenceResourceType { DefaultResourceId = "default", ConfidentialityResourceId = "confident" }
        });
        mockHttpClient.Setup(x => x.CreateClient(It.IsAny<string>()))
            .Returns(new HttpClient());

        _mockAltinn3Client = new Mock<IAltinn3ApiClient>();
        _mockSsnTokenService = new Mock<ISsnTokenService>();
        _mockRedactorProvider = new Mock<IRedactorProvider>();
        _mockLogger = new Mock<ILogger<IAltinn3Service>>();
        _mockAltinn2Service = new Mock<IAltinnApiService>();
        _altinnApiService = new Altinn3Service(_mockAltinn3Client.Object, _mockBreggService.Object, _mockSsnTokenService.Object, _mockRedactorProvider.Object, _mockLogger.Object, _mockAltinn2Service.Object);
    }
    [Fact]
    public async Task GetPersonalContactsAltinn3_ReturnsContacts_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        var jsonResponse = @"[
            {
                ""OrgNumber"": ""123456789"",
                ""NationalIdentityNumber"": ""01010112345"",
                ""Name"": ""Ola Nordmann"",
                ""Email"": ""test@test.no"",
                ""Phone"": ""12345678"",
                ""LastChanged"": ""2024-12-01T10:00:00""    
            },
            {
                ""OrgNumber"": ""123456789"",
                ""NationalIdentityNumber"": ""02020254321"",
                ""Name"": ""Kari Nordmann"",
                ""Email"": ""test1@test.no"",
                ""Phone"": ""87654321"",
                ""LastChanged"": ""2024-12-02T11:00:00""
            }
        ]";
        _mockAltinn3Client
        .Setup(x => x.GetPersonalContactsByOrg(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(jsonResponse);

        var resultList = await _altinnApiService.GetPersonalContactsByOrgAltinn3(validOrgNumber, "TT02");

        Assert.NotNull(resultList);
        Assert.Equal(2, resultList.Count);
        Assert.IsType<List<PersonalContactAltinn3>>(resultList);
    }

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    public async Task GetPersonalContactsAltinn3_ThrowsArgumentException_WhenOrgNumberIsInvalid(string invalidOrgNumber)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetPersonalContactsByOrgAltinn3(invalidOrgNumber, "TT02"));
    }

    [Fact]
    public async Task GetPersonalContactsAltinn3_UsesCorrectEnvironment()
    {
        _mockAltinn3Client
        .Setup(x => x.GetPersonalContactsByOrg("123456789", "Production"))
        .ReturnsAsync("[]");

        await _altinnApiService.GetPersonalContactsByOrgAltinn3("123456789", "Production");

        _mockAltinn3Client.Verify(x => x.GetPersonalContactsByOrg("123456789", "Production"), Times.Once);
    }

    [Fact]
    public async Task GetPersonalContactsAltinn3_ThrowsException_WhenResponseIsNull()
    {
        _mockAltinn3Client
        .Setup(x => x.GetPersonalContactsByOrg(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _altinnApiService.GetPersonalContactsByOrgAltinn3("123456789", "TT02"));
    }

    [Fact]
    public async Task GetNotificationAddressesAltinn3_ReturnsData_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
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
        .Setup(x => x.GetNotificationAddressesByOrg(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(jsonResponse);

        var resultList = await _altinnApiService.GetNotificationAddressesByOrgAltinn3(validOrgNumber, "TT02");
        var result = resultList[0];

        Assert.NotNull(result);
        Assert.IsType<List<NotificationAddressDto>>(resultList);

    }

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    public async Task GetNotificationAddressesAltinn3_ThrowsArgumentException_WhenOrgNumberIsInvalid(string invalidOrgNumber)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetNotificationAddressesByOrgAltinn3(invalidOrgNumber, "TT02"));
    }

    [Fact]
    public async Task GetNotificationAddressesAltinn3_UsesCorrectEnvironment()
    {
        _mockAltinn3Client
        .Setup(x => x.GetNotificationAddressesByOrg("123456789", "Production"))
        .ReturnsAsync("[]");

        await _altinnApiService.GetNotificationAddressesByOrgAltinn3("123456789", "Production");

        _mockAltinn3Client.Verify(x => x.GetNotificationAddressesByOrg("123456789", "Production"), Times.Once);
    }

    [Fact]
    public async Task GetNotificationAddressesAltinn3_ThrowsException_WhenResponseIsNull()
    {
        _mockAltinn3Client
        .Setup(x => x.GetNotificationAddressesByOrg(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _altinnApiService.GetNotificationAddressesByOrgAltinn3("123456789", "TT02"));
    }

    [Fact]
    public async Task GetRolesAndRightsAltinn3_SetsPersonType_WhenValueIsValidSsn()
    {
        var request = new RolesAndRightsRequest
        {
            Value = "01010112345", // valid SSN
            PartyFilter = new List<PartyFilter>
        {
            new PartyFilter { Value = "123456789" } // valid org
        }
        };

        var jsonResponse = @"[
        {
            ""role"": ""Daglig leder"",
            ""right"": ""Read""
        }
    ]";

        _mockAltinn3Client
            .Setup(x => x.GetRolesAndRightsAltinn3(It.IsAny<RolesAndRightsRequest>(), "TT02"))
            .ReturnsAsync(jsonResponse);

        var result = await _altinnApiService.GetRolesAndRightsAltinn3(request, "TT02");

        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("urn:altinn:person:identifier-no", request.Type);
        Assert.Equal("urn:altinn:organization:identifier-no", request.PartyFilter[0].Type);
    }
    [Fact]
    public async Task GetRolesAndRightsAltinn3_SetsOrgType_WhenValueIsOrgNumber()
    {
        var request = new RolesAndRightsRequest
        {
            Value = "123456789",
            PartyFilter = new List<PartyFilter>()
        };

        _mockAltinn3Client
            .Setup(x => x.GetRolesAndRightsAltinn3(It.IsAny<RolesAndRightsRequest>(), "TT02"))
            .ReturnsAsync("[]");

        await _altinnApiService.GetRolesAndRightsAltinn3(request, "TT02");

        Assert.Equal("urn:altinn:organization:identifier-no", request.Type);
    }
    [Fact]
    public async Task GetRolesAndRightsAltinn3_ThrowsException_WhenResponseIsNull()
    {
        var request = new RolesAndRightsRequest
        {
            Value = "123456789",
            PartyFilter = new List<PartyFilter>()
        };

        _mockAltinn3Client
            .Setup(x => x.GetRolesAndRightsAltinn3(It.IsAny<RolesAndRightsRequest>(), "TT02"))
            .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(() =>
            _altinnApiService.GetRolesAndRightsAltinn3(request, "TT02"));
    }

}
