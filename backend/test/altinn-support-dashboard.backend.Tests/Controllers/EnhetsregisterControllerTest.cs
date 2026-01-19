using altinn_support_dashboard.Server.Controllers;
using altinn_support_dashboard.Server.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace altinn_support_dashboard.backend.Tests.Controllers;

public class EnhetsregisterControllerTest
{
    private readonly EnhetsregisterController _controller;
    private readonly Mock<IDataBrregService> _dataBrregServiceMock;

    public EnhetsregisterControllerTest()
    {
        _dataBrregServiceMock = new Mock<IDataBrregService>();
        _controller = new EnhetsregisterController(_dataBrregServiceMock.Object);
    }

    [Fact]
    public async Task GetEnhetsDetaljer_ReturnsOk_WhenOrgNumberIsValid()
    {
        var orgnr = "123456789";
        var expectedResult = new { OrganizationNumber = orgnr };

        _dataBrregServiceMock
            .Setup(s => s.GetEnhetsdetaljer(orgnr, "Production"))
            .ReturnsAsync(expectedResult);

        var result = await _controller.GetEnhetsdetaljer("Production", orgnr);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedResult, okResult.Value);
    }

    [Theory]
    [InlineData("")]
    [InlineData("999")]
    [InlineData("12345678")]
    [InlineData("1234567890")]
    [InlineData("abcdefghi")]
    [InlineData("abcdefghij")]
    [InlineData("1d2d3d4d5")]
    [InlineData("   ")]
    public async Task GetEnhetsDetaljer_ReturnsBadRequest_WhenOrgNumberIsInvalid(string orgNumber)
    {
        var result = await _controller.GetEnhetsdetaljer("Production", orgNumber);
        Assert.IsType<BadRequestObjectResult>(result);
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
    public async Task GetEnhetsDetaljer_ReturnsBadRequest_WhenEnvironmentIsInvalid(string environment)
    {
        var orgNumber = "123456789";
        var result = await _controller.GetEnhetsdetaljer(environment, orgNumber);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Theory]
    [InlineData("Production")]
    [InlineData("TT02")]
    public async Task GetEnhetsDetaljer_WorksForBothEnvironments(string environment)
    {
        var orgnr = "123456789";
        var expectedResult = new { OrganizationNumber = orgnr };

        _dataBrregServiceMock
            .Setup(s => s.GetEnhetsdetaljer(orgnr, environment))
            .ReturnsAsync(expectedResult);
        
        var result = await _controller.GetEnhetsdetaljer(environment, orgnr);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedResult, okResult.Value);
    }
}