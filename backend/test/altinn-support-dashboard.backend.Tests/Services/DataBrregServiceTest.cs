using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Services;


public class DataBrregServiceTest
{
    private readonly DataBrregService _dataBrregService;
    private readonly Mock<IDataBrregClient> _mockDataBrregClient;
    private readonly Mock<IPartyApiService> _mockPartyApiService;

    public DataBrregServiceTest()
    {
        _mockDataBrregClient = new Mock<IDataBrregClient>();
        _mockPartyApiService = new Mock<IPartyApiService>();

        _dataBrregService = new DataBrregService(_mockDataBrregClient.Object, _mockPartyApiService.Object);
    }

    [Fact]
    public async Task GetRolesAsync_ReturnsRoles_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        var mockResponse = "{\"rollegrupper\":[{\"navn\":\"Test Gruppe\",\"roller\":[{\"navn\":\"Test Rolle\"}]}]}";

        _mockDataBrregClient
        .Setup(x => x.GetRolesAsync(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(mockResponse);

        var result = await _dataBrregService.GetRolesAsync(validOrgNumber, "TT02");

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    [InlineData("123 456 789")]
    [InlineData("      ")]
    public async Task GetRolesAsync_ThrowsArgumentException_WhenOrgNumberIsInvalid(string invalidOrgNumber)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _dataBrregService.GetRolesAsync(invalidOrgNumber, "TT02"));
    }

    [Theory]
    [InlineData("Production ")]
    [InlineData("pRoduction")]
    [InlineData("test")]
    [InlineData("dev")]
    [InlineData("TT01")]
    [InlineData("")]
    [InlineData("Tt02")]
    [InlineData("TT02 ")]
    public async Task GetRolesAsync_ThrowsArgumentException_WhenEnvironmentIsInvalid(string invalidEnvironment)
    {
        var validOrgNumber = "123456789";

        await Assert.ThrowsAsync<ArgumentException>(async () => await _dataBrregService.GetRolesAsync(validOrgNumber, invalidEnvironment));
    }

    [Fact]
    public async Task GetRolesAsync_ReturnsEmptyList_WhenNoRolesFound()
    {
        var validOrgNumber = "123456789";

        _mockDataBrregClient
        .Setup(x => x.GetRolesAsync(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        var result = await _dataBrregService.GetRolesAsync(validOrgNumber, "TT02");

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);
        if (result.Rollegrupper != null)
        {
            Assert.Empty(result.Rollegrupper);
        }
    }

    [Fact]
    public async Task GetRolesAsync_CallsPartyApiService_WhenEnvironmentIsTT02AndNoRolesFound()
    {
        var validOrgNumber = "123456789";
        var expectedRoles = new ErRollerModel
        {
            Rollegrupper = new List<Rollegrupper>
            {
                new Rollegrupper
                {
                    Roller = new List<Roller>
                    {
                        new Roller { Type = new Server.Models.Type {Kode = "Test", Beskrivelse = "Testing" } }
                    }
                }
            }
        };

        _mockDataBrregClient
        .Setup(x => x.GetRolesAsync(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("");

        _mockPartyApiService
        .Setup(x => x.GetRolesFromOrgAsync(It.IsAny<string>()))
        .ReturnsAsync(expectedRoles);

        var result = await _dataBrregService.GetRolesAsync(validOrgNumber, "TT02");

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);
        _mockPartyApiService.Verify(x => x.GetRolesFromOrgAsync(validOrgNumber), Times.Once);
    }

    [Fact]
    public async Task GetRolesAsync_ReturnsNewErRollerModel_WhenNoRolesFoundInPartyApiService()
    {
        var validOrgNumber = "123456789";

        _mockDataBrregClient
        .Setup(x => x.GetRolesAsync(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("");

        _mockPartyApiService
        .Setup(x => x.GetRolesFromOrgAsync(It.IsAny<string>()))
        .ReturnsAsync((ErRollerModel)null!);

        var result = await _dataBrregService.GetRolesAsync(validOrgNumber, "TT02");

        Assert.NotNull(result);
        Assert.IsType<ErRollerModel>(result);
        if (result.Rollegrupper != null && result.ApiRoller != null)
        {
            Assert.Empty(result.Rollegrupper);
            Assert.Empty(result.ApiRoller);
            Assert.Null(result.Links);
        }
    }

    [Fact]
    public async Task GetUnderenheter_ReturnsUnderenheter_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        var mockResponse = "{\"underenheter\":[{\"organisasjonsnummer\":\"987654321\",\"navn\":\"Underenhet 1\"}]}";

        _mockDataBrregClient
        .Setup(x => x.GetUnderenheter(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(mockResponse);

        var result = await _dataBrregService.GetUnderenheter(validOrgNumber, "TT02");

        Assert.NotNull(result);
        Assert.IsType<UnderenhetRootObject>(result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    [InlineData("123 456 789")]
    [InlineData("      ")]
    public async Task GetUnderenheter_ThrowsArgumentException_WhenOrgNumberIsInvalid(string invalidOrgNumber)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _dataBrregService.GetUnderenheter(invalidOrgNumber, "TT02"));
    }

    [Theory]
    [InlineData("Production ")]
    [InlineData("pRoduction")]
    [InlineData("test")]
    [InlineData("dev")]
    [InlineData("TT01")]
    [InlineData("")]
    [InlineData("Tt02")]
    [InlineData("TT02 ")]
    public async Task GetUnderenheter_ThrowsArgumentException_WhenEnvironmentIsInvalid(string invalidEnvironment)
    {
        var validOrgNumber = "123456789";

        await Assert.ThrowsAsync<ArgumentException>(async () => await _dataBrregService.GetUnderenheter(validOrgNumber, invalidEnvironment));
    }

    [Fact]
    public async Task GetUnderenheter_ReturnsNewUnderenhetRootObject_WhenNoUnderenheterFound()
    {
        var validOrgNumber = "123456789";

        _mockDataBrregClient
        .Setup(x => x.GetUnderenheter(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        var result = await _dataBrregService.GetUnderenheter(validOrgNumber, "TT02");

        Assert.NotNull(result);
        Assert.IsType<UnderenhetRootObject>(result);
        Assert.Null(result.page);
        Assert.Null(result._embedded);
        Assert.Null(result._links);
    }

    [Fact]
    public async Task GetEnhetsdetaljer_ReturnsEnhetsdetaljer_WhenOrgNumberIsValid()
    {
        var validOrgNumber = "123456789";
        var mockResponse = @"{
        ""organisasjonsnummer"": ""123456789"",
        ""navn"": ""Test Enhet"", 
        ""organisasjonsform"": {""kode"": ""AS"", ""beskrivelse"": ""Aksjeselskap""}
        }";

        _mockDataBrregClient
        .Setup(x => x.GetEnhetsdetaljer(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync(mockResponse);

        var result = await _dataBrregService.GetEnhetsdetaljer(validOrgNumber, "TT02");

        Assert.NotNull(result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    [InlineData("123 456 789")]
    [InlineData("      ")]
    public async Task GetEnhetsdetaljer_ThrowsArgumentException_WhenOrgNumberIsInvalid(string invalidOrgNumber)
    {
        await Assert.ThrowsAsync<ArgumentException>(async () => await _dataBrregService.GetEnhetsdetaljer(invalidOrgNumber, "TT02"));
    }

    [Theory]
    [InlineData("Production ")]
    [InlineData("pRoduction")]
    [InlineData("test")]
    [InlineData("dev")]
    [InlineData("TT01")]
    [InlineData("")]
    [InlineData("Tt02")]
    [InlineData("TT02 ")]
    public async Task GetEnhetsdetaljer_ThrowsArgumentException_WhenEnvironmentIsInvalid(string invalidEnvironment)
    {
        var validOrgNumber = "123456789";
        await Assert.ThrowsAsync<ArgumentException>(async () => await _dataBrregService.GetEnhetsdetaljer(validOrgNumber, invalidEnvironment));
    }
    
    [Fact]
    public async Task GetEnhetsdetaljer_ThrowsException_WhenResultIsNull()
    {
        var validOrgNumber = "123456789";

        _mockDataBrregClient
        .Setup(x => x.GetEnhetsdetaljer(It.IsAny<string>(), It.IsAny<string>()))
        .ReturnsAsync("null");

        await Assert.ThrowsAsync<Exception>(async () => await _dataBrregService.GetEnhetsdetaljer(validOrgNumber, "TT02"));
    }
}