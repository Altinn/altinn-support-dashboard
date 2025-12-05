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
    private readonly Mock<IAltinnApiClient> _mockAltinn2Client;
    private readonly Mock<IAltinn3ApiClient> _mockAltinn3Client;

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

        _mockAltinn2Client = new Mock<IAltinnApiClient>();
        _mockAltinn3Client = new Mock<IAltinn3ApiClient>();
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
        Assert.IsType<Organization>(result);
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
    public async Task GetOrganizationInfo_ThrowsException_WhenResponseIsNull()
    {
        _mockAltinn2Client
        .Setup(x => x.GetOrganizationInfo(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _altinnApiService.GetOrganizationInfo("123456789", "TT02"));
    }

    [Fact]
    public async Task GetOrganizationInfo_UsesCorrectEnvironment()
    {
        _mockAltinn2Client
        .Setup(x => x.GetOrganizationInfo("123456789", "Production"))
        .ReturnsAsync("{\"organizationNumber\": \"123456789\"}");

        await _altinnApiService.GetOrganizationInfo("123456789", "Production");

        _mockAltinn2Client.Verify(x => x.GetOrganizationInfo("123456789", "Production"), Times.Once);
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
        Assert.IsType<List<Organization>>(resultList);

        
    }

    [Fact]
    public async Task RemovesDuplicates_FromOrganizationList()
    {
        //Using GetOrganizationsByPhoneNumber to check the private function RemoveOrganizationDuplicates, this is the one all the list with organizations go through
        var validPhoneNumber = "+4712345678";

        var jsonResponse = @"[
        {
            ""organizationNumber"": ""123456789""
        },
        {
            ""organizationNumber"": ""987654321""
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
        Assert.IsType<List<Organization>>(resultList);
    }

    [Theory]
    [InlineData("+4712345678")]
    [InlineData("+1112345678")]
    public async Task GetOrganizationsByPhoneNumber_StripsCountryCode(string phoneNumberWithCountryCode)
    {

        _mockAltinn2Client
        .Setup(x => x.GetOrganizationsByPhoneNumber(It.Is<string>(p => !p.StartsWith("+")), It.IsAny<string>()))
        .ReturnsAsync("[]");

        await _altinnApiService.GetOrganizationsByPhoneNumber(phoneNumberWithCountryCode, "TT02");

        _mockAltinn2Client.Verify(x => x.GetOrganizationsByPhoneNumber(It.Is<string>(p => !p.StartsWith("+")), It.IsAny<string>()), Times.Once);

    }

    [Theory]
    [InlineData("")]
    [InlineData("ahjhsjh")]
    public async Task GetOrganizationsByPhoneNumber_ThrowsArgumentException_WhenPhoneNumberIsInvalid(string invalidPhonenumber)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetOrganizationsByPhoneNumber(invalidPhonenumber, "TT02"));
    }

    [Fact]
    public async Task GetOrganizationsByPhoneNumber_UsesCorrectEnvironment()
    {
        _mockAltinn2Client
        .Setup(x => x.GetOrganizationsByPhoneNumber("12345678", "Production"))
        .ReturnsAsync("[]");

        await _altinnApiService.GetOrganizationsByPhoneNumber("12345678", "Production");

        _mockAltinn2Client.Verify(x => x.GetOrganizationsByPhoneNumber("12345678", "Production"), Times.Once);
    }

    [Fact]
    public async Task GetOrganizationsByPhoneNumber_ThrowsException_WhenResponseIsNull()
    {
        _mockAltinn2Client
        .Setup(x => x.GetOrganizationsByPhoneNumber(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _altinnApiService.GetOrganizationsByPhoneNumber("12345678", "TT02"));
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
        Assert.IsType<List<Organization>>(resultList);
        
    }
    [Theory]
    [InlineData("")]
    [InlineData("invalid-email")]
    [InlineData("test@.no")]
    [InlineData("test@test")]
    [InlineData("testtest.no")]
    public async Task GetOrganizationsByEmail_ThrowsAnArgumentException_WhenEmailIsInvalid(string invalidEmail)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetOrganizationsByEmail(invalidEmail, "TT02"));
    }
    [Fact]
    public async Task GetOrganizationsByEmail_ThrowsException_WhenResponseIsNull()
    {
        _mockAltinn2Client
        .Setup(x => x.GetOrganizationsByEmail(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _altinnApiService.GetOrganizationsByEmail("test@test.no", "TT02"));
    }

    [Fact]
    public async Task GetOrganizationsByEmail_UsesCorrectEnvironment()
    {
        _mockAltinn2Client
        .Setup(x => x.GetOrganizationsByEmail("test@test.no", "Production"))
        .ReturnsAsync("[]");

        await _altinnApiService.GetOrganizationsByEmail("test@test.no", "Production");

        _mockAltinn2Client.Verify(x => x.GetOrganizationsByEmail("test@test.no", "Production"), Times.Once);
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
        Assert.IsType<List<PersonalContact>>(resultList);
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
    public async Task GetPersonalContacts_ThrowsException_WhenResponseIsNull()
    {
        _mockAltinn2Client
        .Setup(x => x.GetPersonalContacts(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _altinnApiService.GetPersonalContacts("123456789", "TT02"));
    }

    [Fact]
    public async Task GetPersonalContacts_UsesCorrectEnvironment()
    {
        _mockAltinn2Client
        .Setup(x => x.GetPersonalContacts("123456789", "Production"))
        .ReturnsAsync("[]");

        await _altinnApiService.GetPersonalContacts("123456789", "Production");

        _mockAltinn2Client.Verify(x => x.GetPersonalContacts("123456789", "Production"), Times.Once);
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
        Assert.IsType<List<Role>>(resultList);
    }

    [Theory]
    [InlineData("", "12345678901")]
    [InlineData("123456789", "")]
    [InlineData("abcde", "12345678901")]
    [InlineData("1234569", "1234567")]
    public async Task GetPersonRoles_ThrowsArgumentException_WhenSubjectOrReporteeIsInvalid(string invalidSubject, string invalidReportee)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetPersonRoles(invalidSubject, invalidReportee, "TT02"));
    }

    [Fact]
    public async Task GetPersonRoles_UsesCorrectEnvironment()
    {
        _mockAltinn2Client
        .Setup(x => x.GetPersonRoles("123456789", "12345678901", "Production"))
        .ReturnsAsync("[]");

        await _altinnApiService.GetPersonRoles("123456789", "12345678901", "Production");

        _mockAltinn2Client.Verify(x => x.GetPersonRoles("123456789", "12345678901", "Production"), Times.Once);
    }

    [Fact]
    public async Task GetOfficialContacts_ReturnsContacts_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        var jsonResponse = @"[
            {
                ""MobileNumber"": ""12345678"",
                ""MobileNumberChanged"": ""2024-12-01T10:00:00""
            },
            {
                ""EMailAddress"": ""test@test.no"",
                ""EMailAddressChanged"": ""2024-11-30T15:30:00""
            }
        ]";
        _mockAltinn2Client
        .Setup(x => x.GetOfficialContacts(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(jsonResponse);

        var resultList = await _altinnApiService.GetOfficialContacts(validOrgNumber, "TT02");

        Assert.NotNull(resultList);
        Assert.Equal(2, resultList.Count);
        Assert.IsType<List<OfficialContact>>(resultList);
    }

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    public async Task GetOfficialContacts_ThrowsArgumentException_WhenOrgNumberIsInvalid(string invalidOrgNumber)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetOfficialContacts(invalidOrgNumber, "TT02"));
    }

    [Fact]
    public async Task GetOfficialContacts_UsesCorrectEnvironment()
    {
        _mockAltinn2Client
        .Setup(x => x.GetOfficialContacts("123456789", "Production"))
        .ReturnsAsync("[]");

        await _altinnApiService.GetOfficialContacts("123456789", "Production");

        _mockAltinn2Client.Verify(x => x.GetOfficialContacts("123456789", "Production"), Times.Once);
    }

    [Fact]
    public async Task GetOfficialContacts_ThrowsException_WhenResponseIsNull()
    {
        _mockAltinn2Client
        .Setup(x => x.GetOfficialContacts(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _altinnApiService.GetOfficialContacts("123456789", "TT02"));
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
        .Setup(x => x.GetPersonalContactsAltinn3(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(jsonResponse);

        var resultList = await _altinnApiService.GetPersonalContactsAltinn3(validOrgNumber, "TT02");

        Assert.NotNull(resultList);
        Assert.Equal(2, resultList.Count);
        Assert.IsType<List<PersonalContact>>(resultList);
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
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetPersonalContactsAltinn3(invalidOrgNumber, "TT02"));
    }

    [Fact]
    public async Task GetPersonalContactsAltinn3_UsesCorrectEnvironment()
    {
        _mockAltinn3Client
        .Setup(x => x.GetPersonalContactsAltinn3("123456789", "Production"))
        .ReturnsAsync("[]");

        await _altinnApiService.GetPersonalContactsAltinn3("123456789", "Production");

        _mockAltinn3Client.Verify(x => x.GetPersonalContactsAltinn3("123456789", "Production"), Times.Once);
    }

    [Fact]
    public async Task GetPersonalContactsAltinn3_ThrowsException_WhenResponseIsNull()
    {
        _mockAltinn3Client
        .Setup(x => x.GetPersonalContactsAltinn3(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _altinnApiService.GetPersonalContactsAltinn3("123456789", "TT02"));
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
        await Assert.ThrowsAsync<ArgumentException>(async () => await _altinnApiService.GetNotificationAddressesAltinn3(invalidOrgNumber, "TT02"));
    }

    [Fact]
    public async Task GetNotificationAddressesAltinn3_UsesCorrectEnvironment()
    {
        _mockAltinn3Client
        .Setup(x => x.GetNotificationAddresses("123456789", "Production"))
        .ReturnsAsync("[]");

        await _altinnApiService.GetNotificationAddressesAltinn3("123456789", "Production");

        _mockAltinn3Client.Verify(x => x.GetNotificationAddresses("123456789", "Production"), Times.Once);
    }

    [Fact]
    public async Task GetNotificationAddressesAltinn3_ThrowsException_WhenResponseIsNull()
    {
        _mockAltinn3Client
        .Setup(x => x.GetNotificationAddresses(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _altinnApiService.GetNotificationAddressesAltinn3("123456789", "TT02"));
    }


}