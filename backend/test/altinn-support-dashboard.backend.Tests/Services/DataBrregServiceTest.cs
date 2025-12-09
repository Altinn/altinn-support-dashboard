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
}