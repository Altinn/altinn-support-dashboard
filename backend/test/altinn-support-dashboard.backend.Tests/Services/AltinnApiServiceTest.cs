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

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    public async Task GetOrganizationInfo_ThrowsArgumentException_WhenOrgNumberIsInvalid(string invalidOrgNumber)
    {

        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetOrganizationInfo(invalidOrgNumber, "TT02"));
    }

    [Fact]
    public async Task GetOrganizationsByPhoneNumber_ReturnsOrganizations_WhenPhoneNumberIsValid()
    {
        var validPhoneNumber = "+4712345678";

        var jsonResponse = @"[
        {
            ""organizationNumber"": ""123456789""
        },
        {
            ""organizationNumber"": ""987654321""
        }
        ]";
        _mockAltinn2Client
        .Setup(x => x.GetOrganizationsByPhoneNumber(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(jsonResponse);

        var resultList = await _altinnApiService.GetOrganizationsByPhoneNumber(validPhoneNumber, "TT02");
    
        Assert.NotNull(resultList);
        Assert.Equal(2, resultList.Count);
        Assert.Equal("123456789", resultList[0].OrganizationNumber);
        Assert.Equal("987654321", resultList[1].OrganizationNumber);

        
    }

    [Theory]
    [InlineData("")]
    [InlineData("ahjhsjh")]
    public async Task GetOrganizationsByPhoneNumber_ThrowsArgumentException_WhenPhoneNumberIsInvalid(string invalidPhonenumber)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetOrganizationsByPhoneNumber(invalidPhonenumber, "TT02"));
    }

    [Fact]
    public async Task GetOrganizationsByEmail_ReturnsOrganizations_WhenEmailIsValid()
    {
        var validEmail = "test@test.no";
        var jsonResponse = @"[
        {
            ""organizationNumber"": ""123456789""
        },
        {
            ""organizationNumber"": ""987654321""
        }
        ]";
        _mockAltinn2Client
        .Setup(x => x.GetOrganizationsByEmail(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(jsonResponse);

        var resultList = await _altinnApiService.GetOrganizationsByEmail(validEmail, "TT02");

        Assert.NotNull(resultList);
        Assert.Equal(2, resultList.Count);
        Assert.Equal("123456789", resultList[0].OrganizationNumber);
        Assert.Equal("987654321", resultList[1].OrganizationNumber);
    }
    [Theory]
    [InlineData("")]
    [InlineData("invalid-email")]
    [InlineData("test@.no")]
    [InlineData("test@test")]
    [InlineData("testtest.no")]
    public async Task GetOrganizationByEmail_ThrowsAnArgumentException_WhenEmailIsInvalid(string invalidEmail)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetOrganizationsByEmail(invalidEmail, "TT02"));
    }

    [Fact]
    public async Task GetPersonalContacts_ReturnsContacts_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        var jsonResponse = @"[
        {
            ""PersonalContactId"": ""1"",
            ""Name"": ""Ola"",
            ""MobileNumber"": ""12345678""
            },
            {
            ""PersonalContactId"": ""2"",
            ""Name"": ""Kari"",
            ""MobileNumber"": ""87654321""
            }
            
        ]";
        _mockAltinn2Client
        .Setup(x => x.GetPersonalContacts(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(jsonResponse);

        var resultList = await _altinnApiService.GetPersonalContacts(validOrgNumber, "TT02");

        Assert.NotNull(resultList);
        Assert.Equal(2, resultList.Count);
        Assert.Equal("1", resultList[0].PersonalContactId);
        Assert.Equal("Ola", resultList[0].Name);
        Assert.Equal("2", resultList[1].PersonalContactId);
        Assert.Equal("Kari", resultList[1].Name);
    }

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    public async Task GetPersonalContacts_ThrowsArgumentException_WhenOrgNumberIsInvalid(string invalidOrgNumber)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetPersonalContacts(invalidOrgNumber, "TT02"));
    }

    [Fact]
    public async Task GetPersonRoles_ReturnsRoles_WhenSubjectAndReporteeAreValid()
    {
        var validSubject = "123456789";
        var validReportee = "12345678901";
        var jsonResponse = @"[
            {
                ""RoleId"": 1,
                ""RoleType"": ""Altinn"",
                ""RoleName"": ""Daglig Leder""
            },
            {
                ""RoleId"": 2,
                ""RoleType"": ""Ekstern"",
                ""RoleName"": ""Styremedlem""
            }
        ]";
        _mockAltinn2Client
        .Setup(x => x.GetPersonRoles(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(jsonResponse);

        var resultList = await _altinnApiService.GetPersonRoles(validSubject, validReportee, "TT02");

        Assert.NotNull(resultList);
        Assert.Equal(2, resultList.Count);
        Assert.Equal("1", resultList[0].RoleId.ToString());
        Assert.Equal("Altinn", resultList[0].RoleType);
        Assert.Equal("Daglig Leder", resultList[0].RoleName);
        Assert.Equal("2", resultList[1].RoleId.ToString());
        Assert.Equal("Ekstern", resultList[1].RoleType);
        Assert.Equal("Styremedlem", resultList[1].RoleName);
    }

    [Theory]
    [InlineData("", "12345678901")]
    [InlineData("123456789", "")]
    [InlineData("abcde", "12345678901")]
    public async Task GetPersonRoles_ThrowsArgumentException_WhenSubjectOrReporteeIsInvalid(string invalidSubject, string invalidReportee)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetPersonRoles(invalidSubject, invalidReportee, "TT02"));
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