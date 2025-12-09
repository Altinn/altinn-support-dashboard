using altinn_support_dashboard.Server.Models;
using altinn_support_dashboard.Server.Services;
using altinn_support_dashboard.Server.Services.Interfaces;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Services;


public class DataBrregServiceTest
{
    private readonly DataBrregService _dataBrregService;
    private readonly Mock<IDataBrregClient> _mockDataBrregClient;

    public DataBrregServiceTest()
    {
        _mockDataBrregClient = new Mock<IDataBrregClient>();
        var mockPartyApiService = new Mock<IPartyApiService>();

        _dataBrregService = new DataBrregService(_mockDataBrregClient.Object, mockPartyApiService.Object);
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
}